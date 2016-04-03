var ChannelRequest, Promise, refreshProviderObject, stopLongPolling, timeoutID;

Promise = require('bluebird');

refreshProviderObject = null;

ChannelRequest = (function() {

  function ChannelRequest(channelName1, callback1) {
    this.channelName = channelName1;
    this.callback = callback1;
    this.stopLongPolling = false;
    if (this.channelName == null) {
      throw new Error('Channel request needs of a channelName');
    }
    if (typeof this.callback !== 'function') {
      throw new Error('Channel request needs of a callback function');
    }
  }

  var startRefreshProvider = function(channelName, callback) {
    return new Promise(function(resolve, reject) {
      return callback(channelName, function(err) {
        if (err) {
          reject(new Error(err));
        }
        return resolve();
      });
    });
  };

  ChannelRequest.prototype.startLongPolling = function(miliseconds) {
    if (!!this.stopLongPolling) {
      clearTimeout(timeoutID);
      return;
    }
    var self = this;
    refreshProviderObject = startRefreshProvider(this.channelName, this.callback);
    return refreshProviderObject.then(function() {
      timeoutID = setTimeout(function() {
        return self.startLongPolling(miliseconds);
      }, miliseconds);
      if (!!self.stopLongPolling) {
        clearTimeout(timeoutID);
        return;
      }
    }).catch(function(err) {
      return err;
    });
  };

  return ChannelRequest;

})();

export default ChannelRequest;
