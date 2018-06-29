import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Keyboard } from '@ionic-native/keyboard';
import { LinkedIn } from '@ionic-native/linkedin';
import { TranslationService } from 'angular-l10n';
import {
    AlertController,
    App,
    Content,
    DomController,
    IonicPage,
    LoadingController,
    MenuController,
    NavController,
    NavParams,
    Platform,
} from 'ionic-angular';
import { AlertButton } from 'ionic-angular/components/alert/alert-options';
import { Subject } from 'rxjs';

import { MyApp } from '../../app/app.component';
import { AppState } from '../../app/app.state';
import { AppConstant } from '../../constants/app-constant';
import { isDev } from '../../constants/environment';
import { SCMRestApi } from '../../constants/scm-rest-api';
import { AuthenticationAllowModel } from '../../model/authentication/authentication-allow.model';
import { UserModel } from '../../model/user/user.model';
import { AppServices } from '../../services/app-services';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { HCMAuthenticationService } from '../../services/authentication/hcm-authentication.service';
import { LocalizationService } from '../../services/localization/localization-service';
import { MobileInfoService } from '../../services/mobile-service/mobile-info.service';
import { OrganizationService } from '../../services/organization/organization.service';
import { UserProfileService } from '../../services/userprofile/userprofile.service';
import { ObjectsUtil } from '../../utilities/objects.util';
import { WorkforceHttpService } from '../../workforce/service/workforceHttpService';
import { RegisterRequestOTPPage } from '../register-request-otp-page/register-request-otp.page';
import { AppAlertService } from '../../workforce/service/appAlertService';

@IonicPage({
    segment: 'login',
})
@Component({
    selector: 'login-page',
    templateUrl: 'login.page.html',
    styleUrls: ['/login/login.page.scss']
})
export class LoginPage implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('header') private headerElement: ElementRef;

    @ViewChild('loginForm') private loginForm: ElementRef;

    @ViewChild(Content) private content: Content;

    private providerName: {};
    private allowSignInSocial = false;
    private allowFacebook = false;
    private allowGoogle = false;
    private allowLinkenIn = false;
    private authList: AuthenticationAllowModel[];

    private isFixedBottomForm: boolean = true;

    private isKeyboardOpened: boolean = false;

    // private loginModel: AuthenticationRequestModel = new AuthenticationRequestModel();
    private loginModel: UserModel = new UserModel();

    /**
     * Unsubscribing Declaratively with takeUntil
     * 
     * @see https://alligator.io/angular/takeuntil-rxjs-unsubscribe/
     */
    private ngUnsubscribe: Subject<boolean> = new Subject();

    constructor(
        private app: App,
        private platform: Platform,
        private appServices: AppServices,
        private keyboard: Keyboard,
        private navCtrl: NavController,
        private navParams: NavParams,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private translation: TranslationService,
        private authenticationService: AuthenticationService,
        private hcmAuthenticationService: HCMAuthenticationService,
        private appState: AppState,
        private userProfileService: UserProfileService,
        private menuCtrl: MenuController,
        private facebookApi: Facebook,
        private googlePlusApi: GooglePlus,
        private linkedInApi: LinkedIn,
        private orgService: OrganizationService,
        private localizationService: LocalizationService,
        private dom: DomController,
        private mobileInfoService: MobileInfoService,
        private wfHttpService: WorkforceHttpService,
        private appAlertService: AppAlertService,
    ) {
        this.providerName = AppConstant.SocialSignInType;
    }

    public ngOnInit(): void {
        // this.loginModel.scmUserName = "empwf";
        // this.loginModel.password =  "1234"
        // this.menuCtrl.swipeEnable(false);
        this.menuCtrl.swipeEnable(true);

        // This toggle used on Android only !
        if (this.platform.is('android')) {
            // Watching for keyboard
            this.keyboard.onKeyboardShow().takeUntil(this.ngUnsubscribe).subscribe(() => {
                // If keyboard is already opened. Then do nothing.
                console.debug('isKeyboardOpened :', this.isKeyboardOpened);

                if (this.isKeyboardOpened) { return; }

                this.toggleFixedBottomPage();
                this.isKeyboardOpened = true;
            });
            this.keyboard.onKeyboardHide().takeUntil(this.ngUnsubscribe).subscribe(() => {
                console.debug('isKeyboardOpened :', this.isKeyboardOpened);

                if (!this.isKeyboardOpened) { return; }

                this.toggleFixedBottomPage();
                this.isKeyboardOpened = false;
            });
        }

        false && this.orgService.getAuthMethodFromOrgID().subscribe(resp => {
            // console.log('get Auth => ', resp);
            this.authList = resp;
            for (let index = 0; index < this.authList.length; index++) {
                if (this.authList[index].authCode == 'Facebook') {
                    this.allowFacebook = true;
                }
                if (this.authList[index].authCode == 'LinkenIn') {
                    this.allowLinkenIn = true;
                }
                if (this.authList[index].authCode == 'Google') {
                    this.allowGoogle = true;
                }
                if (this.allowFacebook || this.allowGoogle || this.allowLinkenIn) {
                    this.allowSignInSocial = true;
                }
            }

        }, error => {
            console.warn('Error => ', error);
        });
    }

    public ngOnDestroy(): void {
        this.menuCtrl.swipeEnable(true);

        // Now let's also unsubscribe from the subject itself:
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.unsubscribe();
    }

    public ngAfterViewInit(): void {
        this.checkOnResize(null);
    }

    @HostListener('window:resize', ['$event'])
    public checkOnResize(e: Event): void {
        // Use when resizing to detect keyboard on Android is NOT GOOD !
        // this.toggleFixedBottomPage(e);
    }

    private toggleFixedBottomPage(e?: Event): void {
        if (!this.headerElement || !this.loginForm) {
            return;
        }
        this.dom.read(() => {
            const headerElement: HTMLElement = this.headerElement.nativeElement;
            const loginFormElement: HTMLElement = this.loginForm.nativeElement;

            const windowOuterHeight = window.outerHeight;
            const headerClientHeight = headerElement.clientHeight;
            const loginFormClientHeight = loginFormElement.clientHeight;

            this.dom.write(() => {
                this.isFixedBottomForm = windowOuterHeight > (headerClientHeight + loginFormClientHeight);

                setTimeout(() => {
                    this.content.scrollToBottom();
                }, 200);
            });
        });
    }

    private handleRespMessage(error) {
        let dialogBtn: AlertButton[] = [];
        if (error.code == SCMRestApi.ERROR_CODES.NEED_EMAIL_ACTIVATED) {
            false && dialogBtn.push({
                text: this.translation.translate('M_SIGNIN.VERIFY_OTP_NOW'), handler: () => {
                    this.navCtrl.setRoot(RegisterRequestOTPPage, error.object);
                }
            });
        }
        if (error.code == SCMRestApi.ERROR_CODES.INVALID_CREDIENTIAL) {
            //#TODO
        }
        dialogBtn.push({ text: this.translation.translate("M_BUTTON.DONE"), role: "cancel" });

        this.alertCtrl.create({
            title: this.translation.translate('M_SIGNIN.FAILED'), //'Login fail',
            message: `${error.msg}`,
            buttons: dialogBtn
        }).present();
    }

    private login() {
        let loading = this.loadingCtrl.create({
            content: this.translation.translate('M_SIGNIN.SIGN_IN_WORKING')
        });
        loading.present();
        this.hcmAuthenticationService.getHCMLoginToDMP(this.loginModel).subscribe((respData) => {
            console.info("getHCMLoginToDMP :", respData);
            if (!ObjectsUtil.isEmptyObject(respData)) {
                if (AppConstant.FLAG.ACTIVE.equals(respData.userStatus)) {
                    this.afterLoginSuccess(respData);
                } else {
                    this.handleRespMessage({
                        code: respData.userStatus,
                        object: respData,
                        msg: `${this.translation.translate(respData.userStatus)}`
                    });
                }
            } else {
                this.handleRespMessage({
                    code: respData,
                    message: respData
                });
            }
            loading.dismiss();
        }, (errorResp: Error) => {
            this.handleRespMessage({
                code: errorResp.message,
                object: errorResp['object'],
                msg: `${this.translation.translate(errorResp.message)}`
            });
            loading.dismiss();
        });
    }

    private afterLoginSuccess(respData): void {
        this.loginModel.scmUserName = this.loginModel.password = '';
        this.appState.businessUser = respData;
        this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.RELOAD_IMAGE_PROFILE, this.appState.businessUser && this.appState.businessUser.employeeCode);
        this.wfHttpService.employeeCode = this.appState.businessUser.employeeCode;
        this.app.setElementClass('signed-in', true);
        // this.appState.businessUser.password = null;
        this.appState.currentOrganizationId = this.appState.businessUser.orgId;
        this.localizationService.setLanguage('en');
        // let language: string = this.appState.businessUser.languages;
        // if (!language) {
        //   this.localizationService.setLanguage('en');
        // } else {
        //   this.localizationService.setLanguage(language.toLowerCase());
        // }

        this.appState.mobileInfo.businessUserId = this.appState.businessUser.id;

        this.mobileInfoService.saveMobileInformation(this.appState.mobileInfo);
        this.gotoHomePage();
    }

    public autoLogin(): void {
        if (isDev()) {
            this.loginModel.scmUserName = "testwf003";
            this.loginModel.password = "1234";
            this.login();
        }
    }

    public gotoHomePage(): void {
        // this.userProfileService.retrieveUserProfilesInfo();

        this.menuCtrl.swipeEnable(false);
        this.navCtrl.setRoot(MyApp.DEFAULT_PAGE, null, {
            animate: true
        });
    }
    public loginWith(signInMethod: string): void {
        let loading = this.loadingCtrl.create({
            content: this.translation.translate('M_SIGNIN.SIGN_IN_WORKING')
        });
        loading.present();

        console.warn('%cLoginWith:', 'color:white;background-color:blue', signInMethod);

        let self = this;
        if (AppConstant.SocialSignInType.FACEBOOK == signInMethod) {
            this.facebookApi.login(['public_profile', 'user_friends', 'email', 'user_photos'])
                .then((res: FacebookLoginResponse) => {
                    // console.log('Logged into Facebook!', res)
                    // console.debug(res.status);
                    if (res.status == 'connected') {
                        this.facebookApi.api('/me?fields=id,name,email,picture.type(large)', ['public_profile', 'user_friends', 'email', 'user_photos'])
                            .then(result => {
                                console.log('facebook login response => ', result);
                                let socialAuth = new UserModel();
                                socialAuth.memberEmail = result.email;
                                socialAuth.socialUserId = result.id;
                                socialAuth.socialPicProfile = result.picture.data.url;
                                socialAuth.socialUsername = result.name;
                                // socialAuth.custFname = result.firstName;
                                // socialAuth.custLname = result.lastName;
                                this.getUserSignInSocial(socialAuth, loading, signInMethod);
                            }).catch((ex) => {
                                console.log('Error', ex);
                            });
                    }
                }).catch(e => console.log('Error logging into Facebook', e));
            loading.dismiss();
        } else if (AppConstant.SocialSignInType.GOOGLE == signInMethod) {
            this.googlePlusApi.login({})
                .then((resp) => {
                    console.log("googlePlus resp:", resp);
                    let socialAuth = new UserModel();
                    socialAuth.memberEmail = resp.email;
                    socialAuth.socialUserId = resp.userId;
                    socialAuth.socialPicProfile = resp.imageUrl;
                    socialAuth.socialUsername = resp.givenName;
                    // socialAuth.custFname = resp.firstName;
                    // socialAuth.custLname = resp.lastName;
                    this.getUserSignInSocial(socialAuth, loading, signInMethod);
                }).catch((err) => {
                    console.error("googlePlus err:", err);
                });

        } else if (AppConstant.SocialSignInType.LINKEDIN == signInMethod) {
            this.linkedInApi.login(['r_basicprofile', 'r_emailaddress', 'rw_company_admin', 'w_share'], true)
                .then((resp) => {
                    console.log("linkedin login resp:", resp);
                    if (AppConstant.isOkay(resp)) {
                        let pathStr = ['id', 'first-name', 'last-name', 'picture-url', 'email-address'];
                        this.linkedInApi.getRequest('people/~:(' + pathStr.join(',') + ')')
                            .then((respReq) => {
                                console.log("linkedin getRequest resp:", respReq);
                                let socialAuth = new UserModel();
                                socialAuth.memberEmail = resp.emailAddress;
                                socialAuth.socialUserId = resp.id;
                                socialAuth.socialPicProfile = resp.pictureUrl;
                                socialAuth.socialUsername = resp.firstName + (resp.lastName ? ' ' + resp.lastName : '');
                                socialAuth.custFname = resp.firstName;
                                socialAuth.custLname = resp.lastName;
                                this.getUserSignInSocial(socialAuth, loading, signInMethod);
                            }).catch((err) => {
                                console.error("linkedin err:", err);
                            });
                    } else {
                        console.error("linkedin resp:", resp);
                    }
                }).catch((err) => {
                    err = JSON.parse(err);
                    console.error("linkedin err:", err);
                    if (err.errorCode == 'USER_CANCELLED') {
                        this.appServices.openMarket(AppConstant.SocialSignInType.LINKEDIN, AppConstant.LINKEDIN_APP.PLAY_STORE, AppConstant.LINKEDIN_APP.APP_STORE);
                    }
                });
        }
        loading.dismiss();
    }

    public getUserSignInSocial(socialAuth: UserModel, loading, signInMethod: string): void {
        let self = this;
        this.authenticationService.getUserSignInSocial(socialAuth).subscribe(resp => {
            // console.log("getUserLoginSocial resp:", resp);
            this.appState.businessUser = resp;
            this.appState.mobileInfo.businessUserId = this.appState.businessUser.id;
            this.mobileInfoService.saveMobileInformation(this.appState.mobileInfo);
            self.gotoHomePage();
            loading.dismiss();
        }, (errp) => {
            loading.dismiss();
            this.handleRespMessage({
                seq: "STEP->1",
                msg: `Can't SignIn ${signInMethod} : ${errp.message}`,
                message: errp
            });
        });
    }

    public register(): void {
        this.navCtrl.push('RegisterPage');
    }

    public forgotPassword(): void {        
        this.appAlertService.forgotAlertPopup({ description: "Please Contact Your IT Admin" }).subscribe(() => {
            this.navCtrl.pop();
        });
    }
    /* public forgotPassword(): void {
      // console.debug('TODO: Forgot password page ...');
      let loading;
  
      this.alertCtrl.create({
        title: this.translation.translate('M_SIGNIN.FORGOTPASSWORD'),
        // message: this.translation.translate('M_RESETTING_PW.CONTENT'),
        inputs: [{ name: 'email', placeholder: this.translation.translate('M_SIGNUP.EMAIL'), }],
        buttons: [{
          text: this.translation.translate('M_BUTTON.SAVE'),
          handler: data => {
            let inputEmail = data.email;
            // console.log('Send clicked:', inputEmail);
            loading = this.loadingCtrl.create();
            if (StringUtil.isEmptyString(inputEmail)) {
              this.alertCtrl.create({
                title: this.translation.translate('M_SIGNIN.FORGOTPASSWORD'),
                message: this.translation.translate('M_SIGNIN.CORRECT_YOUR_EMAIL'),
              }).present();
              return false;
            } else {
              loading.present();
              if (ValidationUtil.emailValidate(inputEmail) == true) {
                this.authenticationService.forgotPassword(inputEmail).subscribe(respLogin => {
                  // console.log('respLogin:', respLogin);
                  loading && loading.dismiss();
  
                  let msg = '';
                  if (AppConstant.isSuccess(respLogin.STATUS)) { // TODO: Using translation
                    msg = this.translation.translate('M_FORGOT_PWD.SEND_RESET_PWD')
                    msg = msg + ' ' + inputEmail;
                    msg = msg + ' ' + this.translation.translate('M_FORGOT_PWD.SEND_RESET_PWD2');
                  } else {
                    // msg = 'ไม่พบ ' + inputEmail + ' ในระบบ';
                    msg = this.translation.translate('M_ALERT.EMAIL_DOESNT_EXIST');
                  }
  
                  this.alertCtrl.create({
                    title: this.translation.translate('M_SIGNIN.FORGOTPASSWORD'),
                    message: msg,
                    buttons: [this.translation.translate('M_BUTTON.DONE')],
                  }).present();
                }, (error) => {
                  loading && loading.dismiss();
                });
              } else {
                loading && loading.dismiss();
                this.alertCtrl.create({ title: this.translation.translate('M_SIGNIN.FORGOTPASSWORD'), message: this.translation.translate('M_SIGNIN.CORRECT_YOUR_EMAIL') }).present();
                return false;
              }
            }
          }
        }, {
          text: this.translation.translate('M_BUTTON.CANCEL'),
          handler: data => {
            // console.log('Cancel clicked');
          }
        }]
      }).present();
    } */

}
