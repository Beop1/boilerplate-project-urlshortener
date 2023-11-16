require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ShortId = require('shortid')
const app = express();
let bodyParser = require('body-parser');
const validator = require('validator');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let Urls = {};
 
app.post('/api/shorturl', (req, res) =>{
  
  let url = req.body.url;
  if(!validator.isURL(url)){
    return res.json({error: 'invalid url'});
  }

  let short_url = ShortId.generate();

  Urls[short_url] = url;

  return res.json({original_url: url, short_url});
});

app.get('/api/shorturl/:shortenedUrl', (req, res) => {
  const short_url = req.params.shortenedUrl;

  res.redirect(Urls[short_url]);
});
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
