import { Component } from '@angular/core';
import { TranslationService } from 'angular-l10n';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';

import { AppState } from '../../app/app.state';
import { IonDigitKeyboard } from '../../components/ion-digit-keyboard/ion-digit-keyboard';
import { AppConstant } from '../../constants/app-constant';
import { message } from '../../layout-module/components/form-control-base/validate';
import { RequestOTPModel, VerifyOTPModel } from '../../model/authentication/otp-service.model';
import { UserModel } from '../../model/user/user.model';
import { AuthenticationService } from '../../services/authentication/authentication.service';
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
  segment: 'register/verifyotp',
})
@Component({
  selector: 'register-verify-otp-page',
  templateUrl: 'register-verify-otp.page.html',
  styleUrls: ['/register-verify-otp.page.scss'],
  styles: ['ion-col{position:initial}']
})
export class RegisterVerifyOTPPage {
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
    public appState: AppState,
  ) {
    this.reqRegisUser = navParams.data;
    // if (isDev()) {
    //   let tmStr = '' + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds();
    //   this.reqRegisUser.custFname = "FirstName" + tmStr;
    //   this.reqRegisUser.custLname = "LastName" + tmStr;
    //   this.reqRegisUser.memberEmail = "testOTP" + tmStr + '@mail.com';
    //   this.reqRegisUser.password = '1234';
    //   this.reqRegisUser.confirmPassword = '1234';
    //   this.reqRegisUser.dialCode = '+66';
    //   this.reqRegisUser.mobile = '0987654321';
    // }
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
    reqM.language = 'EN';
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
    }, (erOtp) => {
      console.error(" erOtp:", erOtp);
      this.loading && this.loading.dismiss();
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
        if (!StringUtil.isEmptyString(this.reqRegisUser.id)) {//in case try to verify user again
          this.onWillGoLoginPage(loading, respVerM);
        } else {
          this.registerUserToSystem(loading);
        }
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
  public registerUserToSystem(loading: Loading): void {
    this.authenService.registerBySocialCom(this.reqRegisUser).subscribe((response) => {
      loading && loading.dismiss();
      console.log("dmpRegistration resp:", response);
      this.reqRegisUser.id = response['object'] && response['object'].id ? response['object'].id : null;
      this.onWillGoLoginPage(loading, response);
    }, err => {
      loading && loading.dismiss();
      console.error("dmpRegistration err:", err);
    });
  }
  public onWillGoLoginPage(loading: Loading, response: any): void {
    if (AppConstant.EAF_RESPONSE_CONST.isSuccess(response.status)) {
      loading && loading.dismiss();
      let alert = this.alertCtrl.create({
        message: this.translation.translate('COMMON.SIGNUP.VERIFIED_DONE'),
        buttons: [this.translation.translate('COMMON.BUTTON.DONE')]
      });
      alert.present();
      alert.onDidDismiss(() => {
        this.gotoLoginPage();
      });
    } else {
      loading && loading.dismiss();
      this.alertCtrl.create({
        message: response.message,
        buttons: [this.translation.translate('COMMON.BUTTON.DONE')]
      }).present();
      console.error("dmpRegistration error :", response);
    }
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
  public gotoLoginPage(): void {
    /* //#TODO Actived Manual Need new logic */
    this.authenService.activeEmailBySocialCom(this.reqRegisUser).subscribe((resp) => {
      console.log("activeEmailBySocialCom :", resp);
    }, erro => {
      console.error("activeEmailBySocialCom erro:", erro);
    });
    this.navCtrl.setRoot('LoginPage', null, {
      animate: true
    });
  }
}