import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslationService } from 'angular-l10n';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';

import { AppState } from '../../app/app.state';
import { message } from '../../layout-module/components/form-control-base/validate';
import { VerifyOTPModel } from '../../model/authentication/otp-service.model';
import { UserModel } from '../../model/user/user.model';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { AvaCacheService } from '../../services/cache/cache.service';
import { UserProfileService } from '../../services/userprofile/userprofile.service';
import { ObjectsUtil } from '../../utilities/objects.util';
import { StringUtil } from '../../utilities/string.util';
import { ValidationUtil } from '../../utilities/validation.util';
import { RegisterVerifyOTPPage } from '../register-verify-otp-page/register-verify-otp.page';

/**
 * @author Bundit.Ng
 * @since  Tue Sep 05 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@IonicPage({
  segment: 'register/requestotp',
})
@Component({
  selector: 'register-request-otp-page',
  templateUrl: 'register-request-otp.page.html',
  styleUrls: ['/register-request-otp.page.scss'],
  styles: ['ion-col{position:initial}']
})
export class RegisterRequestOTPPage implements OnInit {

  public reqRegisUser: UserModel;
  public verifyOtpM: VerifyOTPModel;
  public dialCode: string;
  private countryList: any[] = [{ "countryName": "Thailand", "dialCode": "+66", "code": "TH" }];
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
    public cacheService: AvaCacheService,
  ) {
    this.reqRegisUser = navParams.data;
    this.reqRegisUser.dialCode = StringUtil.isEmptyString(this.reqRegisUser.dialCode) ? '+66' : this.reqRegisUser.dialCode;
  }

  public ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cacheService.gettDialCodeCountry().subscribe((respData) => {
      console.log("respData:", respData);
      if (!ObjectsUtil.isEmptyObject(respData)) {
        console.log("gettDialCodeCountry respData:", respData.length);
        this.countryList = respData.filter((respItem) => !StringUtil.isEmptyString(respItem.dialCode));
        console.log("this.countryList :", this.countryList.length);
      }
    });
  }

  public backBtn() {
    this.navCtrl.canGoBack() && this.navCtrl.pop();
  }

  public setDialCode(dialCode: string) {
    this.reqRegisUser.dialCode = dialCode;
    console.log("dialCode:", dialCode);
  }

  public submitRequestOTP(userForm: NgForm) {
    if (userForm.form.valid == true) {
      this.navCtrl.push(RegisterVerifyOTPPage, this.reqRegisUser);
    } else {
      this.validationUtil.displayInvalidRequireField(userForm.form, "COMMON.USERPROFILE.");
    }
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