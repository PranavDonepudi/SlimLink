//In one terminal npm start frontend, In another npm start backend, connect to local database on mongodb compass, 
//postman get shortened link: { "longURL":"*ORIGINAL LINK*"}, in the body section select RAW
//postman check analytics: GET http://localhost:5001/analytics/*INSERT SHORTENED CODE*
//if you have problems with the server stalling removing and adding the package-lock.json again seems to help. 
//"rm -rf node_modules package-lock.json" and "npm install"

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const useragent = require('express-useragent');
const { Bigtable } = require('@google-cloud/bigtable');
const Memcached = require('memcached');

const app = express();

// Fetch values from environment variables
const projectId = process.env.BIGTABLE_PROJECT_ID;
const instanceId = process.env.BIGTABLE_INSTANCE_ID;
const keyFilename = process.env.BIGTABLE_KEYFILE;

// Bigtable setup
const bigtable = new Bigtable({ projectId, keyFilename });
const instance = bigtable.instance(instanceId);
const urlTable = instance.table('slimlink-URLs');
const userMetadataTable = instance.table('slimlink-users');

// Memcached setup
const memcached = new Memcached('localhost:7001');

app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(useragent.express());

app.listen(5001, () => console.log("Server running on port 5001"));

// Rate limiter
const clickLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: "This IP has tried to access this link too many times, please try again after an hour."
});
app.use('/track-click', clickLimiter);

const shortenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, //1 hour
  max: 50, // Limit to 50 URL shortening requests per IP per hour
  message: "You have exceeded the limit of 50 URL shortening requests per hour. Please try again later.",
});

// Generate short URL
function generateShortURL(length = 6) {
  return `https://sl.to/${[...Array(length)].map(() => Math.random().toString(36)[2]).join('')}`;
}

// Update analytics
async function updateAnalytics(rowKey, deviceType, ipAddress) {
  try {
    const [row] = await urlTable.row(rowKey).get();

    if (row) {
      const clicks = Number(row.data.metadata.clicks[0].value) + 1;
      await urlTable.row(rowKey).save({ metadata: { clicks: clicks.toString() } });

      const metadataRowKey = `${rowKey}-${Date.now()}`;
      await userMetadataTable.insert({
        key: metadataRowKey,
        data: {
          details: {
            timestamp: new Date().toISOString(),
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        },
      });
    }
  } catch (err) {
    console.error("Error updating analytics:", err);
  }
}

// Shorten URL
app.post('/shorten', shortenLimiter, async (req, res) => {
  const { longURL } = req.body;

  const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/;
  if (!regex.test(longURL)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const shortURL = generateShortURL();
  const rowKey = shortURL.split('/').pop();

  // Store in Bigtable
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

  // Cache in Memcached
  memcached.set(rowKey, longURL, 3600, (err) => { // Cache for 1 hour
    if (err) console.error("Memcached error:", err);
  });

  res.json({ shortURL });
});

// Redirect to original link and track metadata
app.get('/:shortURL', clickLimiter, async (req, res) => {
  const { shortURL } = req.params;
  const deviceType = req.useragent.isMobile ? 'Mobile' : req.useragent.isTablet ? 'Tablet' : 'Desktop';
  const ipAddress = req.ip;
  const rowKey = shortURL.split('/').pop();

  // Check cache first
  memcached.get(rowKey, async (err, longURL) => {
    if (err) {
      console.error("Memcached error:", err);
    }

    if (longURL) {
      // Long URL found in cache
      await updateAnalytics(rowKey, deviceType, ipAddress); // Update analytics
      res.redirect(longURL);
    } else {
      // Fetch from Bigtable
      const [row] = await urlTable.row(rowKey).get();
      if (row) {
        longURL = row.data.metadata.longURL[0].value;

        // Update cache
        memcached.set(rowKey, longURL, 3600, (err) => {
          if (err) console.error("Memcached error:", err);
        });

        await updateAnalytics(rowKey, deviceType, ipAddress); // Update analytics
        res.redirect(longURL);
      } else {
        res.status(404).json({ error: "URL not found" });
      }
    }
  });
});

// Get analytics
app.get('/analytics/:shortURL', async (req, res) => {
  const { shortURL } = req.params;
  const rowKey = shortURL.split('/').pop();

  // Check cache for analytics
  memcached.get(`${rowKey}-analytics`, async (err, cachedAnalytics) => {
    if (err) console.error("Memcached error:", err);

    if (cachedAnalytics) {
      res.json(JSON.parse(cachedAnalytics));
    } else {
      // Fetch from Bigtable
      const [urlRow] = await urlTable.row(rowKey).get();
      if (urlRow) {
        const [metadataRows] = await userMetadataTable.getRows({ prefix: rowKey });

        const analytics = metadataRows.map(row => ({
          timestamp: row.data.details.timestamp[0].value,
          deviceType: row.data.details.deviceType[0].value,
          ipAddress: row.data.details.ipAddress[0].value,
        }));

        const response = {
          longURL: urlRow.data.metadata.longURL[0].value,
          shortURL: urlRow.data.metadata.shortURL[0].value,
          clicks: Number(urlRow.data.metadata.clicks[0].value),
          analytics,
        };

        // Cache analytics
        memcached.set(`${rowKey}-analytics`, JSON.stringify(response), 900, (err) => { // Cache for 15 minutes
          if (err) console.error("Memcached error:", err);
        });

        res.json(response);
      } else {
        res.status(404).json({ error: "URL not found" });
      }
    }
  });
});