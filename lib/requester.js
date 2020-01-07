const http = require('http'),
  https = require('https'),
  protocols = {
    http, https
  };
  
module.exports = {
  createAgent (maxSockets, protocol) {
    if (!protocol) {
      protocol = 'https';
    }

    const keepAliveAgent = new protocols[protocol].Agent(Object.assign({ keepAlive: true }, { maxSockets }));

    return { agent: keepAliveAgent, protocol };
  },

  sendRequest (address, httpAgent, cb) {
    let rawData = '',
      { agent, protocol } = httpAgent;

    protocols[protocol].get(address, { agent }, function (response) {
      console.log('response.statusCode:', response.statusCode);
      
      response.on('error', function (err) {
        return cb(err);
      });

      response.on('data', function (chunk) {
        rawData += chunk;
      })

      response.on('end', function () {
        return cb(null, rawData);
      })
    });
  } 
};
