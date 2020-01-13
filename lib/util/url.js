const _ = require('lodash'),
  url = require('url');

module.exports = {
  compareHosts (inputA, inputB) {
    return url.parse(inputA).hostname === url.parse(inputB).hostname;
  },

  formatUrl (parentUrl, childUrl) {
    // Check if childUrl is an absolute URL.
    if (url.parse(childUrl).hostName) {
      return childUrl;
    }

    return url.resolve(parentUrl, childUrl);
  },

  getUrlWithoutHash (input) {
    let urlFieldsToBePicked = ['protocol', 'slashes', 'auth', 'host', 'port',
      'hostname', 'search', 'query', 'pathname', 'path', 'href'];

    return url.format(_.pick(url.parse(input), urlFieldsToBePicked));
  },

  getProtocol (input) {
    if (!input || typeof input !== 'string' || input.length === 0) {
      return new Error('The URL must be a non-empty string, received:', input);
    }

    return url.parse(input).protocol;
  }
};
