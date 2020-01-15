const _ = require('lodash'),
  hasher = require('./urlHasher'),
  init = require('./setup/init'),
  destroy = require('./setup/destroy'),
  mime = require('mime-types'),
  os = require('os'),
  parser = require('./parseHtml'),
  requester = require('./requester'),
  threadManager = require('./threadManager'),
  utils = require('./util/url'),

  ignoreFileTypes = ['application/pdf', 'application/zip'];

module.exports = function (inputWebpage, options, cb) {
  let datastructure = options.depthFirst ? 'stack' : 'queue',
    networkConcurrency = options.networkConcurrency,
    threadConcurrency = options.threadConcurrency,
    { ds, hash, s, httpSockets, httpsSockets, pool } = init(_.defaults({
      datastructure,
      queue: 10,
      networkConcurrency,
      threadConcurrency: threadConcurrency || os.cpus().length,
      threadFunctionPayload: parser.parseUsingNodeHtmlParse
    })),
    webTree = {
      [inputWebpage]: {}
    },
    showProgress = options.showProgress;

  ds.push({ webpage: inputWebpage, path: '' });

  let orchestrator = function () {
    if (s.value === 0) {
      return;
    }

    if (!ds.length()) {
      return;
    }

    s.decrement();

    let storedData = ds.pop(),
      currentWebpage = _.get(storedData, 'webpage'),
      path = _.get(storedData, 'path'),
      isProtocolHttp = utils.getProtocol(currentWebpage) === 'http:';

    showProgress && console.info('currentWebpage:', currentWebpage);

    if (hasher.retriveFromHash(currentWebpage, hash)) {
      // This web page has already been hit. Only add it to the webtree and
      // Return.
      showProgress && console.info('Duplicate webpage hit!');

      s.increment();

      return;
    }

    try {
      currentWebpage && requester.sendRequest(currentWebpage, isProtocolHttp ? httpSockets : httpsSockets,
        function (err, data) {
          if (err) { return cb(err); }

          hasher.storeInHash(currentWebpage, true, hash);

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
                // console.log('webTree:', webTree);

                utils.compareHosts(childPage, inputWebpage) &&
                !_.includes(ignoreFileTypes, mimeType) &&
                ds.push({ webpage: childPage, path: [inputWebpage] });

                return;
              }

              _.set(webTree, _.concat(path, currentWebpage, childPage), {});

              utils.compareHosts(childPage, inputWebpage) &&
              !_.includes(ignoreFileTypes, mimeType) &&
              ds.push({ webpage: childPage, path: _.concat(path, currentWebpage) });
            });

            s.increment();
          }, data);
        });
    }
    catch (e) {
      console.error('e:', e);

      s.increment();
    }
  };

  // Trigger the orchestrator the first time around. The events will then keep it going forward.
  orchestrator();

  let orchestratorTimer = setInterval(orchestrator, 0),
    timer = setInterval(() => {
      showProgress && console.info('Concurrency:', s.value) && console.info('# of Queued webpages:', ds.length());

      // If the semaphore is finally available and nothing is in the queue,
      // we can quit.
      if (s.value === s.maxValue && !ds.length()) {
        clearInterval(timer);
        clearInterval(orchestratorTimer);

        destroy(pool, hash);

        return cb(null, webTree);
      }

      return undefined;
    }, 100);
};

