import { Component } from '@angular/core';
import { TranslationService } from 'angular-l10n';
import { Alert, AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';

import { AppState } from '../../app/app.state';
import { IonDigitKeyboard } from '../../components/ion-digit-keyboard/ion-digit-keyboard';
import { AppConstant } from '../../constants/app-constant';
import { message } from '../../layout-module/components/form-control-base/validate';
import { RequestOTPModel, VerifyOTPModel } from '../../model/authentication/otp-service.model';
import { UserModel } from '../../model/user/user.model';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { OTPVerificationService } from '../../services/otp-verification/otp-verification.service';
import { UserProfileService } from '../../services/userprofile/userprofile.service';
import { StringUtil } from '../../utilities/string.util';
import { ValidationUtil } from '../../utilities/validation.util';
import { RegisterRequestOTPPage } from '../register-request-otp-page/register-request-otp.page';

/**
 * @author Bundit.Ng
 * @since  Tue Sep 05 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@IonicPage({
  segment: 'forgot-pwd/verifyotp',
})
@Component({
  selector: 'forgot-pwd-verify-otp',
  templateUrl: 'forgot-pwd-verify-otp.page.html',
  styleUrls: ['/forgot-pwd-verify-otp.page.scss'],
  styles: ['ion-col{position:initial}']
})
export class ForgotPwdVerifyOtpPage {
  public reqRegisUser: UserModel;
  public verifyOtpM: VerifyOTPModel = new VerifyOTPModel;
  public otpInputList: string[] = [];

  public loading;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public translation: TranslationService,
    public userProfilesService: UserProfileService,
    public authenService: AuthenticationService,
    public validationUtil: ValidationUtil,
    public otpService: OTPVerificationService,
    public appState: AppState,
  ) {
    this.reqRegisUser = navParams.data;
    this.getRequestOTP(this.reqRegisUser);
  }

  private showKeyBoard() {
    try {
      if (IonDigitKeyboard.isShow()) {
        IonDigitKeyboard && IonDigitKeyboard.hide();
      } else {
        IonDigitKeyboard && IonDigitKeyboard.show();
      }
    } catch (e) {
      console.error("IonDigitKeyboard error:", e.message);
    }
  }

  private backBtn() {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot(RegisterRequestOTPPage, this.reqRegisUser);
    }
  }

  private deleteNumber(key: number) {
    console.log("deleteNumber:", key);
    if (this.otpInputList && this.otpInputList.length > 0) {
      this.otpInputList.pop();
    }
  }

  private onKeyboardButtonClick(key: number) {
    console.log("onKeyboardButtonClick:", key);
    if (typeof key == 'number') {
      if (this.otpInputList.length < 6) {
        this.otpInputList.push(key + '');
      }
    }
  }

  public resentOtp() {
    this.otpInputList = [];
    this.getRequestOTP(this.reqRegisUser);
  }

  public getRequestOTP(userM: UserModel): void {
    console.log("this.regisUserModel:", userM);
    this.loading = this.loadingCtrl.create({
      content: this.translation.translate('COMMON.ALERT.LOADING') + '...'
    });
    this.loading.present();
    let reqM: RequestOTPModel = new RequestOTPModel();
    reqM.orgID = this.appState.currentOrganizationId;
    reqM.language = (this.appState.language || '').toUpperCase();
    reqM.smsType = 'AUTHEN_OTP';
    let recievedMobileNo = (userM.dialCode || '');
    recievedMobileNo = (StringUtil.isEmptyString(recievedMobileNo) ? userM.mobile : recievedMobileNo + (userM.mobile || '').substr(1));
    console.log("recievedMobileNo:", recievedMobileNo);
    reqM.mobileNo = recievedMobileNo;
    reqM.sendType = 'NOW';
    this.authenService.getRequestOTP(reqM).subscribe((respReq) => {
      console.log("getRequestOTP respReq:", respReq);
      let dataResult = respReq.data;
      this.verifyOtpM = new VerifyOTPModel;
      this.verifyOtpM.messageTransactionID = dataResult.message_transaction_id;
      this.verifyOtpM.referKey = dataResult.refer_key;
      this.loading && this.loading.dismiss();
      this.otpService.referKey = dataResult.refer_key;
      // this.autoDetectOTP(reqM, this.verifyOtpM);
    }, (erOtp) => {
      console.error(" erOtp:", erOtp);
      this.loading && this.loading.dismiss();
    });
  }

  public autoDetectOTP(requestOtpM, verifyOtpM) {
    this.otpService.addEventListenerOTP(requestOtpM, (respOtpCode: string) => {
      console.log("autoDetectOTP callback :", respOtpCode);
      if (!StringUtil.isEmptyString(respOtpCode)) {
        this.otpInputList = respOtpCode.split('');
        this.submitOtp();
      }
    });
  }

  public submitOtp() {
    if (this.otpInputList.length == 6) {
      this.verifyOtpM.otpCode = (this.otpInputList || []).join('');
      this.loading = this.loadingCtrl.create({
        content: this.translation.translate('COMMON.ALERT.LOADING') + '...'
      });
      this.loading.present();
      this.getVerifyOTP(this.verifyOtpM, this.loading);
    } else {
      this.alertCtrl.create({
        message: this.translation.translate('COMMON.SIGNUP.VERIFY_INPUT'),
        buttons: [this.translation.translate('COMMON.BUTTON.DONE')],
        enableBackdropDismiss: false
      }).present();

    }
  }

  public getVerifyOTP(verM: VerifyOTPModel, loading: Loading): void {
    this.authenService.getVerifyOTP(verM).subscribe(respVerM => {
      console.log("getVerifyOTP :", respVerM);
      if (AppConstant.isSuccess(respVerM.status) && (respVerM.data || '') == 'valid') {
        loading && loading.dismiss();
        this.openResetPwdDialog();
      } else if (AppConstant.isSuccess(respVerM.status) && (respVerM.data || '') == 'invalid') {
        loading && loading.dismiss();
        let dispMsg = this.translation.translate('COMMON.SIGNUP.VERIFY_OTP_FAIL');
        if ((respVerM.message || '').toLowerCase().indexOf('expire') > -1) {
          dispMsg = this.translation.translate('COMMON.SIGNUP.VERIFY_OTP_EXPIRED');
        }
        this.alertCtrl.create({
          message: dispMsg,
          buttons: [this.translation.translate('COMMON.BUTTON.DONE')]
        }).present();
      } else {
        loading && loading.dismiss();
        this.alertCtrl.create({
          message: JSON.stringify(respVerM),
          buttons: [this.translation.translate('COMMON.BUTTON.DONE')]
        }).present();
      }
    }, (errVer) => {
      console.error("erro VerOTP :", errVer);
      loading && loading.dismiss();
    });
  }
  public openResetPwdDialog(): void {
    let firstAlert;
    let resetPwdDialogOtp = {
      title: this.translation.translate('COMMON.RESETTING_PW.TITLE'),
      inputs: [{
        name: "password",
        placeholder: this.translation.translate('COMMON.SIGNIN.NEWPASSWORD'),
        type: 'password'
      }, {
        name: "retryPassword",
        placeholder: this.translation.translate('COMMON.SIGNUP.RETRYPASSWORD'),
        type: 'password'
      }],
      buttons: [{
        text: this.translation.translate('COMMON.BUTTON.SAVE'),
        handler: data => {
          this.handlerResetPassword(data, firstAlert);
        }
      }, {
        text: this.translation.translate('COMMON.BUTTON.CANCEL'),
        role: 'cancel'
      }]
    };
    firstAlert = this.alertCtrl.create(Object.assign({}, resetPwdDialogOtp));
    firstAlert.present();
  }

  private handlerResetPassword(data, firstAlert: Alert) {
    if ((data.password == data.retryPassword)) {
      if ((data.password + data.retryPassword).length >= 16) {
        let loading = this.alertCtrl.create({
          message: 'Loading..',
          enableBackdropDismiss: false
        });
        loading.present();
        this.sendResetPassword(data.password, loading);
      } else {
        let thirdAlert = this.alertCtrl.create({
          title: this.translation.translate('COMMON.RESETTING_PW.TITLE'),
          cssClass: "alertMessageUserProfile",
          message: this.translation.translate('COMMON.ALERT.PASSWORD_LENGTH'),
          buttons: [{
            text: this.translation.translate("COMMON.BUTTON.DONE"),
            role: 'cancel'
          }]
        });
        firstAlert.onDidDismiss(() => {
          thirdAlert.onDidDismiss(() => {
            //re-open reset password dialog
            this.openResetPwdDialog();
          });
          thirdAlert.present();
        });
      }
    } else {
      let secondAlert = this.alertCtrl.create({
        title: this.translation.translate('COMMON.RESETTING_PW.TITLE'),
        cssClass: "alertMessageUserProfile",
        message: this.translation.translate('COMMON.SIGNUP.MISSMATCH_CONFIRM_PASSWORD'),
        buttons: [{
          text: this.translation.translate("COMMON.BUTTON.DONE"),
          role: 'cancel'
        }]
      });
      firstAlert.onDidDismiss(() => {
        secondAlert.onDidDismiss(() => {
          this.openResetPwdDialog();
        });
        secondAlert.present();
      });
    }
  }

  public sendResetPassword(password: string, loading: Alert): void {
    let newPassword = this.authenService.hashPassword(this.reqRegisUser.scmUserName, password);
    let hashKey = this.authenService.hashKeyForgotPassword(this.reqRegisUser.memberEmail, this.reqRegisUser.id);
    let hashUID = this.authenService.encodeUID(this.reqRegisUser.id);
    let email = encodeURI(this.reqRegisUser.memberEmail);
    this.authenService.resetPassword(hashKey, hashUID, email, newPassword)
      .subscribe((res) => {
        loading && loading.dismiss();
        let message;
        let isSuccess = false;
        if (res['status'] == "SUCCESS") {
          isSuccess = true;
          message = this.translation.translate("COMMON.SIGNIN.SUCCESSCHANGEPASSWORD");
        } else {
          message = this.translation.translate("COMMON.SIGNIN.FAILCHANGEPASSWORD");
        }
        let resultAlert = this.alertCtrl.create({
          cssClass: "alertMessageUserProfile",
          message: message,
          buttons: [this.translation.translate("COMMON.BUTTON.DONE")]
        });
        if (isSuccess) {
          resultAlert.onDidDismiss(() => {
            this.navCtrl.setRoot('LoginPage', null, {
              animate: true
            });
          });
        }
        resultAlert.present();
      }, (err) => {
        loading && loading.dismiss();
        this.alertCtrl.create({
          cssClass: "alertMessageUserProfile",
          message: err.message,
          buttons: [this.translation.translate("COMMON.BUTTON.DONE")]
        }).present();
      });
  }
  public exittoLoginPage(): void {
    let confirmAlert = this.alertCtrl.create({
      message: this.translation.translate('COMMON.SIGNUP.DO_YOUWANT_CANCEL'),
      buttons: [{ text: this.translation.translate('COMMON.BUTTON.CANCEL'), role: 'cancel', }, {
        text: this.translation.translate('COMMON.BUTTON.CONFIRM'),
        handler: () => {
          this.navCtrl.setRoot('LoginPage', null, {
            animate: true
          });
        }
      }]
    });
    confirmAlert.present();
  }
}