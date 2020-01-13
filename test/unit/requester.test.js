const expect = require('chai').expect,
  nock = require('nock'),

  requester = require('../../lib/requester');

/* globals describe, it */

describe('requester', function () {
  describe('.sendRequest', function () {
    it('should make a get request to the address provided', function (done) {
      let address = 'https://www.google.com',
        path = '/something';

      nock(address)
        .get(path)
        .reply(200, { page: 'hit' });

      requester.sendRequest(address + path, requester.createAgent(), function (err, res) {
        if (err) { return done(err); }

        let response = JSON.parse(res);

        expect(response).to.have.property('page', 'hit');

        return done();
      });
    });

    it('should make a get request using the http protocol if the url\'s protocol is http', function (done) {
      let address = 'http://www.google.com',
        path = '/something';

      nock(address)
        .get(path)
        .reply(200, { page: 'hit' });

      requester.sendRequest(address + path, requester.createAgent(10, 'http'), function (err, res) {
        if (err) { return done(err); }

        let response = JSON.parse(res);

        expect(response).to.have.property('page', 'hit');

        return done();
      });
    });

    it('should make a get request using the https protocol if the url\'s protocol is https', function (done) {
      let address = 'https://www.google.com',
        path = '/something';

      nock(address)
        .get(path)
        .reply(200, { page: 'hit' });

      requester.sendRequest(address + path, requester.createAgent(10, 'https'), function (err, res) {
        if (err) { return done(err); }

        let response = JSON.parse(res);

        expect(response).to.have.property('page', 'hit');

        return done();
      });
    });
  });

  describe('.formatUrl', function () {
    it('should resolve child URL if it\'s relative', function () {
      let parentUrl = 'https://www.google.com',
        childUrl = '/search?q=some_random_google_search',
        resolvedUrl = requester.formatUrl(parentUrl, childUrl);

      expect(resolvedUrl).to.equal(parentUrl + childUrl);
    });

    it('should resolve child URL if it\'s relative and contains ..', function () {
      let parentUrl = 'https://www.google.com',
        path = '/mail/drive',
        childUrlRelativePath = '../..',
        childUrl = '/search?q=some_random_google_search',
        resolvedUrl = requester.formatUrl(parentUrl + path, childUrlRelativePath + childUrl);

      expect(resolvedUrl).to.equal(parentUrl + childUrl);
    });

    it('should resolve child URL if it\'s relative and contains .', function () {
      let parentUrl = 'https://www.google.com',
        mail = '/mail',
        drive = '/drive',
        childUrlRelativePath = '.',
        childUrl = '/search?q=some_random_google_search',
        resolvedUrl = requester.formatUrl(parentUrl + mail + drive, childUrlRelativePath + childUrl);

      expect(resolvedUrl).to.equal(parentUrl + mail + childUrl);
    });

    it('should resolve child URL if it\'s absolute', function () {
      let parentUrl = 'https://www.google.com',
        childUrl = 'https://mail.google.com/',
        resolvedUrl = requester.formatUrl(parentUrl, childUrl);

      expect(resolvedUrl).to.equal(childUrl);
    });
  });
});
