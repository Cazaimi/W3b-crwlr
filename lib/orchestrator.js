const _ = require('lodash'), 
  init = require('./init'),
  parser = require('./parseHtml'),
  requester = require('./requester');

module.exports = function (webpage, cb) {
  let { ds, hash, s, sockets } = init('queue', 4),
    empty = {};

  console.log('s:', s);

  ds.push({ webpage, path: '' });

  setInterval(function () {
    if (s === 0) {
      return;
    }

    s--;

    // console.log('ds:', ds);

    let webpage = _.get(ds.pop(), 'webpage'),
      path = _.get(ds.pop(), 'path');

    try {
      webpage && requester.sendRequest(webpage, sockets, function (err, data) {
        if (err) { return cb(err); }

        parser.parseUsingNodeHtmlParse(data).forEach(function (page) {
          _.set(empty, `${path}[${webpage}]`, page);

          ds.push({ webpage: page, path: path + webpage });
        });

        s++;

        console.log('empty:', empty);

      });
    }
    catch (e) {
      console.log('e:', e);
      s++;

    }

  }, 100);
};
