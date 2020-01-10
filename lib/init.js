const ds = require('./datastructures'),
  Hashmap = require('hashmap'),
  createAgent = require('./requester').createAgent;

module.exports = function (datastructure, maxSockets, concurrency) {
// Initialize sockets
let sockets = createAgent(maxSockets);


// Initialize threads

// Initialize data structures
let dsObject = new ds[datastructure]([]);


// Initialize hash
let hash = new Hashmap();

// Initialize semaphores
let s = concurrency;

// Boot up the queue maintainer

return { ds: dsObject, hash, s, sockets };
}