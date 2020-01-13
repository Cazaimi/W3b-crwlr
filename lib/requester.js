const _ = require('lodash'),
  http = require('http'),
  https = require('https'),
  url = require('url'),

  protocols = {
    http, https
  };

module.exports = {
  createAgent (maxSockets, protocol) {
    if (!protocol) {
      protocol = 'https';
    }

    const keepAliveAgent = new protocols[protocol].Agent(_.assign({ keepAlive: true }, { maxSockets }));

    return { agent: keepAliveAgent, protocol };
  },

  sendRequest (address, httpAgent, cb) {
    let rawData = '',
      { agent, protocol } = httpAgent;

    // console.info('address:', address);

    protocols[protocol].get(address, { agent }, function (response) {
      response.on('error', function (err) {
        return cb(err);
      });

      response.on('data', function (chunk) {
        rawData += chunk;
      });

      response.on('end', function () {
        return cb(null, rawData, _.get(response, ['headers', 'content-type']));
      });
    });
  },

  formatUrl (parentUrl, childUrl) {
    // Check if childUrl is an absolute URL.
    if (url.parse(childUrl).hostName) {
      return childUrl;
    }

    return url.resolve(parentUrl, childUrl);
  }
};
