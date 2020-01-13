const _ = require('lodash'),
  init = require('./init'),
  mime = require('mime-types'),
  os = require('os'),
  parser = require('./parseHtml'),
  requester = require('./requester'),
  threadManager = require('./threadManager'),
  utils = require('./util/url'),

  ignoreFileTypes = ['application/pdf', 'application/zip'];

module.exports = function (inputWebpage, options, cb) {
  let { ds, hash, s, sockets, pool } = init({
      datastructure: 'stack',
      maxSockets: 10, networkConcurrency: 10,
      threadConcurrency: os.cpus().length,
      threadFunctionPayload: parser.parseUsingNodeHtmlParse
    }),
    webTree = {
      [inputWebpage]: {}
    };

  ds.push({ webpage: inputWebpage, path: '' });

  let orchestrator = function () {
    if (s.value === 0) {
      return;
    }

    if (!ds.length()) {
      return;
    }

    s.decrement();

    let currentWebpage = _.get(ds.pop(), 'webpage'),
      path = _.get(ds.pop(), 'path');

    if (hash.get(currentWebpage) || hash.get(utils.getUrlWithoutHash(currentWebpage))) {
      // This web page has already been hit. Return.
      s.increment();

      return;
    }

    try {
      currentWebpage && requester.sendRequest(currentWebpage, sockets, function (err, data, contentType) {
        if (err) { return cb(err); }
        console.log('data:', data);

        hash.set(currentWebpage, true);

        // eslint-disable-next-line handle-callback-err
        return threadManager.enqueue(pool, function (err, results) {
          console.log('results:', results);

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
                !_.includes(ignoreFileTypes, mimeType) &&
                ds.push({ webpage: childPage, path: inputWebpage });

              return;
            }

            _.set(webTree, [path, currentWebpage, childPage], {});

            utils.compareHosts(childPage, inputWebpage) &&
              !_.includes(ignoreFileTypes, mimeType) &&
              ds.push({ webpage: childPage, path: path + currentWebpage });
          });

          s.increment();
        }, data);
      });
    }
    catch (e) {
      console.log('e:', e);

      // console.log('empty:', hash.keys());
      s.increment();
    }
  };

  // Trigger the orchestrator the first time around. The events will then keep it going forward.
  orchestrator();

  // s.eventEmitter.on('increment', orchestrator);

  setInterval(() => {
    // If the semaphore is finally unoccupied and nothing is in the queue,
    // we can quit.
    if (s.value === s.maxValue && !ds.length()) {
      return cb(null, webTree);
    }

    return undefined;
  }, 100);
};

