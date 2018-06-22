/*
  Declaration files are how the Typescript compiler knows about the type information(or shape) of an object.
  They're what make intellisense work and make Typescript know all about your code.

  A wildcard module is declared below to allow third party libraries to be used in an app even if they don't
  provide their own type declarations.

  To learn more about using third party libraries in an Ionic app, check out the docs here:
  http://ionicframework.com/docs/v2/resources/third-party-libs/

  For more info on type definition files, check out the Typescript docs here:
  https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
*/
/// <reference path="../node_modules/@types/googlemaps/index.d.ts" />

declare module '*';

// Extra variables that live on Global that will be replaced by webpack DefinePlugin
declare var ENV: any;
declare var jQuery: any;

interface GlobalEnvironment {
  ENV;
  REST_API_URL;
}

interface Window {

  /**
   * Cordova plugins
   */
  plugins: Plugins;

  /**
   * EAF Callback method
   */
  eafCallback: <T>(data: any) => T;

  google: google;
}

interface Plugins {
  launcher: Launcher;
}

/**
 * Cordova App Launcher pluginOptions
 */
declare type LauncherOptions = {
  uri?: string,
  packageName?: string,
  dataType?: string,
  getAppList?: boolean,
  extras?: LauncherExtra,
  actionName?: string,
};

declare type LauncherExtra = [{ [key: string]: any }];

declare type ActivityLaunchedExtra = {
  [key: string]: any
};

declare type CanLaunchSuccess = () => void;
declare type LaunchSuccess = (data) => void;
declare type ActivityLaunched = {
  isLaunched: boolean,
  isActivityDone: boolean,
  data?: string,
  extras?: ActivityLaunchedExtra,
};
declare type LaunchError = (errorMessage: string) => void;

/**
 * Cordova App Launcher plugin
 */
interface Launcher {
  /**
   * Check to see if spectified application is installed
   */
  canLaunch: (options: LauncherOptions, successCallback: CanLaunchSuccess, errorCallback: LaunchError) => void;

  /**
   * Launch specified application
   */
  launch: (options: LauncherOptions, successCallback: LaunchSuccess, errorCallback: LaunchError) => void;
}

// declare namespace google {
//   export namespace maps { };
// };

declare var GeolocationMarker;

interface String {

  equals: (params) => boolean;

  equalsIgnoreCase: (params) => boolean;
}
interface Array {
  /**
   * check if an element exists in array using a comparer function
   * comparer : function(currentElement) 
   */
  inArray: (comparer) => boolen;

  /**
   * adds an element to the array if it does not already exist using a comparer function 
   */
  pushIfNotExist: (element, comparer) => void;

  merge: (element: string[]) => string[];
}