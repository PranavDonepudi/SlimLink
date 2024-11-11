//In one terminal npm start frontend, In another npm start backend, connect to local database on mongodb compass, 
//postman get shortened link: { "longURL":"*ORIGINAL LINK*"}, in the body section select RAW
//postman check analytics: GET http://localhost:5001/analytics/*INSERT SHORTENED CODE*
//if you have problems with the server stalling removing and adding the package-lock.json again seems to help. 
//"rm -rf node_modules package-lock.json" and "npm install"

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const useragent = require('express-useragent');




const app = express();
//Allow frontend to communicate with backend since they are on different ports
// app.use(cors());
const corsOptions = {
  origin: "http://localhost:3000", 
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(useragent.express());

app.listen(5001, () => console.log("Server running on port 5001"));

const clickLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, //1 hour
  max: 100,
  message: "There are too many clicks from this IP, please try again after an hour."
});
app.use('/track-click', clickLimiter);


//Connect to local mongodb instance, 27017 is default
mongoose.connect('mongodb://localhost:27017/slimlink', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const urlSchema = new mongoose.Schema({
    longURL: { type: String, required: true },
    shortURL: { type: String, required: true },
    clicks: { type: Number, default: 0 },  //Tracking number of clicks
    //analytics array adds an element on click
    analytics: [
      {
        timestamp: { type: Date, default: Date.now },
        deviceType: { type: String },
        ipAddress: { type: String }
      }]
});

const URL = mongoose.model('URL', urlSchema);

//Generate the shorter link function
function generateShortURL(length = 5) {
    return `https://sl.to/${[...Array(length)].map(() => Math.random().toString(36)[2]).join('')}`;
}

//Shorten URL and init analytics
app.post('/shorten', async (req, res) => {
    const { longURL } = req.body;
  
    //Validate format
    const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/;
    if (!regex.test(longURL)) {
      return res.status(400).json({ error: "Invalid URL" });
    }
  
    //Generate short URL
    const shortURL = generateShortURL();
  
    //Save the long URL, short URL, and initialize clicks to 0
    const newURL = new URL({ longURL, shortURL, clicks: 0, analytics: [] });
    await newURL.save();
  
    res.json({ shortURL });
});

//Route to original link
app.get('/:shortURL', clickLimiter, async (req, res) => {
    const { shortURL } = req.params;
    const deviceType = req.useragent.isMobile ? 'Mobile' : req.useragent.isTablet ? 'Tablet' : 'Desktop';
    const ipAddress = req.ip;
    
    //Find the matching URL by from the short URL
    const url = await URL.findOne({ shortURL: `https://sl.to/${shortURL}` });
  
    if (url) {
      //Increment the click count
      url.clicks += 1;
      url.analytics.push({ deviceType, ipAddress });
      console.log(`Device Type: ${deviceType}, IP Address: ${ipAddress}`);
      await url.save(); //Save the updated click count
      
      //Redirect to the original long URL
      res.redirect(url.longURL);
    } else {
      res.status(404).json({ error: "URL not found" });
    }
  });

  //Get analytics
  app.get('/analytics/:shortURL', async (req, res) => {
    const { shortURL } = req.params;
    
    //Find the URL entry
    const url = await URL.findOne({ shortURL: `https://sl.to/${shortURL}` });
    
    if (url) {
      res.json({
        longURL: url.longURL,
        shortURL: url.shortURL,
        clicks: url.clicks,
        analytics: url.analytics
      });
    } else {
      res.status(404).json({ error: "URL not found" });
    }
  });
