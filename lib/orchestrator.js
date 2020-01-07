const init = require('./init'),
  requester = require('./requester');

module.exports = function (webpage, cb) {
  let { ds, hash, s, sockets } = init('queue', 4);

  ds.push(webpage);

  requester.sendRequest(webpage, sockets, (err, data) => {
    console.log('err, data:', err, data);

    return cb(err, data)
  });
}