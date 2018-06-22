"use strict";
function Launcher() { }

Launcher.prototype.canLaunch = function (options, successCallback, errorCallback) {
  options = options || {};
  options.successCallback = options.successCallback || successCallback;
  options.errorCallback = options.errorCallback || errorCallback;
  cordova.exec(options.successCallback || null, options.errorCallback || null, "Launcher", "canLaunch", [options]);
};

Launcher.prototype.launch = function (options, successCallback, errorCallback) {
  options = options || {};
  options.successCallback = options.successCallback || successCallback;
  options.errorCallback = options.errorCallback || errorCallback;
  cordova.exec(options.successCallback || null, options.errorCallback || null, "Launcher", "launch", [options]);
};

Launcher.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.launcher = new Launcher();
  return window.plugins.launcher;
};

setTimeout(function () {
  if (window.cordova) {
    cordova.addConstructor(Launcher.install);
  } else {
    console.warn('Cordova is not available to install.');
  }
}, 2000);