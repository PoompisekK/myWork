import { isDev } from '../../constants/environment';
import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'angular-l10n';
import {
  Alert,
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  ToastController,
  ViewController,
  PopoverOptions,
  PopoverController,
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../app/app.state';
import { AppConstant } from '../../constants/app-constant';
import { UserModel } from '../../model/user/user.model';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { AvaCacheService } from '../../services/cache/cache.service';
import { EAFRestService } from '../../services/eaf-rest/eaf-rest.service';
import { LocalizationService } from '../../services/localization/localization-service';
import { UserProfileService } from '../../services/userprofile/userprofile.service';
import { PopupUtil } from '../../utilities/popup.util';
import { SettingPasswordPage } from '../setting-password-page/setting-password-page';
import { AppServices } from '../../services/app-services';
import { ObjectsUtil } from '../../utilities/objects.util';
import { AnimateCss } from '../../animations/animate-store';
import { SelectOptionsListPopoverPage } from '../../layout-module/components/select-popover/select-option.popover';
import { locale } from 'moment';
/**
 * Generated class for the SettingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
// @IonicPage({
//   segment: 'settings',
// })
@Component({
  selector: 'page-settings-page',
  templateUrl: 'settings.page.html',
  animations: [
    AnimateCss.peek()
  ]
})

export class SettingsPage implements OnInit {
  private isLoggedIn = this.appState.isLoggedIn;
  private isDev: boolean = isDev() || this.appServices.isServeChrome();
  constructor(
    private alertCtrl: AlertController,
    private appServices: AppServices,
    private appState: AppState,
    private authenService: AuthenticationService,
    private authenticationService: AuthenticationService,
    private cacheService: AvaCacheService,
    private eafRestService: EAFRestService,
    private loadingCtrl: LoadingController,
    private localizationService: LocalizationService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private translateService: TranslationService,
    private userProfileService: UserProfileService,
    private viewController: ViewController,
  ) {
  }

  public ngOnInit() {
    // this.viewController.setBackButtonText(this.translateService.translate('M_BUTTON.BACK'));
  }
  private swipedCount: number = 0;
  private swipeEvent(e) {
    this.swipedCount++;
  }
  private clickCount: number = 0;
  private clickEvent(e) {
    this.clickCount += 1;
  }
  private toggleLanguage(): void {
    console.log("toggleLanguage :", this.currLang);

    const popoverOpt: PopoverOptions = {};
    popoverOpt.cssClass = "custom-popover";
    popoverOpt.showBackdrop = true;
    const settingOpt = [
      { code: '1', name: 'Thai' },
      { code: '2', name: "English" },
    ];
    const popover = this.popoverCtrl.create(SelectOptionsListPopoverPage, settingOpt, popoverOpt);
    popover.present();
    popover.onWillDismiss(resp => {
      switch (resp) {
        case '1': this.changeLanguage('th');
          break;
        case '2': this.changeLanguage('en');
          break;
        default:
          break;
      }
    });
  }
  
  private currLang: string = locale(this.appState.language);
  private changeLanguage(language: string): void {
    this.currLang = language;
    this.localizationService.setLanguageSync(language);
    this.localizationService.manualChangeWithOutLogin = true;
    // this.viewController.setBackButtonText(this.translateService.translate('M_BUTTON.BACK'));
    if (this.appState.businessUser) {
      this.appState.businessUser.languages = language.toUpperCase();
      this.userProfileService.updateUserProfile(this.appState.businessUser);
    }
    // this.appState.language = language; // Don't need to re-set a new language for it. (Use getter)
    // console.log(" SettingsPage this.appState.language:", this.appState.language);
  }

  private refreshEAFCache(): void {
    this.cacheService.refreshEAFCaches().subscribe((resp) => {
      // console.debug('EAF Caches Refreshed.');
      this.toastCtrl.create({
        message: 'EAF Refresh caches successful.',
        position: 'bottom',
        duration: 3000,
      }).present();
    }, (error) => {
      console.warn('⚠️ Error refresh master cache :', error);
      PopupUtil.generateErrorPopup(this.alertCtrl, error).present();
    });

    this.cacheService.refreshEAFManualServletCaches().subscribe((resp) => {
      // console.debug('EAF Manual Servlet Caches Refreshed.');
      this.toastCtrl.create({
        message: 'Manual Servlet Refresh caches successful.',
        position: 'bottom',
        duration: 3000,
      }).present();
    }, (error) => {
      console.warn('⚠️ Error refresh master cache :', error);
      PopupUtil.generateErrorPopup(this.alertCtrl, error).present();
    });
  }

  private forgotUserModel: UserModel;
  private username: string;
  private newPassword: string;
  private loadUsername(username: string) {
    this.loading = this.alertCtrl.create({
      message: 'Loading..',
      enableBackdropDismiss: false
    });
    this.loading.present();
    this.getUserInfo(username).subscribe((resp) => {
      this.loading && this.loading.dismiss();
      if (resp && resp.length > 0 && resp[0]) {
        this.forgotUserModel = resp[0];
      } else {
        this.forgotUserModel = null;
        this.alertCtrl.create({
          message: "ไม่พบ Username ในระบบ",
          buttons: [{ text: "Cancel", role: 'cancel', }]
        }).present();
      }
    }, error => {
      this.loading && this.loading.dismiss();
      console.error("error:", error);
    });
  }
  private userChanged(): void {
    this.forgotUserModel = null;
    this.newPassword = null;

  }
  private getUserInfo(scmUserName: string): Observable<any> {
    return this.eafRestService.searchEntity(UserModel, UserModel.ENTITY_ID, {
      SCMUSERNAME: scmUserName,
      USER_STATUS: 'A',
    }, { page: '1', volumePerPage: '20' });
  }
  private loading: Alert;
  private submitChangPassword(newPassword: string) {
    this.loading = this.alertCtrl.create({
      message: 'Loading..',
      enableBackdropDismiss: false
    });
    this.loading.present();
    this.sendResetPassword(newPassword, this.loading);
  }
  public sendResetPassword(password: string, loading: Alert): void {
    let scmUserName = this.forgotUserModel.scmUserName;
    let memberEmail = this.forgotUserModel.memberEmail;
    let id = this.forgotUserModel.id;

    console.log("forgotUserModel scmUserName:", scmUserName);
    console.log("forgotUserModel memberEmail:", memberEmail);
    console.log("forgotUserModel id:", id);

    let newPassword = this.authenService.hashPassword(scmUserName, password);
    let hashKey = this.authenService.hashKeyForgotPassword(memberEmail, id);
    let hashUID = this.authenService.encodeUID(id);
    let email = encodeURI(memberEmail);
    this.authenService.resetPassword(hashKey, hashUID, email, newPassword)
      .subscribe((res) => {
        loading && loading.dismiss();
        let message;
        let isSuccess = false;
        console.log("change Password :", res);
        if (res['status'] == "SUCCESS") {
          isSuccess = true;
          message = "เปลี่ยนรหัสผ่านสำเร็จ";
        } else {
          message = "เปลี่ยนรหัสผ่านไม่สำเร็จ !!!";
        }
        let resultAlert = this.alertCtrl.create({
          cssClass: "alertMessageUserProfile",
          message: message,
          buttons: ["DONE"]
        });
        if (isSuccess) {
          resultAlert.onDidDismiss(() => {

          });
        }
        resultAlert.present();
      }, (err) => {
        loading && loading.dismiss();
        this.alertCtrl.create({
          cssClass: "alertMessageUserProfile",
          message: err.message,
          buttons: ["DONE"]
        }).present();
      });
  }

  private resetPassword(): void {
    let firstAlert;
    let resetPwdDialogOtp = {
      title: this.translateService.translate('M_RESETTING_PW.TITLE'),
      inputs: [{
        name: "oldPassword",
        placeholder: this.translateService.translate('M_SIGNUP.OLDPASSWORD'),
        type: 'password'
      }, {
        name: "password",
        placeholder: this.translateService.translate('M_SIGNIN.NEWPASSWORD'),
        type: 'password'
      }, {
        name: "retryPassword",
        placeholder: this.translateService.translate('M_SIGNUP.RETRYPASSWORD'),
        type: 'password'
      }],
      buttons: [{
        text: this.translateService.translate('M_BUTTON.CANCEL'),
        role: 'cancel'
      }, {
        text: this.translateService.translate('M_BUTTON.SAVE'),
        handler: data => {
          this.handlerResetPassword(data, firstAlert);
        }
      }]
    };
    firstAlert = this.alertCtrl.create(Object.assign({}, resetPwdDialogOtp));
    firstAlert.present();
  }
  private handlerResetPassword(data, firstAlert: Alert) {
    if ((data.password == data.retryPassword)) {
      if ((data.password + data.retryPassword).length >= 8) {
        let loading = this.alertCtrl.create({
          message: 'Loading..',
          enableBackdropDismiss: false
        });
        loading.present();
        this.submitChangePassword(data.password, data.oldPassword, loading);
      } else {
        let thirdAlert = this.alertCtrl.create({
          title: this.translateService.translate('M_RESETTING_PW.TITLE'),
          cssClass: "alertMessageUserProfile",
          message: this.translateService.translate('M_ALERT.PASSWORD_LENGTH'),
          buttons: [{
            text: this.translateService.translate("M_BUTTON.DONE"),
            role: 'cancel'
          }]
        });
        firstAlert.onDidDismiss(() => {
          thirdAlert.onDidDismiss(() => {
            //re-open reset password dialog
            this.resetPassword();
          });
          thirdAlert.present();
        });
      }
    } else {
      let secondAlert = this.alertCtrl.create({
        title: this.translateService.translate('M_RESETTING_PW.TITLE'),
        cssClass: "alertMessageUserProfile",
        message: this.translateService.translate('M_SIGNUP.MISSMATCH_CONFIRM_PASSWORD'),
        buttons: [{
          text: this.translateService.translate("M_BUTTON.DONE"),
          role: 'cancel'
        }]
      });
      firstAlert.onDidDismiss(() => {
        secondAlert.onDidDismiss(() => {
          //re-open reset password dialog
          this.resetPassword();
        });
        secondAlert.present();
      });
    }
  }
  private checkOldPasswordModel: UserModel = new UserModel();
  private submitChangePassword(password: string, oldPassword: string, loading: Alert) {
    this.checkOldPasswordModel.signinType = AppConstant.SIGNIN_TYPE.MOBILE_APPLICATION;
    // const _UserCode = this.appState.businessUser.memberEmail;
    const usermodel = this.appState.businessUser;
    const _userNameEmail = usermodel.scmUserName;
    const _userID = usermodel.id;
    this.checkOldPasswordModel.memberEmail = _userNameEmail;
    this.checkOldPasswordModel.password = oldPassword;
    this.authenService.getUserLoginDmp(this.checkOldPasswordModel).subscribe((respData) => {
      loading && loading.dismiss();
      if (!ObjectsUtil.isEmptyObject(respData)) {
        this.newPassword = this.authenService.hashPassword(_userNameEmail, password);
        const hashKey = this.authenService.hashKeyForgotPassword(_userNameEmail, _userID);
        const hashUID = this.authenService.encodeUID(_userID);
        const email = encodeURI(_userNameEmail);
        this.authenService.resetPassword(hashKey, hashUID, email, this.newPassword)
          .subscribe((res) => {
            let message;
            if (res['status'] == "SUCCESS") {
              message = this.translateService.translate("M_SIGNIN.SUCCESSCHANGEPASSWORD");
            } else {
              message = this.translateService.translate("M_SIGNIN.FAILCHANGEPASSWORD");
            }
            this.alertCtrl.create({
              cssClass: "alertMessageUserProfile",
              message: message,
              buttons: [this.translateService.translate("M_BUTTON.DONE")]
            }).present();
          }, (err) => {
            this.alertCtrl.create({
              cssClass: "alertMessageUserProfile",
              message: err.message,
              buttons: [this.translateService.translate("M_BUTTON.DONE")]
            }).present();
          });
      } else {
        this.alertCtrl.create({
          cssClass: "alertMessageUserProfile",
          message: this.translateService.translate('M_ALERT.INVALID'),
          buttons: [this.translateService.translate('M_BUTTON.DONE')]
        }).present();
      }
    }, (errorResp: Error) => {
      loading && loading.dismiss();
      this.alertCtrl.create({
        cssClass: "alertMessageUserProfile",
        message: this.translateService.translate('M_ALERT.INVALID'),
        buttons: [this.translateService.translate('M_BUTTON.DONE')]
      }).present();
    });
  }

  private toSettingPassword() {
    this.appServices.openModal(SettingPasswordPage, {});
  }

}
