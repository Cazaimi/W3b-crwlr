const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/;

module.exports = {
  parseHtmlUsingRegex (input) {
    return input.match(regex);
  },

  parseUsingNodeHtmlParse: (input) => {
    let nodeHtmlParser = require('node-html-parser'),
      _ = require('lodash');

    let parsedInput = nodeHtmlParser.parse(input),
      links = [];

    parsedInput.querySelectorAll('a').forEach(function (link) {
      let rawAttributes = _.get(link, 'rawAttrs').split(' '),
        href = _.find(rawAttributes, function (attribute) {
          return attribute.indexOf('href=') !== -1;
        }),
        address = href && _.get(href.split('='), '1');

      if (href) {
        console.log('href:', href);

        let singleQuoteIndex = address.indexOf('\''),
          backSlashIndex = address.indexOf('\\'),
          isHrefSingleQuoted = singleQuoteIndex !== -1,
          // && !backSlashIndex !== -1 && !(address.indexOf('\\') === singleQuoteIndex - 1),
          parsingCharacter = isHrefSingleQuoted ? '\'' : '"';

        links.push(address.substring(address.indexOf(parsingCharacter) + 1, address.lastIndexOf(parsingCharacter)));
      }
    });

    return links;
  }
};
