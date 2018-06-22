import { Component } from '@angular/core';
import { TranslationService } from 'angular-l10n';
import { AlertController, IonicPage, Loading, LoadingController, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { UserModel } from '../../model/user/user.model';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { EAFRestService } from '../../services/eaf-rest/eaf-rest.service';
import { StringUtil } from '../../utilities/string.util';
import { ForgotPwdVerifyOtpPage } from '../forgot-pwd-verify-otp-page/forgot-pwd-verify-otp.page';

/**
 * @author Bundit.Ng
 * @since  Fri Sep 15 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@IonicPage({
  segment: 'forgot-pwd',
})
@Component({
  selector: 'forgot-pwd-page',
  templateUrl: 'forgot-pwd.page.html',
  styleUrls: ['/forgot-pwd.page.scss'],
  styles: ['ion-col{position:initial}']
})
export class ForgotPwdPage {

  public activateType: string;
  public forgotUserModel: UserModel;
  public scmUserName: string;
  public loading: Loading;

  public isEmptyMobile: boolean = false;
  public isEmptyEmail: boolean = false;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public translation: TranslationService,
    public eafRestService: EAFRestService,
    public authenticationService: AuthenticationService,
  ) {
    this.forgotUserModel = new UserModel();
  }

  public submitForgotPassword(forgotUserModel: UserModel): void {
    console.log("forgotUserModel.scmUserName:", forgotUserModel.scmUserName);
    this.loading = this.loadingCtrl.create({
      content: this.translation.translate('COMMON.ALERT.LOADING') + '...'
    });
    this.loading.present();
    if (StringUtil.isEmptyString(this.scmUserName)) {
      this.requestUserInfo(forgotUserModel);
    } else {
      if (this.scmUserName != forgotUserModel.scmUserName) {
        this.requestUserInfo(forgotUserModel, (resp) => {
          this.goNext(forgotUserModel);
        });
      } else {
        this.goNext(forgotUserModel);
      }
    }
  }

  public goNext(userModel: UserModel): void {
    if (this.activateType == 'sms') {
      this.navCtrl.push(ForgotPwdVerifyOtpPage, userModel);
      this.loading && this.loading.dismiss();
    } else if (this.activateType == 'email') {
      this.authenticationService.forgotPassword(userModel.scmUserName)
        .subscribe(resp => {
          this.loading && this.loading.dismiss();
          let confirmAlert = this.alertCtrl.create({
            message: this.translation.translate('COMMON.FORGOTPW.FORGOT_SUCCESS_U_MUST_CHECK_INBOX'),
            buttons: [{
              text: this.translation.translate('COMMON.BUTTON.CONFIRM'),
              handler: () => {
                this.navCtrl.setRoot('LoginPage', null, {
                  animate: true
                });
              }
            }]
          });
          confirmAlert.present();
        });
    }
  }

  public getUserInfo(userModel: UserModel): Observable<any> {
    return this.eafRestService.searchEntity(UserModel, UserModel.ENTITY_ID, {
      SCMUSERNAME: userModel.scmUserName,
      USER_STATUS: 'A',
    }, { page: '1', volumePerPage: '20' });
  }

  public gotoLoginPage(): void {
    let confirmAlert = this.alertCtrl.create({
      // title: 'Confirm purchase',
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

  private onInputUserName(scmUserName: string, tmpScmUserName: string) {
    if (scmUserName != tmpScmUserName) {
      this.scmUserName = null;
      this.activateType = null;
    }
  }

  private requestUserInfo(forgotUserModel: UserModel, callback?: (resp) => void) {
    this.getUserInfo(forgotUserModel).subscribe((resp) => {
      this.loading && this.loading.dismiss();
      console.log("getUserInfo success:", resp);
      if (resp && resp.length > 0 && resp[0]) {
        this.forgotUserModel = resp[0];
        this.scmUserName = this.forgotUserModel.scmUserName;

        this.isEmptyMobile = StringUtil.isEmptyString(this.forgotUserModel.mobile);
        this.isEmptyEmail = StringUtil.isEmptyString(this.forgotUserModel.memberEmail);

        console.log("this.isEmptyMobile :", this.forgotUserModel.mobile, this.isEmptyMobile);
        console.log("this.isEmptyEmail  :", this.forgotUserModel.memberEmail, this.isEmptyEmail);

        callback && callback(this.forgotUserModel);
      } else {
        this.scmUserName = null;
        this.alertCtrl.create({
          message: this.translation.translate('COMMON.ALERT.EMAIL_DOESNT_EXIST'),
          buttons: [{ text: this.translation.translate('COMMON.BUTTON.CANCEL'), role: 'cancel', }]
        }).present();
        callback && callback(null);
      }
    }, error => {
      this.scmUserName = null;
      this.loading && this.loading.dismiss();
      callback && callback(null);
      console.error("getUserInfo error:", error);
    });
  }
}