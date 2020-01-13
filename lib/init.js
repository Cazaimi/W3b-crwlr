const ds = require('./datastructures'),
  hashmap = require('hashmap'),
  createAgent = require('./requester').createAgent;

module.exports = function (datastructure, maxSockets) {
// Initialize sockets
let sockets = createAgent(maxSockets);


// Initialize threads

// Initialize data structures
let dsObject = new ds[datastructure]([]);

// Initialize hash
let hash = {}; //new HashMap();

// Initialize semaphores
let s = 4;

// Boot up the queue maintainer

return { ds: dsObject, hash, s, sockets };
}