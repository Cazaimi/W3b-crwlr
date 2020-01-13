var fs = require('fs'),
  path = require('path'),
  Mocha = require('mocha');

// Instantiate a Mocha instance.
var mocha = new Mocha(),

  testDir = 'test/unit';

/**
 * Gets the test .js file paths recursively from a given directory.
 * @param {String} dir - path to directory containing test files.
 * @returns {Array} Filepaths to each test .js file.
 */
function getTestPaths (dir, fileList) {
  var files = fs.readdirSync(dir);

  fileList = fileList || [];

  files.forEach(function (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      fileList = getTestPaths(path.join(dir, file), fileList);
    }
    else {
      fileList.push(path.join(dir, file));
    }
  });

  return fileList.filter(function (file) {
    return path.extname(file) === '.js';
  });
}

// Get all .js paths and add each file to the mocha instance.
getTestPaths(testDir).forEach(function (file) {
  mocha.addFile(path.join(file));
});

// Run the tests.
mocha.run(function (failures) {
  process.on('exit', function () {
    process.exit(failures);
  });
});
