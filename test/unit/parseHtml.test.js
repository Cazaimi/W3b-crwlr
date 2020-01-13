const expect = require('chai').expect,

  fixtures = require('../fixtures/inputPages'),
  parseHtml = require('../../lib/parseHtml');

/* globals describe, it */

describe('parse HTML', function () {
  it('should parse all absolute and relative tags in a given file', function () {
    let parsedTags = parseHtml.parseUsingNodeHtmlParse(fixtures.simplePageWithTags());

    expect(parsedTags).to.eql([
      '/index.html',
      '/projects.html',
      '/posts.html',
      '/about.html',
      '/contact.html',
      'https://www.getpostman.com',
      'http://creativecommons.org/licenses/by-nc/4.0/',
      'https://jekyllrb.com/',
      'https://icons8.com/'
    ]);
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
