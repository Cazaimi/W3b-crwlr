const expect = require('chai').expect,

  urlHasher = require('../../lib/urlHasher');

/* globals describe, it, afterEach, beforeEach */

describe('urlHasher', function () {
  describe('.storeInHash', function () {
    let hash;

    beforeEach(function () {
      hash = urlHasher.init();
    });

    afterEach(function () {
      urlHasher.destroy(hash);
    });

    it('should not store url hash or protocol and store the final url as a string', function () {
      urlHasher.storeInHash('https://www.google.com#Introduction', true, hash);

      expect(hash.get('//www.google.com/')).to.be.true;
    });

    it('should retrieve the url if the input contains the url as well as the hash and protocol', function () {
      let webpage = 'https://www.google.com#Introduction';

      urlHasher.storeInHash(webpage, true, hash);

      let retrievedUrl = urlHasher.retriveFromHash(webpage, hash);

      expect(retrievedUrl).to.be.true;
    });

    it('should not retrieve the url if the input contains the url differentiating ' +
      'fields like the path', function () {
      let storedWebpage = 'https://www.google.com/search#Introduction',
        queryWebpage = 'https://www.google.com#Introduction';

      urlHasher.storeInHash(storedWebpage, true, hash);

      let retrievedUrl = urlHasher.retriveFromHash(queryWebpage, hash);

      expect(retrievedUrl).to.be.undefined;
    });
  });
});
