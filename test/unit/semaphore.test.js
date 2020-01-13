const expect = require('chai').expect,

  Semaphore = require('../../lib/semaphore');

/* globals describe, it */

describe('semaphore', function () {
  describe('.increment', function () {
    it('should increment value if it\'s not more than the max value and emit an event', function (done) {
      let s = new Semaphore(4, 5);

      s.eventEmitter.on('increment', () => {
        expect(s.increment()).to.be.ok;

        return done();
      });

      s.increment();
    });

    it('should decrement value if it\'s not less than 0 and emit an event', function (done) {
      let s = new Semaphore(1, 5);

      s.eventEmitter.on('decrement', () => {
        expect(s.decrement()).to.be.ok;

        return done();
      });

      s.decrement();
    });
  });
});
