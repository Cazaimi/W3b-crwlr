const program = require('commander'),
  fs = require('fs'),

  orchestrator = require('./lib/orchestrator');

program
  .option('-f, --file <file>', 'file to store the output in')
  .option('--depth-first', 'Whether to traverse the tree depth first or breadth first')
  .option('-v, --verbose', 'Whether to show progress or not')
  .option('-n, --network-conc <nc>', 'Number of sockets to use at once')
  .option('-t, --thread-conc <tc>', 'Number of threads to use at once')
  .requiredOption('-w, --webpage <webpage>', 'For what is a tree, without a root?');

program.parse(process.argv);

let webpage = program.webpage,
  file = program.file,
  depthFirst = program.depthFirst,
  showProgress = program.verbose,
  networkConcurrency = program.networkConc,
  cpuConcurrency = program.threadConc;

orchestrator(webpage, { sameHost: true, depthFirst, showProgress,
  networkConcurrency, cpuConcurrency }, (err, results) => {
  if (err) {
    throw new Error({ error: err, message: 'The web crawler errored out' });
  }
  // If the user has not given a file, then print the web tree to the console.
  if (!file) {
    console.info(results);

    return process.exit();
  }

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  return file && fs.writeFile(file, JSON.stringify(results), function (err) {
    if (err) { throw new Error(err); }

    console.info('Output written into file:', file);

    return process.exit();
  });
});
