'use strict';

var UrlHelper = {
  generateUrlFriendly: function (string) {
      var urlFriendly = string;
      // remove acentuations in words
      urlFriendly = urlFriendly.replace(/[á|ã|â|à]/gi, 'a');
      urlFriendly = urlFriendly.replace(/[é|ê|è]/gi, 'e');
      urlFriendly = urlFriendly.replace(/[í|ì|î]/gi, 'i');
      urlFriendly = urlFriendly.replace(/[õ|ò|ó|ô]/gi, 'o');
      urlFriendly = urlFriendly.replace(/[ú|ù|û]/gi, 'u');
      urlFriendly = urlFriendly.replace(/[ç]/gi, 'c');
      urlFriendly = urlFriendly.replace(/[ñ]/gi, 'n');
      urlFriendly = urlFriendly.replace(/[á|ã|â]/gi, 'a');
      // replace " " for "-"
      urlFriendly = urlFriendly.replace(/\W/gi, '-');
      // remove duplicated "-"
      urlFriendly = urlFriendly.replace(/(\-)\1+/gi, '-');

      if (urlFriendly[urlFriendly.length -1] === '-') {
        urlFriendly = urlFriendly.substr(0, urlFriendly.length -1);
      }

      return urlFriendly.toLowerCase();
  }
};

export default UrlHelper;
