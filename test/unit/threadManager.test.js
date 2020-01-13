const expect = require('chai').expect,

  threadManager = require('../../lib/threadManager');

/* globals describe, it, after, before */

describe('threadManager', function () {
  describe('.enqueue', function () {
    let threads;

    before(function () {
      threads = threadManager.init(2, function ({ a, b }) {
        return a + b;
      });
    });

    after(function () {
      threadManager.destroy(threads);
    });

    it('should execute threads concurrently', function (done) {
      threadManager.enqueue(threads, function (err, firstResult) {
        if (err) { return done(err); }

        return threadManager.enqueue(threads, function (err, lastResult) {
          if (err) { return done(err); }

          expect(lastResult).to.equal(11);

          return done();
        }, { a: firstResult, b: 4 });
      }, { a: 3, b: 4 });
    });
  });
});
