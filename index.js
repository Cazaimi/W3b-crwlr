const fs = require('fs'),

  orchestrator = require('./lib/orchestrator');

let webpage = process.argv[2],
  file = process.argv[3];

orchestrator(webpage, { sameHost: true }, (err, results) => {
  if (err) {
    throw new Error({ error: err, message: 'The web crawler errored out' });
  }

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  file && fs.writeFile(file, JSON.stringify(results), process.exit);

  // If the user has not given a file, then print the web tree to the console.
  if (!file) {
    console.info(results);
  }
});
