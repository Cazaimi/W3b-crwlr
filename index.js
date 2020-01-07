const orchestrator = require('./lib/orchestrator');

let webpage = process.argv[2];

orchestrator(webpage, (...results) => {
  console.log('results:', results);
});
