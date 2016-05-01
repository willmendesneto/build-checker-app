var ChannelRequest, Promise, refreshProviderObject, stopLongPolling, timeoutID;

Promise = require('bluebird');
Promise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: true
});

refreshProviderObject = null;

ChannelRequest = (function() {

  function ChannelRequest(channelName1, callback1) {
    this.channelName = channelName1;
    this.callback = callback1;
    this.longPolling = true;
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

  ChannelRequest.prototype.stopLongPolling = function() {
    this.longPolling = false;
  };

  ChannelRequest.prototype.startLongPolling = function(miliseconds) {
    var self = this;
    if (!self.longPolling) {
      clearTimeout(timeoutID);
      return;
    }
    refreshProviderObject = startRefreshProvider(this.channelName, this.callback);
    if (!self.longPolling) {
      refreshProviderObject.cancel();
      clearTimeout(timeoutID);
      return;
    }
    return refreshProviderObject.then(function() {
      timeoutID = setTimeout(function() {
        return self.startLongPolling(miliseconds);
      }, miliseconds);
      if (!self.longPolling) {
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
