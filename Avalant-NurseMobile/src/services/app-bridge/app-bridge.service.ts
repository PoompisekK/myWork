import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';
/**
 * Application Bridge
 * 
 * App-2-App Communication
 * 
 * @author NorrapatN
 * @since Tue May 23 2017
 */
@Injectable()
export class AppBridge {

  public readonly umAndroidPackageName: string = 'com.avalant.universalmessaging';
  public readonly umIosPackageName: string = 'umavalant://';

  public get umPackageName(): string {
    return this.device.platform != null ? (this.device.platform == 'Android' ? this.umAndroidPackageName : this.umIosPackageName) : '';
  }

  constructor(
    private platform: Platform,
    private device: Device,

  ) {

  }

  private static NOOP = () => void 0;

  public isCordovaAvailable(): boolean {
    return !!window['cordova'];
  }

  // TODO: Check application installed function

  public openExternalApplication(packageName: string, args?: string[], successCallback?: LaunchSuccess, errorCallback?: LaunchError): void {

    if (!successCallback || typeof successCallback !== 'function') {
      successCallback = AppBridge.NOOP;
    }

    if (!errorCallback || typeof errorCallback !== 'function') {
      errorCallback = AppBridge.NOOP;
    }

    if (!this.isCordovaAvailable()) {
      errorCallback('Cordova plugin is not available');
      return;
    }

    // For Android
    if (this.device.platform == 'Android') {
      let appPackage = packageName;
      window.plugins.launcher.launch({ packageName: appPackage },
        data => successCallback(data),
        errMsg => {
          console.error('Error switching app :', errMsg);
          errorCallback(errMsg);
        }
      );
    } else if (this.device.platform == 'iOS') { // For iOS
      let uri = packageName;
      window.plugins.launcher.launch({ uri: uri },
        data => successCallback(data),
        errMsg => {
          console.error('Error switching app :', errMsg);
          errorCallback(errMsg);
        }
      );
    }
  }

  public switchToMessenger(successCallback?: LaunchSuccess, errorCallback?: LaunchError): void {
    this.openExternalApplication(this.umPackageName, null, successCallback, errorCallback);
  }

}
