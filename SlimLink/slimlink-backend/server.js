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

app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(useragent.express());

app.listen(5001, () => console.log("Server running on port 5001"));

// Rate limiter
const clickLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: "There are too many clicks from this IP, please try again after an hour."
});
app.use('/track-click', clickLimiter);

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

  res.json({ shortURL });
});

// Redirect to original link and track metadata
app.get('/:shortURL', clickLimiter, async (req, res) => {
  const { shortURL } = req.params;
  const deviceType = req.useragent.isMobile ? 'Mobile' : req.useragent.isTablet ? 'Tablet' : 'Desktop';
  const ipAddress = req.ip;
  const rowKey = shortURL.split('/').pop();

  const [row] = await urlTable.row(rowKey).get();

  if (row) {
    const longURL = row.data.metadata.longURL[0].value;
    const clicks = Number(row.data.metadata.clicks[0].value) + 1;

    // Update click count in URLTable
    await urlTable.row(rowKey).save({
      metadata: { clicks: clicks.toString() },
    });

    // Save user metadata in UserMetadataTable
    const metadataRowKey = `${rowKey}-${Date.now()}`; // Unique key for each user click
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

    res.redirect(longURL);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
});

// Get analytics
app.get('/analytics/:shortURL', async (req, res) => {
  const { shortURL } = req.params;
  const rowKey = shortURL.split('/').pop();

  const [urlRow] = await urlTable.row(rowKey).get();

  if (urlRow) {
    const [metadataRows] = await userMetadataTable.getRows({
      prefix: rowKey,
    });

    const analytics = metadataRows.map(row => ({
      timestamp: row.data.details.timestamp[0].value,
      deviceType: row.data.details.deviceType[0].value,
      ipAddress: row.data.details.ipAddress[0].value,
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

