// Proxies requests starting with /api to the rubygems.org api
const request = require('request');

module.exports = function (req, resolve, reject) {
  if(!req.originalUrl.includes("/api")) {
    // next() // not sure what this was meant for to be honest :/
  }
  else {
    const url = 'https://rubygems.org' + req.originalUrl;
    request.get(url,function(err,response,body){
      if (err) {
          // TODO: Change to catch all bad status codes.
          reject("Ruby API hit an error. Are you sure this is a valid Gem?")
      } else {
          resolve(JSON.parse(body))
      }
      });

  }
}

