const expect = require('chai').expect,
  nock = require('nock'),

  orchestrator = require('../../lib/orchestrator'),

  fixtures = require('../fixtures/inputPages');

/* globals describe, it */

describe('orchestrator', function () {
  it('shoud not hit urls that have already been hit', function (done) {
    let webpage = 'https://cazaimi.tech',
      response = fixtures.pageWithOnlyALinkToItself(webpage),

      server = nock(webpage)
        .get('/')
        .reply(200, response);

    orchestrator(webpage, {}, function (err) {
      if (err) { return done(err); }

      expect(server.isDone()).to.be.true;

      return done();
    });
  });

  it('shoud correctly build the web tree', function (done) {
    let webpage = 'https://is.the.root',
      response = fixtures.pageWithTwoLevelWebTree();

    nock(webpage)
      .get('/')
      .reply(200, response.level1);

    nock(webpage)
      .get('/path')
      .reply(200, response.level2.path);

    nock(webpage)
      .get('/twitter')
      .reply(200, response.level2.twitter);

    orchestrator(webpage, {}, function (err, results) {
      if (err) { return done(err); }

      expect(results).to.eql({
        'https://is.the.root': {
          'https://www.google.com/': {},
          'https://is.the.root/twitter': { 'https://www.cazaimi.tech/': {} },
          'https://is.the.root/path': { 'https://www.twitter.com/': {} }
        }
      });

      return done();
    });
  });
});
