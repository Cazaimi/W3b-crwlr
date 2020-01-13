const ds = require('../datastructures'),
  createAgent = require('../requester').createAgent,
  Semaphore = require('../semaphore'),
  threadManager = require('../threadManager'),
  urlHasher = require('../urlHasher');

module.exports = function ({ datastructure, queue,
  networkConcurrency, threadConcurrency, threadFunctionPayload } = {}) {
  // Initialize sockets
  let httpSockets = createAgent(networkConcurrency, 'http'),
    httpsSockets = createAgent(networkConcurrency, 'https'),

    // Initialize threads
    pool = threadManager.init(threadConcurrency, threadFunctionPayload),

    // Initialize data structures
    dsObject = new ds[datastructure]([]),

    // Initialize hash
    hash = urlHasher.init(),

    // Initialize semaphores
    s = new Semaphore(queue, queue);

  return { ds: dsObject, hash, s, httpSockets, httpsSockets, pool };
};
