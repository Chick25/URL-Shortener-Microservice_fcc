require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyparser = require('body-parser');
const { error } = require('console');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json());

let urlDataBase = {};
let idCounter = 1;


app.post('/api/shorturl', (req, res)=>{
  const original_url = req.body.url;

  const urlPattern = /^https?:\/\/[^ "]+$/;
  if(!urlPattern.test(original_url)){
    return res.json({error: 'invalid url'});
  }

  const hostname = original_url.replace(/^https?:\/\//, '').split('/')[0];
  dns.lookup(hostname, (err, address)=>{
    if(err){
      return res.json({error: 'invalid url'});
    }
    const short_url = idCounter++;
    urlDataBase[short_url] = original_url;

    res.json({
      original_url: original_url,
      short_url: short_url
    });
  });
});

app.get('/api/shorturl/:short_url', (req, res)=>{
  const short_url = req.params.short_url;
  const original_url = urlDataBase[short_url];
  if(original_url){
    return res.redirect(original_url);
  }else{
    res.json({error: 'invalid url'});
  }
});
// Your first API endpoint
// app.get('/api/hello', function(req, res) {
//   res.json({ greeting: 'hello API' });
// });

// ap.post('api/:shorturl', (req, res)=>{
//   let original_url = req.params.




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
