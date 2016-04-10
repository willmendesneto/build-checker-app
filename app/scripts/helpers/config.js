'use babel';

module.exports = {
  isDev: function() {
    return process.env.NODE_ENV === 'development';
  }
}
