import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Market } from '@ionic-native/market';
import { TranslationService } from 'angular-l10n';
import {
  AlertController,
  AlertOptions,
  App,
  MenuController,
  NavController,
  Platform,
  ToastController,
  ViewController,
  ModalController,
  ModalOptions,
  Events,
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../app/app.state';
import { Page } from '../app/page';
import { AppConstant } from '../constants/app-constant';
import { NumberUtil } from '../utilities/number.util';
import { ObjectsUtil } from '../utilities/objects.util';
import { StringUtil } from '../utilities/string.util';
import { EAFRestService } from './eaf-rest/eaf-rest.service';
import { HttpService } from './http-services/http.service';
import { AppLoadingService } from './app-loading-service/app-loading.service';

@Injectable()
export class AppServices {
  public isServeChrome(): boolean {
    return this._platform.is('cordova') == false && (this._platform.is('mobileweb') || this._platform.is('core'));
  }
  constructor(
    private _platform: Platform,
    private alertCtrl: AlertController,
    private app: App,
    private appLoadingService: AppLoadingService,
    private appState: AppState,
    private eafRestService: EAFRestService,
    private events: Events,
    private httpService: HttpService,
    private marketStore: Market,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    private toastCtrl: ToastController,
    private translationService: TranslationService,
  ) { }

  private _LOCAL_KEY_MESSAGE = 'server-message';

  public goToPage(_page: String | Page | ViewController | any, params: any, _direction: "forward" | "back"): void {
    let optional = { animate: true, direction: _direction };
    this.app.getRootNav().setRoot(_page, params || {}, optional);
  }

  private set storedAppRawMsg(serverResponse: string) {
    localStorage.setItem(this._LOCAL_KEY_MESSAGE, serverResponse);
  }

  private get storedAppRawMsg(): string {
    return localStorage.getItem(this._LOCAL_KEY_MESSAGE);
  }

  private isCurrentAppVersionNotUptoDate(storedMsgObject: ServerMessage, serverResponse: ServerMessage) {
    let storedVersNo = this.textToNumberic(storedMsgObject.messageVersion);
    let serverVersNo = this.textToNumberic(serverResponse.messageVersion);
    let currentVersion = this.textToNumberic(AppConstant.APP_VERSION);
    console.group("AppVersionNotUptoDate...");
    console.log("AppServices=> serverVersNo  :\t", "[" + serverResponse.messageVersion + "]", serverVersNo);
    console.log("AppServices=> storedVersNo  :\t", "[" + storedMsgObject.messageVersion + "]", storedVersNo);
    console.log("AppServices=> currentVersion:\t", "[" + (AppConstant.APP_VERSION.substr(0, (AppConstant.APP_VERSION.indexOf(' ')))) + "]", currentVersion, AppConstant.APP_VERSION);
    let hasNewer = serverVersNo > storedVersNo || serverVersNo > currentVersion;
    // console.log("AppServices=> has Newer App Update:", hasNewer);
    let ignoreUpdate = !(storedMsgObject.ignoredVersion == AppConstant.FLAG.YES && storedMsgObject.messageVersion == serverResponse.messageVersion);
    // console.log("AppServices=> ignoreUpdate :\t", ignoreUpdate);
    return serverResponse.messageType == ServerMessageType.UPDATE && ignoreUpdate && hasNewer;
  }

  private isMessageServerForceUpdate(serverResponse: ServerMessage): boolean {
    return serverResponse.messageType == ServerMessageType.UPDATE && serverResponse.forceUpdate;
  }

  private isMessageServerAnnounce(storedMsgObject: ServerMessage, serverResponse: ServerMessage): boolean {
    return serverResponse.messageType == ServerMessageType.ANNOUNCEMENT;
  }

  private textToNumberic(inStr) {
    let gistIdx = (inStr || '').indexOf(' ') || (inStr || '').indexOf('git');
    inStr = gistIdx > -1 ? inStr.substr(0, gistIdx) : inStr;
    return NumberUtil.string2number((inStr || "").replace(/[^0-9]+/g, ''));
  }

  private getProcessMessage(serverResponse: ServerMessage) {
    let returnMessage: ServerMessage = new ServerMessage();
    returnMessage.displayFlag = AppConstant.FLAG.NO;

    if (!ObjectsUtil.isEmptyObject(serverResponse)) {
      let storedAppRawMsg = localStorage.getItem(this._LOCAL_KEY_MESSAGE);
      let storedMsgObject: ServerMessage = !ObjectsUtil.isEmptyObject(storedAppRawMsg) ? JSON.parse(storedAppRawMsg) : {};
      let isFirstTimeShowMsg = ObjectsUtil.isEmptyObject(storedMsgObject);
      let isUpdateCondition = this.isCurrentAppVersionNotUptoDate(storedMsgObject, serverResponse);
      let isForecedUpdateCondition = this.isMessageServerForceUpdate(serverResponse);
      let isAnnouncedCondition = this.isMessageServerAnnounce(storedMsgObject, serverResponse);
      let isServerDuringMaintainCondition = serverResponse.messageType == ServerMessageType.MAINTAIN;
      const consStyle = (cons: boolean): string => {
        return cons ? 'background-color:lightgreen' : '';
      };
      console.log("%cisFirstTimeShowMsg:", consStyle(isFirstTimeShowMsg), isFirstTimeShowMsg);
      console.log("%cisUpdateCondition:", consStyle(isUpdateCondition), isUpdateCondition);
      console.log("%cisForecedUpdateCondition:", consStyle(isForecedUpdateCondition), isForecedUpdateCondition);
      console.log("%cisAnnouncedCondition:", consStyle(isAnnouncedCondition), isAnnouncedCondition);
      console.log("%cisServerDuringMaintainCondition:", consStyle(isServerDuringMaintainCondition), isServerDuringMaintainCondition);
      console.groupEnd();
      if (isFirstTimeShowMsg) {
        returnMessage = serverResponse;
        returnMessage.displayFlag = AppConstant.FLAG.YES;
        localStorage.setItem(this._LOCAL_KEY_MESSAGE, JSON.stringify(serverResponse));
      } else if (isUpdateCondition || isForecedUpdateCondition || isAnnouncedCondition || isServerDuringMaintainCondition) {
        returnMessage = serverResponse;
        returnMessage.displayFlag = AppConstant.FLAG.YES;
      }
    }
    return returnMessage;
  }

  private loadServerMessage(): Observable<any> {
    let verStr = (AppConstant.APP_VERSION || '').substr(0, (AppConstant.APP_VERSION || '').indexOf(' '));
    return this.eafRestService.getManualServlet('getRetrieveServerMessages', null, {
      orgId: this.appState.currentOrganizationId,
      appReqVersion: verStr,
    });
  }

  private getServerMessage(callback) {
    this.loadServerMessage()
      .subscribe(successResp => {
        return callback(this.getProcessMessage(successResp));
      }, (errorResp) => {
        return callback(this.getProcessMessage(null));
      });
  }

  public displayServerMsg(): void {
    this.getServerMessage((serverMessage) => {
      if (!ObjectsUtil.isEmptyObject(serverMessage) && serverMessage.displayFlag == AppConstant.FLAG.YES) {
        this.showAlertMessage(serverMessage);
      }
    });
  }

  private showAlertMessage(showAlertMessage: ServerMessage): void {
    let isHTMLMessage = new RegExp(/<[a-z][\s\S]*>/i).test(showAlertMessage.messageContent);
    let alertOtp: AlertOptions = { enableBackdropDismiss: false, cssClass: 'alertBinding' };
    let isIframe = StringUtil.isEmptyString(showAlertMessage.messageContent) && !StringUtil.isEmptyString(showAlertMessage.url);
    if (isHTMLMessage || isIframe) {
      alertOtp.cssClass = alertOtp.cssClass + ' alertHtmlBinding ';
      if (isIframe) {
        // let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(showAlertMessage.url);
        // let trustHtml = this.sanitizer.bypassSecurityTrustHtml('https://www.w3schools.com');
        // let trustScript = this.sanitizer.bypassSecurityTrustScript('https://www.w3schools.com');
        // let trustStyle = this.sanitizer.bypassSecurityTrustStyle('https://www.w3schools.com');
        // let trustUrl = this.sanitizer.bypassSecurityTrustUrl('https://www.w3schools.com');
        // let trustResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.w3schools.com');

        // console.log("TrustHtml :", this.sanitizer.bypassSecurityTrustHtml('https://www.w3schools.com'));
        // console.log("TrustScript :", this.sanitizer.bypassSecurityTrustScript('https://www.w3schools.com'));
        // console.log("TrustStyle :", this.sanitizer.bypassSecurityTrustStyle('https://www.w3schools.com'));
        // console.log("TrustUrl :", this.sanitizer.bypassSecurityTrustUrl('https://www.w3schools.com'));
        // console.log("TrustResourceUrl :", this.sanitizer.bypassSecurityTrustResourceUrl('https://www.w3schools.com'));

        // showAlertMessage.messageContent = "<iframe width=\"100%\" height=\"300\" [attr.src]=\"" + trustScript + "\"></iframe>";
      }
    }

    let alertCtrl = this.alertCtrl.create(alertOtp);
    if (showAlertMessage.messageTitle) {
      alertCtrl.setTitle(showAlertMessage.messageTitle);
    }
    if (showAlertMessage.messageContent) {
      alertCtrl.setMessage(showAlertMessage.messageContent);
    }

    if (showAlertMessage.messageType && showAlertMessage.messageType == ServerMessageType.UPDATE) {
      //-------------------Button--------------------
      let isForecedUpdateCondition = this.isMessageServerForceUpdate(showAlertMessage);
      let forceBtn = {
        text: 'อัพเดท เดี้ยวนี้',
        handler: (checkFlag) => {
          this.openMarketOrgId(this.appState.currentOrganizationId);
        }
      };
      let okayBtn = {
        text: 'ตกลง',
        handler: (checkFlag) => {
          if (checkFlag && checkFlag == AppConstant.FLAG.YES) {
            console.log('is Ignore This Version:', checkFlag);
            showAlertMessage.ignoredVersion = AppConstant.FLAG.YES;
            localStorage.setItem(this._LOCAL_KEY_MESSAGE, JSON.stringify(showAlertMessage));
          }
        }
      };
      //---------------------------------------
      alertCtrl.addButton(forceBtn);
      if (!isForecedUpdateCondition) {
        let alertInputOpt = {
          type: 'checkbox',
          label: this.translationService.translate("COMMON.SERVERMESSAGE.IGNORE_VERSION"),
          name: 'isIgnoreThisVersion',
          id: 'isIgnoreThisVersion',
          value: AppConstant.FLAG.YES,
        };
        alertCtrl.addInput(alertInputOpt);
        alertCtrl.addButton(okayBtn);
      }
    } else if (showAlertMessage.messageType == ServerMessageType.MAINTAIN) {
      alertCtrl.addButton({
        text: 'ปิด',
        handler: () => {
          this._platform.exitApp();
        }
      });
    } else {
      alertCtrl.addButton({
        text: 'ตกลง',
        handler: () => {
          //#TODO 
        }
      });
    }
    alertCtrl.present();
  }

  private openMarketOrgId(orgId: string | number): void {
    if (orgId == AppConstant.ORGANIZE_CODE.ORG_YBAT.id || orgId == AppConstant.ORGANIZE_CODE.ORG_YBAT.code) {
      this.openMarket("YBAT", AppConstant.YBAT_APP.PLAY_STORE, AppConstant.YBAT_APP.APP_STORE);
    } else if (orgId == AppConstant.ORGANIZE_CODE.ORG_WORKFORCE.id || orgId == AppConstant.ORGANIZE_CODE.ORG_WORKFORCE.code) {
      this.openMarket("WORKFORCE", AppConstant.WORKFORCE_APP.PLAY_STORE, AppConstant.WORKFORCE_APP.APP_STORE);
    }
  }

  public openMarket(appName: string, playStorePackageName: string, appStoreId: string): void {
    let search_path = null;
    if (this._platform.is('android')) {
      search_path = playStorePackageName;
    } else if (this._platform.is('ios')) {
      search_path = appStoreId;
    } else {
      console.error("can't defined platform :", JSON.stringify(this._platform));
    }
    console.log("search_path:", search_path);
    if (!StringUtil.isEmptyString(search_path)) {
      this.marketStore.open(search_path).then((resp) => {
        console.log("resp:", resp);
      }).catch((errResp) => {
        console.error("errResp:", errResp);
      });
    } else {
      console.error("search_path:", search_path);
    }
  }

  public getAppVersionsNo(): string {
    return AppConstant.APP_VERSION;
  }

  public publish(_eventsName: string, _dataParams?: any): void {
    this.events.publish(_eventsName, _dataParams);
    console.log("publish [" + _eventsName + "]:", _dataParams || '');
  }

  public subscribe(_eventsName: string, cb: (resp?: any) => void): void {
    this.events.subscribe(_eventsName, cb);
    console.log("subscribe [" + _eventsName + "]:", cb);
  }

  public unsubscribe(_eventsName: string): void {
    const unsubscribe = this.events.unsubscribe(_eventsName);
    console.log("unsubscribe [" + _eventsName + "]:", unsubscribe);
  }

  public openModal(_pageComp: any, _dataParams?: any, _modalOpt?: ModalOptions) {
    _modalOpt = _modalOpt || {};
    _modalOpt.cssClass = (_modalOpt.cssClass || "") + "modal-view wf-input-form";
    _modalOpt.showBackdrop = true;
    _modalOpt.enableBackdropDismiss = false;
    const createModal = this.modalController.create(_pageComp, _dataParams || {}, _modalOpt);
    createModal.present();
  }
}

export class ServerMessageType {
  /**
   * @messageType
   *  A: Announce ประกาศ
   *  U: Update การอัพเดพ
  */
  public static readonly ANNOUNCEMENT = "A";
  public static readonly UPDATE = "U";
  public static readonly MAINTAIN = "M";
}

export class ServerMessage {
  public id: number;
  public orgId: number;
  public messageType: string;
  public displayFlag?: string;
  public messageTitle: string;
  public messageContent: string;
  public messageDate?: string;
  public platform?: string;
  public messageVersion?: string;
  public forceUpdate?: boolean;
  public url?: string;
  public ignoredVersion?: string;
}