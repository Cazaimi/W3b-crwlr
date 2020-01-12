const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/;

module.exports = {
  parseHtmlUsingRegex (input) {
    return input.match(regex);
  },

  parseUsingNodeHtmlParse: (input) => {
    let nodeHtmlParser = require('node-html-parser'),
      _ = require('lodash');

    let parsedInput = nodeHtmlParser.parse(input),
      links = parsedInput.querySelectorAll('a').map(function (link) {
        let rawAttributes = _.get(link, 'rawAttrs').split(' '),
          href = _.find(rawAttributes, function (attribute) {
            return attribute.indexOf('href=') !== -1;
          }),
          address = href && _.get(href.split('='), '1');

        return href ? address.substring(address.indexOf('"') + 1, address.lastIndexOf('"')) : '';
      });

    return links;
  }
};
