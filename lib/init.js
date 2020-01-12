const ds = require('./datastructures'),
  Hashmap = require('hashmap'),
  createAgent = require('./requester').createAgent,
  Semaphore = require('./semaphore'),
  threadManager = require('./threadManager');

module.exports = function ({ datastructure, maxSockets, networkConcurrency, threadConcurrency, threadFunctionPayload } = {}) {
  // Initialize sockets
  let sockets = createAgent(maxSockets),

    // Initialize threads
    pool = threadManager.init(threadConcurrency, threadFunctionPayload),

    // Initialize data structures
    dsObject = new ds[datastructure]([]),

    // Initialize hash
    hash = new Hashmap(),

    // Initialize semaphores
    s = new Semaphore(networkConcurrency, networkConcurrency);

  // Boot up the queue maintainer

  return { ds: dsObject, hash, s, sockets, pool };
};
