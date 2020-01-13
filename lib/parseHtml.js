// eslint-disable-next-line security/detect-unsafe-regex
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
        address = href && typeof href === 'string' &&
          href.substring(href.indexOf('=') + 1, href.length);

      if (href) {
        // console.log('href, address:', href, address);
        let singleQuoteIndex = address.indexOf('\''),
          isHrefSingleQuoted = singleQuoteIndex !== -1,
          parsingCharacter = isHrefSingleQuoted ? '\'' : '"';

        links.push(address.substring(address.indexOf(parsingCharacter) + 1, address.lastIndexOf(parsingCharacter)));
      }
    });

    return links;
  }
};
