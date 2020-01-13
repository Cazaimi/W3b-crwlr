const nock = require('nock');

before (function () {
  nock.disableNetConnect();
});

after (function () {
  nock.enableNetConnect();

  // process.exit();
})