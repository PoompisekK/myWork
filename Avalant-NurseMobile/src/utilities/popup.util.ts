import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AlertController, Alert } from 'ionic-angular';
/**
 * Popup Utility
 * 
 * @author NorrapatN
 * @since Sat May 20 2017
 */
@Injectable()
export class PopupUtil {

  private static instance: PopupUtil;

  private constructor(
    // private alertCtrl: AlertController
  ) {
    PopupUtil.instance = this;
  }

  public static getInstance(
    // alertCtrl?: AlertController
  ) {
    // let alertCtrl: AlertController = ReflectiveInjector.resolve([AlertController])[0].resolvedFactories[0].factory();
    // let alertCtrl: AlertController = ReflectiveInjector.fromResolvedProviders(ReflectiveInjector.resolve([{
    //   provide: AlertController, useExisting: true
    // }])).get(AlertController);

    // console.debug(' >>>> ', alertCtrl);

    if (!this.instance) {
      this.instance = new PopupUtil();
    }

    return this.instance;
  }

  /**
   * Generate Error popup from error response
   * @param alertCtrl Alert Controller from Ionic page
   * @param error Error response from http
   */
  public static generateErrorPopup(alertCtrl: AlertController, error: any, title?: string): Alert {
    console.warn('⚠️ Error :', error);
    // console.trace(error);

    return alertCtrl.create({
      title: title || 'Error HTTP request',
      message: `Error : ${error.status || ''} ${error.statusText || ''}<br>${error.text && error.text() || error.message}`,
      buttons: ['OK'],
      enableBackdropDismiss: false,
    });
  }

}
