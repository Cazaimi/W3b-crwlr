const _ = require('lodash'), 
  init = require('./init'),
  parser = require('./parseHtml'),
  requester = require('./requester'),
  utils = require('./util/url');

module.exports = function (inputWebpage, options, cb) {
  let { ds, hash, s, sockets } = init('stack', 10, 10),
    webTree = {
      [inputWebpage]: {}
    },
    sameHost = options.sameHost;

  console.log('s:', s);

  ds.push({ webpage: inputWebpage, path: '' });

  setInterval(function () {
    if (s === 0) {
      return;
    }

    if (!ds.length()) {
      return;
    }

    s--;

    // console.log('ds:', ds);

    let currentWebpage = _.get(ds.pop(), 'webpage'),
      path = _.get(ds.pop(), 'path');

    if (hash.get(currentWebpage) || hash.get(utils.getUrlWithoutHash)) {
      // This web page has already been hit. Return.
      s++;

      return;
    }

    try {
      currentWebpage && requester.sendRequest(currentWebpage, sockets, function (err, data) {
        if (err) { return cb(err); }

        hash.set(currentWebpage, true);

        parser.parseUsingNodeHtmlParse(data).forEach(function (unresolvedChildPage) {
          if (typeof unresolvedChildPage !== 'string' || !unresolvedChildPage.length) {
            return;
          }

          let childPage = requester.formatUrl(currentWebpage, unresolvedChildPage);

          // if (sameHost) {
          //   if (!utils.compareHosts(childPage, inputWebpage)) {
          //     return;
          //   }
          // }

          // This is the input webpage.
          if (currentWebpage === inputWebpage) {
            _.set(webTree, [inputWebpage, childPage], {});

            utils.compareHosts(childPage, inputWebpage) && ds.push({ webpage: childPage, path: inputWebpage });

            return;
          }

          _.set(webTree, [path, currentWebpage, childPage], {});

          utils.compareHosts(childPage, inputWebpage) && ds.push({ webpage: childPage, path: path + currentWebpage });
        });

        console.log('Incrementing s');
        s++;
      });
    }
    catch (e) {
      console.log('e:', e);
      
      console.log('empty:', hash.keys());
      s++;

    }

  }, 100);

  setInterval(() => {
    console.log('s:', s);
    
    s === 10 && console.log('webTree:', webTree);

    console.log('webTree:', ds);
  }, 10000);
};
