const hasher = require('../urlHasher'),
  threadManager = require('../threadManager');

module.exports = function (threads, hash) {
  threadManager.destroy(threads);

  hasher.destroy(hash);
};
