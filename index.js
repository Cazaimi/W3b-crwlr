const queue = require('./queue');

console.log(queue);

let q = new queue([1, 2, 3]);

console.log('q:', q);


console.log(q.firstElement());