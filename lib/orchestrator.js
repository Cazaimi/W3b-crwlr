const _ = require('lodash'),
  init = require('./init'),
  mime = require('mime-types'),
  os = require('os'),
  parser = require('./parseHtml'),
  requester = require('./requester'),
  threadManager = require('./threadManager'),
  utils = require('./util/url');

module.exports = function (inputWebpage, options, cb) {
  let { ds, hash, s, sockets, pool } = init({
      datastructure: 'stack',
      maxSockets: 10, networkConcurrency: 10,
      threadConcurrency: os.cpus().length
    }),
    webTree = {
      [inputWebpage]: {}
    },
    sameHost = options.sameHost;

  ds.push({ webpage: inputWebpage, path: '' });

  setInterval(function () {
    if (s === 0) {
      return;
    }

    if (!ds.length()) {
      return;
    }

    s--;

    let currentWebpage = _.get(ds.pop(), 'webpage'),
      path = _.get(ds.pop(), 'path');

    if (hash.get(currentWebpage) || hash.get(utils.getUrlWithoutHash)) {
      // This web page has already been hit. Return.
      s++;

      return;
    }

    try {
      currentWebpage && requester.sendRequest(currentWebpage, sockets, function (err, data, contentType) {
        if (err) { return cb(err); }

        hash.set(currentWebpage, true);

        // eslint-disable-next-line handle-callback-err
        return threadManager.enqueue(pool, function (err, results) {
          if (err) {
            throw new Error(err);
          }

          results && results.forEach(function (unresolvedChildPage) {
            if (typeof unresolvedChildPage !== 'string' || !unresolvedChildPage.length) {
              return;
            }

            let childPage = requester.formatUrl(currentWebpage, unresolvedChildPage),
              mimeType = mime.lookup(childPage);

            // This is the input webpage.
            if (currentWebpage === inputWebpage) {
              _.set(webTree, [inputWebpage, childPage], {});

              utils.compareHosts(childPage, inputWebpage) &&
                mimeType !== 'application/pdf' &&
                ds.push({ webpage: childPage, path: inputWebpage });

              return;
            }

            _.set(webTree, [path, currentWebpage, childPage], {});

            utils.compareHosts(childPage, inputWebpage) &&
              mimeType !== 'application/pdf' &&
              ds.push({ webpage: childPage, path: path + currentWebpage });
          });

          s++;
        }, data);
      });
    }
    catch (e) {
      console.log('e:', e);

      // console.log('empty:', hash.keys());
      s++;
    }
  }, 100);

  setInterval(() => {
    console.log('s:', s);

    // s === 10 && console.log('webTree:', webTree);

    // console.log('webTree:', ds);
  }, 10000);
};

