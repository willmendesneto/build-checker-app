import 'babel-polyfill';
import { jsdom } from 'jsdom';
console.log(__dirname + './../app/');
require('app-module-path').addPath(__dirname + './../app/');

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
window.localStorage = window.sessionStorage = {
  getItem(key) {
    return this[key];
  },
  setItem(key, value) {
    this[key] = value;
  },
  removeItem(key) {
    this[key] = undefined;
  },
};

Object.keys(window).forEach((key) => {
    if (!(key in global)) {
        global[key] = window[key];
    }
});
