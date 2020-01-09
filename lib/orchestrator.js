const _ = require('lodash'), 
  init = require('./init'),
  parser = require('./parseHtml'),
  requester = require('./requester');

module.exports = function (inputWebpage, cb) {
  let { ds, hash, s, sockets } = init('queue', 10, 10),
    webTree = {
      [inputWebpage]: {}
    };

  console.log('s:', s);

  ds.push({ webpage: inputWebpage, path: '' });

  setInterval(function () {
    if (s === 0) {
      return;
    }

    s--;

    // console.log('ds:', ds);

    let currentWebpage = _.get(ds.pop(), 'webpage'),
      path = _.get(ds.pop(), 'path');

    try {
      currentWebpage && requester.sendRequest(currentWebpage, sockets, function (err, data) {
        if (err) { return cb(err); }

        parser.parseUsingNodeHtmlParse(data).forEach(function (unresolvedChildPage) {
          if (typeof unresolvedChildPage !== 'string' || !unresolvedChildPage.length) {
            return;
          }

          let childPage = requester.formatUrl(currentWebpage, unresolvedChildPage);

          // This is the input webpage.
          if (currentWebpage === inputWebpage) {
            _.set(webTree, [inputWebpage, childPage], {});

            ds.push({ webpage: childPage, path: inputWebpage });

            return;
          }

          _.set(webTree, [path, currentWebpage, childPage], {});

          ds.push({ webpage: childPage, path: path + currentWebpage });
        });

        s++;
      });
    }
    catch (e) {
      console.log('e:', e);
      
      console.log('empty:', webTree);
      s++;

    }

  }, 1000);

  setInterval(() => {
    console.log('webTree:', webTree);
  }, 10000);
};
