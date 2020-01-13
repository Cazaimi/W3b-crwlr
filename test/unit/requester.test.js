const expect = require('chai').expect,
  nock = require('nock'),

  fixtures = require('../fixtures/inputPages'),
  requester = require('../../lib/requester');

/* globals describe, it */

describe('parse HTML', function () {
  it.only('should make a get request to the address provided', function (done) {
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

  it('should parse all tags with a single quote href', function () {
    let singleQuotedLinks = ['/index.html',
        '/projects.html',
        '/posts.html',
        '/about.html',
        '/contact.html'],
      parsedTags = parseHtml.parseUsingNodeHtmlParse(fixtures.simplePageWithTags());

    singleQuotedLinks.forEach(function (link) {
      expect(parsedTags).to.include(link);
    });
  });

  it('should parse all tags with a double quote href', function () {
    let doubleQuotedLinks = ['https://www.getpostman.com',
        'http://creativecommons.org/licenses/by-nc/4.0/',
        'https://jekyllrb.com/',
        'https://icons8.com/'],
      parsedTags = parseHtml.parseUsingNodeHtmlParse(fixtures.simplePageWithTags());

    doubleQuotedLinks.forEach(function (link) {
      expect(parsedTags).to.include(link);
    });
  });
});
