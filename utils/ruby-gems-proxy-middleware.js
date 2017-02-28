// Proxies requests starting with /api to the rubygems.org api
const request = require('request');

module.exports = function (req, res, next) {
  if(!req.originalUrl.includes("/api")) {
    console.log(req.originalUrl)
    next()
  }
  else {
    const url = 'https://rubygems.org' + req.originalUrl;
    request.get(url,function(err,response,body){
      if(response.statusCode === 400) { // no query was sent, so send an empty array as results
        res.send([])
      }
      else {
        res.send(body);
      }
      //TODO Do something with response
      });

  }
}

