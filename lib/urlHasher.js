const _ = require('lodash'),
  Hashmap = require('hashmap'),
  url = require('url'),

  fieldsToBePicked = ['slashes', 'auth', 'host', 'port',
    'hostname', 'search', 'query', 'pathname', 'path'];

module.exports = {
  storeInHash (key, value, hashReference) {
    let uniqueUrl = url.format(_.pick(url.parse(key), fieldsToBePicked));

    hashReference.set(uniqueUrl, value);
  },

  retriveFromHash (input, hashReference) {
    let uniqueUrl = url.format(_.pick(url.parse(input), fieldsToBePicked));

    return hashReference.get(uniqueUrl, hashReference);
  },

  init () {
    return new Hashmap();
  },

  destroy (hashReference) {
    return hashReference.clear();
  }
};
