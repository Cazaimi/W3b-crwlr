const ds = require('./datastructures'),
  Hashmap = require('hashmap'),
  createAgent = require('./requester').createAgent,
  parser = require('./parseHtml'),
  threadManager = require('./threadManager');

module.exports = function ({ datastructure, maxSockets, networkConcurrency, threadConcurrency } = {}) {
  // Initialize sockets
  let sockets = createAgent(maxSockets),

    // Initialize threads
    pool = threadManager.init(threadConcurrency, parser.parseUsingNodeHtmlParse),

    // Initialize data structures
    dsObject = new ds[datastructure]([]),

    // Initialize hash
    hash = new Hashmap(),

    // Initialize semaphores
    s = networkConcurrency;

  // Boot up the queue maintainer

  return { ds: dsObject, hash, s, sockets, pool };
};
