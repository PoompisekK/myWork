import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslationService } from 'angular-l10n';
import { AlertController, LoadingController, NavController } from 'ionic-angular';

import { AppState } from '../../app/app.state';
import { AppConstant } from '../../constants/app-constant';
import { isDev } from '../../constants/environment';
import { UserModel } from '../../model/user/user.model';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserProfileService } from '../../services/userprofile/userprofile.service';
import { ObjectsUtil } from '../../utilities/objects.util';
import { StringUtil } from '../../utilities/string.util';
import { ValidationUtil } from '../../utilities/validation.util';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';

/**
 * @author Bundit.Ng
 * @since  Tue May 30 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@IonicPage({
  segment: 'register',
})
@Component({
  selector: 'register-page',
  templateUrl: 'register.page.html',
  styleUrls: ['/register-page.scss'],
  styles: ['ion-col{position:initial}']
})
export class RegisterPage {

  public regisUserModel: UserModel;
  public confirmPassword: string;
  public activeUserMethod: string = "email";
  private listCompany = [{
    url: "assets/img/btn-w.png", name: "Avalant Comp Code 1", code: "1"
  }, {
    url: "assets/img/btn-w.png", name: "Avalant Comp Code 2", code: "2"
  }];

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public translation: TranslationService,
    public userProfilesService: UserProfileService,
    public authenService: AuthenticationService,
    public validationUtil: ValidationUtil,
    public appState: AppState,

  ) {
    this.regisUserModel = new UserModel();
  }

  private updateIsKeep2Date(event: any) {
    // console.debug('event : ', event);
    this.regisUserModel.isKeepUpdate = event.checked;
  }

  private reqRegisUser: UserModel = new UserModel;
  public signItUp(registFrom: NgForm): void {

    if (isDev() && StringUtil.isEmptyString(this.regisUserModel.custFname)) {
      let tmStr = '' + new Date().getMinutes() + new Date().getSeconds();
      let topicName = "testwf";
      this.regisUserModel.custFname = topicName + tmStr;
      this.regisUserModel.custLname = topicName + tmStr;
      this.regisUserModel.scmUserName = topicName + tmStr;
      this.regisUserModel.memberEmail = topicName + tmStr + '@mail.com';
      this.regisUserModel.password = '1234';
      this.regisUserModel.confirmPassword = '1234';
      this.regisUserModel.isKeepUpdate = true;
      if (!this.activeUserMethod) {
        this.activeUserMethod = 'otp';
      }
    }

    if (registFrom.form.valid == true) {
      let noError = false;
      let loading = this.loadingCtrl.create({
        content: this.translation.translate('COMMON.SIGNUP.WORKING') + '...'
      });
      loading.present();
      this.regisUserModel.signinType = AppConstant.SIGNIN_TYPE.WORKFORCE;
      // this.regisUserModel.companyCode = "XXXXXXXXXX"; //#TODO_DREAM
      this.regisUserModel.socialUsername = this.regisUserModel.custFname + ' ' + this.regisUserModel.custLname;
      let regisM = this.regisUserModel;

      let alertMsgStr = this.translation.translate('COMMON.SIGNUP.VERIFY_INPUT');//`Please verify input.`;
      if (StringUtil.isEmptyString(regisM.password) || StringUtil.isEmptyString(regisM.confirmPassword) || regisM.password != regisM.confirmPassword) {
        alertMsgStr = this.translation.translate('COMMON.SIGNUP.MISSMATCH_CONFIRM_PASSWORD');
        noError = true;
      }
      if ((!StringUtil.isEmptyString(regisM.password) && regisM.password.trim().length < 4) ||
        (!StringUtil.isEmptyString(regisM.confirmPassword) && regisM.confirmPassword.trim().length < 4)) {
        alertMsgStr = this.translation.translate('COMMON.SIGNUP.PASSWORD_LESSTHAN4');
        noError = true;
      }
      if (noError) {
        this.alertCtrl.create({
          title: this.translation.translate('COMMON.SIGNUP.FAILED'),
          message: alertMsgStr,
          enableBackdropDismiss: false,
          buttons: [this.translation.translate('COMMON.BUTTON.CONFIRM')]
        }).present().then(() => {
          loading.dismiss();
        });
      } else {
        if (this.activeUserMethod) {
          if (this.activeUserMethod == 'email') {
            this.authenService.registerBySocialCom(this.regisUserModel).subscribe((response) => {
              console.log("dmpRegistration resp:", response);
              if (AppConstant.EAF_RESPONSE_CONST.isSuccess(response.status)) {
                loading.dismiss();
                this.reqRegisUser = ObjectsUtil.clone(this.regisUserModel);
                this.reqRegisUser.id = response['object'] && response['object'].id ? response['object'].id : null;
                this.alertCtrl.create({
                  title: this.translation.translate('COMMON.SIGNUP.COMPLETED'),
                  message: this.translation.translate('COMMON.SIGNUP.PLEASE_ACTIVATE'),
                  enableBackdropDismiss: false,
                  buttons: [this.translation.translate('COMMON.BUTTON.CONFIRM')]
                }).present().then(() => {
                  // this.gotoLoginPage();
                  this.navCtrl.setRoot('LoginPage', null, {
                    animate: true
                  });
                });

                //#TODO
                this.authenService.sendRegisterConfirmationEmail(this.regisUserModel.memberEmail).subscribe((response) => {
                  // console.debug(`Sent confirmation email to ${this.regisUserModel.memberEmail} :`, response);
                });
              } else {
                loading.dismiss();
                this.alertCtrl.create({
                  title: this.translation.translate('COMMON.SIGNUP.FAILED'),
                  message: this.translation.translate('COMMON.SIGNUP.' + ((response.message || '').replace(' ', '_').toUpperCase())),
                  enableBackdropDismiss: false,
                  buttons: [this.translation.translate('COMMON.BUTTON.CONFIRM')]
                }).present();
              }
            }, (errResp) => {
              loading.dismiss();
              this.alertCtrl.create({
                title: this.translation.translate('COMMON.SIGNUP.FAILED'),
                message: `Error : ${errResp.message}`,
                enableBackdropDismiss: false,
                buttons: [this.translation.translate('COMMON.BUTTON.CONFIRM')]
              }).present();
            });
          } else if (this.activeUserMethod == 'otp') {
            this.getRequestOTP(this.reqRegisUser);
            loading.dismiss();
          }
        } else {
          this.alertCtrl.create({
            title: this.translation.translate('COMMON.SIGNUP.FAILED'),
            message: this.translation.translate('COMMON.SIGNUP.VERIFY_INPUT'),
            enableBackdropDismiss: false,
            buttons: [this.translation.translate('COMMON.BUTTON.CONFIRM')]
          }).present();
        }
      }
    } else {
      this.validationUtil.displayInvalidRequireField(registFrom.form, "COMMON.SIGNUP.");
    }
  }
  public getRequestOTP(userM: UserModel): void {
    this.navCtrl.push('RegisterRequestOTPPage', this.regisUserModel);
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
}