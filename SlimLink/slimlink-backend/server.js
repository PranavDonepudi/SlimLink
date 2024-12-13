//In one terminal npm start frontend, In another npm start backend, connect to local database on mongodb compass, 
//postman get shortened link: { "longURL":"*ORIGINAL LINK*"}, in the body section select RAW
//postman check analytics: GET http://localhost:5001/analytics/*INSERT SHORTENED CODE*
//if you have problems with the server stalling removing and adding the package-lock.json again seems to help. 
//"rm -rf node_modules package-lock.json" and "npm install"

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const useragent = require('express-useragent');
const axios = require('axios'); // For geolocation API
const { createClient } = require('redis');
const { Bigtable } = require('@google-cloud/bigtable');

const app = express();

// Redis setup
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

const initializeApp = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis Memorystore");

    // Bigtable setup
    const projectId = 'rice-comp-539-spring-2022';
    const instanceId = 'comp-539-bigtable';
    const keyFilename = 'rice-comp-539-spring-2022-7ca5b5cf02a4.json';

    const bigtable = new Bigtable({
      projectId,
      keyFilename,
    });
    const instance = bigtable.instance(instanceId);
    const urlTable = instance.table('slimlink-URLs');
    const userMetadataTable = instance.table('slimlink-users');

    // Express setup
    app.use(cors({ origin: "http://localhost:3001", optionsSuccessStatus: 200 }));
    app.use(express.json());
    app.use(useragent.express());

    // Rate limiter
    const clickLimiter = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 100,
      message: "Too many requests. Try again later.",
    });
    app.use('/track-click', clickLimiter);

    // Geolocation API
    const GEOLOCATION_API_URL = 'http://ip-api.com/json'; // To be replaced with preferred service

    // Generate short URL
    function generateShortURL(length = 6) {
      return `https://sl.to/${[...Array(length)].map(() => Math.random().toString(36)[2]).join('')}`;
    }

    // Shorten URL
    app.post('/shorten', async (req, res) => {
      const { longURL } = req.body;

      const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/;
      if (!regex.test(longURL)) {
        return res.status(400).json({ error: "Invalid URL" });
      }

      const shortURL = generateShortURL();
      const rowKey = shortURL.split('/').pop();

      // Save to Bigtable
      await urlTable.insert({
        key: rowKey,
        data: {
          metadata: {
            longURL: longURL,
            shortURL: shortURL,
            clicks: 0,
            createdAt: new Date().toISOString(),
          },
        },
      });

      // Cache in Redis
      await redisClient.hSet(rowKey, {
        longURL,
        shortURL,
        clicks: 0,
      });

      res.json({ shortURL });
    });

    // Redirect to original link and track metadata
    app.get('/:shortURL', clickLimiter, async (req, res) => {
      const { shortURL } = req.params;
      const deviceType = req.useragent.isMobile ? 'Mobile' : req.useragent.isTablet ? 'Tablet' : 'Desktop';
      const ipAddress = req.ip;
      const rowKey = shortURL.split('/').pop();

      // Check Redis cache
      const cachedData = await redisClient.hGetAll(rowKey);
      let longURL;

      if (cachedData && cachedData.longURL) {
        longURL = cachedData.longURL;
        cachedData.clicks = parseInt(cachedData.clicks) + 1;

        // Update Redis cache
        await redisClient.hSet(rowKey, cachedData);
      } else {
        // Fallback to Bigtable
        const [row] = await urlTable.row(rowKey).get();

        if (row) {
          longURL = row.data.metadata.longURL[0].value;
          const clicks = Number(row.data.metadata.clicks[0].value) + 1;

          // Update Bigtable
          await urlTable.row(rowKey).save({
            metadata: { clicks: clicks.toString() },
          });

          // Cache in Redis
          await redisClient.hSet(rowKey, {
            longURL,
            shortURL: `https://sl.to/${rowKey}`,
            clicks,
          });
        } else {
          return res.status(404).json({ error: "URL not found" });
        }
      }

      // Get geolocation
      const geoResponse = await axios.get(`${GEOLOCATION_API_URL}/${ipAddress}`);
      const { city, regionName, country } = geoResponse.data;

      // Simulate screen time delay for tracking (use `setTimeout` for now)
      const startTime = Date.now();
      setTimeout(async () => {
        const endTime = Date.now();
        const screenTime = endTime - startTime;

        // Save user metadata in Bigtable
        const metadataRowKey = `${rowKey}-${Date.now()}`; // Unique key for each user click
        await userMetadataTable.insert({
          key: metadataRowKey,
          data: {
            details: {
              timestamp: new Date().toISOString(),
              deviceType: deviceType,
              ipAddress: ipAddress,
              screenTime: screenTime.toString(),
              location: `${city}, ${regionName}, ${country}`,
            },
          },
        });

        res.redirect(longURL);
      }, 1000); // Simulate 1 second screen time for the user
    });

    // Get analytics
    app.get('/analytics/:shortURL', async (req, res) => {
      const { shortURL } = req.params;
      const rowKey = shortURL.split('/').pop();

      // Check Redis cache
      const cachedData = await redisClient.hGetAll(rowKey);

      if (cachedData && cachedData.clicks) {
        // Analytics from Redis (only URL stats, not user analytics)
        const [metadataRows] = await userMetadataTable.getRows({ prefix: rowKey });
        const analytics = metadataRows.map(row => ({
          timestamp: row.data.details.timestamp[0].value,
          deviceType: row.data.details.deviceType[0].value,
          ipAddress: row.data.details.ipAddress[0].value,
          screenTime: row.data.details.screenTime ? row.data.details.screenTime[0].value : "Unknown",
          location: row.data.details.location ? row.data.details.location[0].value : "Unknown",
        }));

        return res.json({
          longURL: cachedData.longURL,
          shortURL: cachedData.shortURL,
          clicks: parseInt(cachedData.clicks),
          analytics,
        });
      }

      // Fallback to Bigtable
      const [urlRow] = await urlTable.row(rowKey).get();

      if (urlRow) {
        const [metadataRows] = await userMetadataTable.getRows({
          prefix: rowKey,
        });

        const analytics = metadataRows.map(row => ({
          timestamp: row.data.details.timestamp[0].value,
          deviceType: row.data.details.deviceType[0].value,
          ipAddress: row.data.details.ipAddress[0].value,
          screenTime: row.data.details.screenTime ? row.data.details.screenTime[0].value : "Unknown",
          location: row.data.details.location ? row.data.details.location[0].value : "Unknown",
        }));

        res.json({
          longURL: urlRow.data.metadata.longURL[0].value,
          shortURL: urlRow.data.metadata.shortURL[0].value,
          clicks: Number(urlRow.data.metadata.clicks[0].value),
          analytics,
        });
      } else {
        res.status(404).json({ error: "URL not found" });
      }
    });

    app.listen(5001, () => console.log("Server running on port 5001"));
  } catch (error) {
    console.error("Failed to initialize the app:", error);
  }
};

initializeApp();