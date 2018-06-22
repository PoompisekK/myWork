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
import { ObjectsUtil } from '../../utilities/objects.util';
import { PopupUtil } from '../../utilities/popup.util';

@Component({
    selector: 'page-setting-password-page',
    templateUrl: 'setting-password-page.html',
})

export class SettingPasswordPage implements OnInit {
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private appState: AppState,
        private cacheService: AvaCacheService,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private authenticationService: AuthenticationService,
        private userProfileService: UserProfileService,
        private localizationService: LocalizationService,
        private viewController: ViewController,
        private translateService: TranslationService,
        private eafRestService: EAFRestService,
        private loadingCtrl: LoadingController,
        private authenService: AuthenticationService,
    ) {
    }

    public ngOnInit() {
        // this.viewController.setBackButtonText(this.translateService.translate('COMMON.BUTTON.BACK'));
    }

    private newPassword: string;

    private textPassword = {
        title: this.translateService.translate('COMMON.RESETTING_PW.TITLE'),
        save: this.translateService.translate('COMMON.BUTTON.SAVE'),
        oldPassword: this.translateService.translate('COMMON.SIGNUP.OLDPASSWORD'),
        newPassword: this.translateService.translate('COMMON.SIGNIN.NEWPASSWORD'),
        retryPassword: this.translateService.translate('COMMON.SIGNUP.RETRYPASSWORD'),
    };
    private datapassword = { oldPassword: '', password: '', retryPassword: '' };

    private handlerResetPassword() {
        const data = this.datapassword;
        console.log('newpassword : ', data);
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
                    title: this.translateService.translate('COMMON.RESETTING_PW.TITLE'),
                    cssClass: "alertMessageUserProfile",
                    message: this.translateService.translate('COMMON.ALERT.PASSWORD_LENGTH'),
                    buttons: [{
                        text: this.translateService.translate("COMMON.BUTTON.DONE"),
                        role: 'cancel'
                    }]
                });
                thirdAlert.onDidDismiss(() => {
                    //re-open reset password dialog
                    console.log('this.resetPassword();');
                });
                thirdAlert.present();
            }
        } else {
            let secondAlert = this.alertCtrl.create({
                title: this.translateService.translate('COMMON.RESETTING_PW.TITLE'),
                cssClass: "alertMessageUserProfile",
                message: this.translateService.translate('COMMON.SIGNUP.MISSMATCH_CONFIRM_PASSWORD'),
                buttons: [{
                    text: this.translateService.translate("COMMON.BUTTON.DONE"),
                    role: 'cancel'
                }]
            });
            secondAlert.onDidDismiss(() => {
                //re-open reset password dialog
                console.log('this.resetPassword();');
            });
            secondAlert.present();
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
                            message = this.translateService.translate("COMMON.SIGNIN.SUCCESSCHANGEPASSWORD");
                        } else {
                            message = this.translateService.translate("COMMON.SIGNIN.FAILCHANGEPASSWORD");
                        }
                        this.alertCtrl.create({
                            cssClass: "alertMessageUserProfile",
                            message: message,
                            buttons: [this.translateService.translate("COMMON.BUTTON.DONE")]
                        }).present();
                    }, (err) => {
                        this.alertCtrl.create({
                            cssClass: "alertMessageUserProfile",
                            message: err.message,
                            buttons: [this.translateService.translate("COMMON.BUTTON.DONE")]
                        }).present();
                    });
            } else {
                this.alertCtrl.create({
                    cssClass: "alertMessageUserProfile",
                    message: this.translateService.translate('COMMON.ALERT.INVALID'),
                    buttons: [this.translateService.translate('COMMON.BUTTON.DONE')]
                }).present();
            }
        }, (errorResp: Error) => {
            loading && loading.dismiss();
            this.alertCtrl.create({
                cssClass: "alertMessageUserProfile",
                message: this.translateService.translate('COMMON.ALERT.INVALID'),
                buttons: [this.translateService.translate('COMMON.BUTTON.DONE')]
            }).present();
        });
    }
}
