const _ = require('lodash'),
  cheerio = require('cheerio'),
  nodeHtmlParser = require('node-html-parser'),

regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/

module.exports = {
  parseHtmlUsingRegex (input) {
    return input.match(regex);
  },

  parseUsingNodeHtmlParse (input) {
    let parsedInput = nodeHtmlParser.parse(input),
      links = parsedInput.querySelectorAll('a').map(function (link) {
        console.log('link:', link);

        let rawAttributes = _.get(link, 'rawAttrs').split(' '),
          href = _.find(rawAttributes, function (attribute) {
            return attribute.indexOf('href=') !== -1;
          });

        return href ? _.get(href.split('='), '1') : '';
      });

    return links;
  },

  parseUsingCheerio (input) {
    let $ = cheerio.load(input),
      links = $('a').map(function (link) {
        console.log('link:', link);
        
        let rawAttributes = _.get(link, 'rawAttrs');
      });

    return links;
  }
};
