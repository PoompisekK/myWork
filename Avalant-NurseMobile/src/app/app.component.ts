import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AppVersion } from '@ionic-native/app-version';
import { Device } from '@ionic-native/device';
import { Keyboard } from '@ionic-native/keyboard';
import { Network } from '@ionic-native/network';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslationService } from 'angular-l10n';
import {
    AlertController,
    App,
    LoadingController,
    MenuController,
    ModalCmp,
    Nav,
    Platform,
    ToastController,
} from 'ionic-angular';
import { CacheService } from 'ionic-cache';
import { LocalStorageService } from 'ngx-Webstorage';

import { AnimateCss } from '../animations/animate-store';
import { AppConstant } from '../constants/app-constant';
import { EAFRestApi } from '../constants/eaf-rest-api';
import { isChromeDev, isDev } from '../constants/environment';
import { HCMRestApi } from '../constants/hcm-rest-api';
import { UearnFabsController } from '../layout-module/components/fabs/fabs.controller';
import { UserModel } from '../model/user/user.model';
import { BunditTwoPage } from '../pages/_dev/bundit-two.page';
import { BunditPage } from '../pages/_dev/bundit.page';
import { NinePage } from '../pages/_dev/nine.page';
import { NoreTestPage } from '../pages/_dev/nore.page';
import { LoginPage } from '../pages/login-page/login.page';
import { RegisterPage } from '../pages/register-page/register.page';
import { SettingsPage } from '../pages/settings-page/settings.page';
import { AppLoadingService } from '../services/app-loading-service/app-loading.service';
import { AppServices } from '../services/app-services';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { EAFRestService } from '../services/eaf-rest/eaf-rest.service';
import { LocalizationService } from '../services/localization/localization-service';
import { MobileInfoService } from '../services/mobile-service/mobile-info.service';
import { PictureService } from '../services/picture-service/picture.service';
import { ShippingService } from '../services/shipping-services/shipping.service';
import { LeaveSummaryPage } from '../workforce/pages/user-profile-detail/leave-summary-page/leave-summary-page';
import { UserProfileDetailPage } from '../workforce/pages/user-profile-detail/user-profile-detail';
import { WorkForceHomePage } from '../workforce/pages/workforce-home/workforce-home.page';
import { AssignmentService } from '../workforce/service/assignmentService';
import { WorkforceHttpService } from '../workforce/service/workforceHttpService';
import { WorkforceService } from '../workforce/service/workforceService';
import { AppState } from './app.state';
import { Page } from './page';
import { ApproveTabPage } from '../workforce/pages/approve-tabs-page/approve-tabs-page';

// import { Push, PushToken } from '@ionic/cloud-angular';
import { HCMEAFRestService } from '../services/eaf-rest/hcm-eaf-rest.service';
import { HCMUserProfileRestService } from '../services/userprofile/hcm-userprofile.service';
@Component({
    templateUrl: 'app.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class MyApp {

    public static readonly DEFAULT_PAGE = WorkForceHomePage;

    @ViewChild(Nav) public navCtrl: Nav;

    public rootPage: any = MyApp.DEFAULT_PAGE;

    private currAppLang: string = null;

    private pages: Array<Page>;

    // private isBackPressed: boolean = false;
    private activeSubMenu = false;

	/**
	 * Use to allow closing app
	 */
    // private allowClose: boolean = false;

    constructor(
        private alertCtrl: AlertController,
        private app: App,
        private appLoadingService: AppLoadingService,
        private appPermission: AndroidPermissions,
        private appServices: AppServices,
        private appState: AppState,
        private appVersion: AppVersion,
        private assignmentService: AssignmentService,
        private authenService: AuthenticationService,
        private device: Device,
        private eafRestService: EAFRestService,
        private fabCtrl: UearnFabsController,
        private ionicCache: CacheService,
        private keyboard: Keyboard,
        private loadingCtrl: LoadingController,
        private localizationService: LocalizationService,
        private localStorage: LocalStorageService,
        private menuCtrl: MenuController,
        private mobileInfoService: MobileInfoService,
        private network: Network,
        private pictureService: PictureService,
        private platform: Platform,
        private push: Push,
        private sanitizer: DomSanitizer,
        private screenOrientation: ScreenOrientation,
        private shippingService: ShippingService,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private toastCtrl: ToastController,
        private translationService: TranslationService,
        private wfHttpService: WorkforceHttpService,
        private hcmUserProfileService: HCMUserProfileRestService,
        private workforceService: WorkforceService,
    ) {
        this.currAppLang = this.appState.language;
        this.initialDataTypeInterface();

        if (isChromeDev()) {
            let empCode = this.localStorage.retrieve(AppConstant.LOCAL_STORAGE_KEY.EMPLOYEE_CODE);
            this.localStorage.observe(AppConstant.LOCAL_STORAGE_KEY.EMPLOYEE_CODE).subscribe((newValue) => {
                console.log("localStorage => " + AppConstant.LOCAL_STORAGE_KEY.EMPLOYEE_CODE + " oldValue is:", empCode);
                console.log("localStorage => " + AppConstant.LOCAL_STORAGE_KEY.EMPLOYEE_CODE + " newValue is:", newValue);
            });
        }

        this.localizationService.setLanguageSync(this.localizationService.getLastDisplayAppLanguage() || "en");
        this.app.setElementClass('nurse-mobile', true);

        this.app.setTitle("DMP Platform Organization");
        this.ionicCache.setDefaultTTL(60 * 60); //set default cache Time To Life for 1 hour
        this.initializeApp();

		/*
		 * Differnce menu item between logged in or not
		 */

        // Pages component that use to show on Sidebar menu
        this.pages = this.generateAppMenu();
        this.addAppVersionMenu();

        this.displayServerMsg();

        // Set Portrait
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).catch(error => {
            isDev() && console.warn(error);
        });

        isDev() && console.info(`😃 UEARN Mobile is running on ${ENV.IONIC_ENV} environment.`);
        this.platform.pause.subscribe(() => {
            isDev() && console.debug("App is paused");
        });
        this.platform.resume.subscribe(() => {
            isDev() && console.debug("App is resume");
            // this.displayServerMsg();
            // this.getRequireAppPermission();
        });

        this.platform.ready().then(() => {
            this.getRequireAppPermission();
        }).then(() => {
            this.pressTwiceBackButtonToExit();
        });
    }

    private generateAppMenu(): Page[] {
        return [
            {
                title: 'M_SIDEMENU.HOME',
                iconName: 'md-home',
                component: MyApp.DEFAULT_PAGE,
                usePush: false,
                useAuth: false,
            }, {
                title: 'M_SIDEMENU.SIGNIN',
                iconName: 'ios-log-in-outline',
                component: LoginPage,
                usePush: true,
                useAuth: true,
                condition: ((page, isLoggedIn) => !isLoggedIn)
            },
            {
                title: 'M_SIDEMENU.SIGNUP',
                iconName: 'ios-create-outline',
                component: RegisterPage,
                useAuth: true,
                usePush: false,
                condition: ((page, isLoggedIn) => !isLoggedIn)
            },
            { title: 'M_SIDEMENU.MY_PROFILE', iconName: 'ios-person', component: UserProfileDetailPage, useAuth: true },

            // { title: 'M_SIDEMENU.MY_ORDER', component: 'MyOrderPage', useAuth: true },
            // { title: 'M_SIDEMENU.MY_REWARD', component: 'RewardPage', useAuth: true },
            // { title: 'M_SIDEMENU.PAYMENT_TRANSACTION', component: 'HistoryPage', useAuth: true, condition: isDev() },

            { title: 'Nore Test Page', component: NoreTestPage, useAuth: true, condition: isDev() },
            { title: 'Bundit Test Page', component: BunditPage, usePush: true, useAuth: true, condition: isDev() },
            { title: 'Bundit Two Page', component: BunditTwoPage, usePush: true, useAuth: true, condition: isDev() },
            { title: "9's test page", component: NinePage, useAuth: true, condition: isDev() },
            // { title: 'M_SIDEMENU.CHANGE_PASSWORD', component: null, onSelect: null, useAuth: true },
            // { title: 'M_SIDEMENU.CONTACTUS', component: 'ContactPage', usePush: true },
            { title: 'M_MENU.CHANGELANGUAGE', iconName: 'ios-settings', component: SettingsPage, usePush: true },
            // { title: 'M_SIDEMENU.HELP', component: 'HelpPage', usePush: true },
            { title: 'M_SIDEMENU.SIGN_OUT', iconName: 'ios-log-out-outline', component: null, onSelect: this.confirmLogout, useAuth: true },
        ];
    }

    private displayServerMsg(): void {
        isDev() && console.log("---displayServerMsg----");
        this.platform.ready().then(() => {
            isDev() && console.log("---ready then displayServerMsg----");
            this.appServices.displayServerMsg();
        });
    }

    private addAppVersionMenu(): void {

        const style = 'background-color:#FFFF33';
        const style2 = 'background-color:#CE5C0A;color:white;';
        const seperater = '--------------------------------------------------------------------------------------------';
        console.info("%c" + seperater, style);
        const appVerNo = "Ver. " + AppConstant.APP_VERSION;
        console.info("%cRunning App.Version:", style, appVerNo);
        console.info("%c" + seperater, style);
        console.info("%cEndpoint EAF:" + EAFRestApi.URL, style2);
        console.info("%cEndpoint MASTERWEB:" + EAFRestApi.MASTER_URL, style2);
        console.info("%cEndpoint HCM Api:" + HCMRestApi.URL, style2);

        const appItm: Page = { title: null, messages: appVerNo, component: null, isDisabled: true };
        this.pages.push(appItm);
    }

    private isShowBack: boolean = false;

    public goBack(): void {
        this.navCtrl.canGoBack() && this.navCtrl.pop().then(() => {
            this.initializeCanGoBack();
        });
    }

    private initializeCanGoBack(): void {
        isDev() && console.log("this.isShowBack :", this.isShowBack);
        isDev() && console.log("this.nav.canGoBack() :", this.navCtrl.canGoBack());
        this.isShowBack = this.navCtrl && this.navCtrl.canGoBack();
    }
    private initializeApp(): void {
        this.appServices.subscribe(AppConstant.EVENTS_SUBSCRIBE.RELOAD_IMAGE_PROFILE, (empCodeId: string) => {
            this.sanitizedImageUser = null;
            this.rawImageUser = HCMRestApi.getHCMImageUrl(empCodeId);
            this.sanitizedImageUser = this.sanitizer.bypassSecurityTrustStyle("url('" + this.rawImageUser + "')");
        });
        this.appServices.subscribe("NEED_LOGIN", () => {
            this.navCtrl.push(LoginPage);
        });
        this.platform.ready().then(() => {

            this.app.viewDidEnter.subscribe(viewCtrl => {
                if (viewCtrl.name == ModalCmp.name) {
                    try {
                        const viewComp = viewCtrl.instance.navParams && viewCtrl.instance.navParams.data && viewCtrl.instance.navParams.data.component;
                        console.log('Entering %cModalCmp %cwith viewCtrl : %c' + (viewComp && viewComp.name || viewComp), ...["color:blue", "color:black", "color:red"]);
                    } catch (error) {
                        console.log('Entering viewCtrl : %c' + (viewCtrl && viewCtrl.name || viewCtrl), "color:blue");
                        console.warn("error :", error);
                    }
                } else {
                    console.log('Entering viewCtrl : %c' + (viewCtrl && viewCtrl.name || viewCtrl), "color:blue");
                }
            });

            this.app.viewWillEnter.subscribe(viewCtrl => {
                this.initializeCanGoBack();
            });
            this.navCtrl.viewWillEnter.subscribe((event) => {
                this.initializeCanGoBack();
            });

            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.

            /* this.statusBar.overlaysWebView(true); */
            this.statusBar.styleDefault();

            // Delay to wait page loaded
            setTimeout(() => {
                this.splashScreen.hide();
            }, 300);

            this.fabCtrl.hide();

            // Subscribe to NavController
            isDev() && this.navCtrl.viewWillEnter.subscribe((event) => {
                isDev() && console.info('%c👉 Component Page :', 'background:#FEFBE6;color:red', event.name);
                event.data && isDev() && console.info('👉 Params Data :', event.data);

                // let employeeCode = this.localStorage.retrieve(AppConstant.LOCAL_STORAGE_KEY.EMPLOYEE_CODE);
                // isDev() && console.info("tracking employeeCode:", employeeCode);
                // isDev() && console.info('👉 Event :', event);
                // isDev() && console.log("getCurrentLanguage this.appState.language:", this.appState.language);
            }, error => {
                isDev() && console.warn('Error => ', error);
            });

            this.keyboard.disableScroll(false);
            this.keyboard.hideKeyboardAccessoryBar(false);
            this.keyboard.onKeyboardShow().subscribe((data) => {
                isDev() && console.debug('Keyboard show : ', data);
            }, error => {
                isDev() && console.warn('Error => ', error);
            });

            const disconnectSub = this.network.onDisconnect().subscribe(() => {
                this.isNetworkAvaliable = false;
            });

            const connectSub = this.network.onConnect().subscribe(() => {
                this.isNetworkAvaliable = true;
            });

            if (!document.URL.startsWith('http')) {
                this.push.hasPermission()
                    .then((res: any) => {
                        console.log("res:", res);
                        if (res && res.isEnabled) {
                            console.log('We have permission to send push notifications');
                        } else {
                            console.log('We do not have permission to send push notifications');
                        }
                    });
                const options: PushOptions = {
                    android: {
                        senderID: '697370751997'
                    },
                    ios: {
                        alert: 'true',
                        badge: true,
                        sound: 'false'
                    },
                    windows: {},
                    browser: {
                        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
                    }
                };
                const pushObject: PushObject = this.push.init(options);

                pushObject.on('registration').subscribe((registration: any) => {
                    console.log('Device registered :', registration);

                    this.appState.mobileInfo.authenType = "mobile";
                    if (this.appState.businessUser) {
                        this.appState.mobileInfo.businessUserId = this.appState.businessUser.id;
                    } else {
                        this.appState.mobileInfo.businessUserId = "0";
                    }
                    this.appState.mobileInfo.createBy = "System";
                    this.appState.mobileInfo.createDate = new Date();
                    this.appState.mobileInfo.currentVersion = AppConstant.APP_VERSION;
                    this.appState.mobileInfo.deviceUuid = this.device.uuid;
                    this.appState.mobileInfo.mobilePlatform = this.platform.platforms().join(', ');
                    this.appState.mobileInfo.mobileVersion = "";
                    this.appState.mobileInfo.updateBy = "";
                    this.appState.mobileInfo.updateDate = null;
                    this.appState.mobileInfo.pushNotificationToken = registration.registrationId;
                    this.appVersion.getPackageName().then(resp => {
                        this.appState.mobileInfo.mobileAppCode = resp;
                        console.log('mobileInfo => ', this.appState.mobileInfo);
                        this.mobileInfoService.saveMobileInformation(this.appState.mobileInfo).subscribe(resp => {
                            console.log("save mobile info resp => ", resp);
                        }, error => {
                            console.warn("error save mobile info => ", error);
                        });
                    });
                });

                pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

                pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
            }
        });
    }

    private isNetworkAvaliable: boolean = true;

    private userImageFile: any[] = [];
    private getAttachments() {
        let inputFileField = document.getElementById("userImageFileInputId");
        let filesList = [];
        if (inputFileField != null) {
            filesList = inputFileField['files'];
        }
        if (filesList.length > 0) {
            const fileItem = filesList[0];
            const pathFile = this.workforceService.getFilePath(fileItem);
            console.log("pathFile :", pathFile);

            this.appLoadingService.showLoading(this.translationService.translate('M_USERPROFILE.UPDATING_PROFILE') + '...');
            try {
                let _targetUrl = EAFRestApi.URL_UPLOAD;
                let formData: any = new FormData();
                let xmlHttpRequest = new XMLHttpRequest();
                xmlHttpRequest.open("POST", _targetUrl, true);

                xmlHttpRequest.setRequestHeader("clientId", this.eafRestService.eafSession.clientId);
                xmlHttpRequest.setRequestHeader("authorization", this.eafRestService.eafSession.idToken || this.eafRestService.eafSession.id_token);

                let fileName = fileItem.name || '';
                xmlHttpRequest.setRequestHeader('Content-Disposition', 'form-data; name="file" filename="' + fileName + '"');
                console.log("fileObj:", fileItem);
                formData.append("file", fileItem, fileName);

                for (var pair of formData.entries()) {
                    console.log(`FormData :'${pair[0]}'`, pair[1]);
                }
                xmlHttpRequest.onloadend = () => {
                    const respJson = JSON.parse(xmlHttpRequest.response);
                    console.log("xmlHttpRequest.onloadend :", respJson.data);
                    this.assignmentService.hcmUploadProfileImage([fileItem], "UserImageProfiles").subscribe((resp) => {
                        console.log("hcmUploadProfileImage :", resp);
                        this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.RELOAD_IMAGE_PROFILE, this.appState.businessUser && this.appState.businessUser.employeeCode);
                        this.hideLoading(() => { });
                    });
                };
                xmlHttpRequest.send(formData);
            } catch (error) {
                console.error("xmlHttpRequest.error :", error);
                this.hideLoading();
            }
        }
    }

    private rawImageUser = HCMRestApi.getHCMImageUrl(this.appState.businessUser && (this.appState.businessUser.employeeCode || this.appState.businessUser.userCode));
    private sanitizedImageUser = this.sanitizer.bypassSecurityTrustStyle("url('" + this.rawImageUser + "')");

    private getReLoadUserProfileImage(): void {
        this.rawImageUser = HCMRestApi.getHCMImageUrl(this.appState.businessUser && (this.appState.businessUser.employeeCode || this.appState.businessUser.userCode));
        this.sanitizedImageUser = this.sanitizer.bypassSecurityTrustStyle("url('" + this.rawImageUser + "')");
    }

    public uploadUserProfileImage(): void {
        console.log("uploadUserProfileImage click !!!");
        if (this.appServices.isServeChrome()) {
            let fileElem = document.getElementById('userImageFileInputId');
            console.log("fileElem :", fileElem);
            fileElem && fileElem.click();
        } else {
            this.pictureService.requestPicture((imagePath) => {
                this.appLoadingService.showLoading(this.translationService.translate('M_USERPROFILE.UPDATING_PROFILE') + '...');
                this.eafRestService.uploadFileV2(imagePath).subscribe((uploadResponse) => {
                    this.pictureService.getFileDirectory(imagePath).subscribe(fileItem => {
                        console.log("getFileDirectory fileItem:", fileItem);
                        this.assignmentService.hcmUploadProfileImage([fileItem], "UserImageProfiles").subscribe((resp) => {
                            console.log("hcmUploadProfileImage :", resp);
                            this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.RELOAD_IMAGE_PROFILE, this.appState.businessUser && this.appState.businessUser.employeeCode);
                            this.hideLoading(() => { });
                        });
                    });
                });
            });
        }
    }

    private hideLoading(cb?: () => void) {
        this.appLoadingService.hideLoading().then(() => {
            cb && cb();
        });
    }

	/*  private initialDeeplinks(): void {
	   this.deeplinks.routeWithNavController(this.nav, {
		 '/test/nore': NoreTestPage,
		 '/brands': BrandPage,
		 '/brands/:organizationId': OrganizationPage,
		 '/cart': CartPage,
	   });
	 } */

    public isMenuShow(page: Page): boolean {
        // let isLoggedIn = this.authenService.isLoggedIn;
        let isLoggedIn = this.appState.isLoggedIn;
        if (page && page.useAuth) {

            let customCondition: Function | boolean = page.condition;
            if (typeof customCondition === 'function') {
                return customCondition(page, isLoggedIn);
            } else if (typeof customCondition === 'boolean') {
                return customCondition;
            }
            return isLoggedIn;
        } else {
            // Default is show page menu
            return true;
        }
    }

    private confirmLogout(): void {
        // Create a prompt with options
        let logOutConfirm = this.alertCtrl.create({
            title: this.translationService.translate('M_CONFIRMATION.SIGN_OUT'),
            //message: '',
            buttons: [{
                text: this.translationService.translate('M_BUTTON.CANCEL')
            }, {
                text: this.translationService.translate('M_BUTTON.CONFIRM'),
                handler: () => { // Button action
                    this.logout();
                }
            }]
        });
        logOutConfirm.present(); // show up
    }

	/**
	 * Open page
	 * @param page Page component
	 */
    private openPage(page: Page, state: string, $event): void {
        isDev() && console.log(event.currentTarget);
        isDev() && console.log("Click :", page.title + "&&" + state);
        // TODO: Fix this submenu logic
        if (page.title == "M_SIDEMENU.MY_REWARD" && state == "main") {
            this.activeSubMenu = !this.activeSubMenu;
        } else {
            this.activeSubMenu = false;
            this.menuCtrl.close();
            // Test if it have callback
            if (page.onSelect) {
                // Check a type
                if (typeof page.onSelect === 'function') {
                    // Call a callback with context
                    page.onSelect.call(this);
                } else {
                    isDev() && console.warn("🖐 Page's callback is not a function. Skipped !");
                }
            }

            // When component is missing
            if (!page.component) {
                // Do something when component is null ?
                return;
            }
            if (page.title == "M_SIDEMENU.MY_REWARD") {
                this.activeSubMenu = true;
            }
            if (page.usePush) {
                // This will push a page component on Navigation stack
                this.navCtrl.push(page.component, page.params);
            } else {
                // Reset the content nav to have just this page
                // we wouldn't want the back button to show in this scenario
                this.navCtrl.setRoot(page.component, page.params);
            }
        }
    }

    private resetPwdDialog;

	/**
	 * Logout process
	 */
    private logout(): void {
        // Create loading instance
        let loading = this.loadingCtrl.create({
            content: this.translationService.translate('M_SIGNIN.SIGN_OUT_WORKING')
        });
        this.authenService.logout().subscribe(() => {
            loading.present(); // show up
            // Simulate delay
            setTimeout(() => {
                this.localizationService.setLanguage('en');

                this.appState.shippingList = [];

                this.appState.businessUser = null;

                this.wfHttpService.HCMUserAuth = null;
                this.wfHttpService.HCMAccessToken = null;

                this.wfHttpService.employeeCode = null;
                this.wfHttpService.businessUser = new UserModel();

                this.hcmUserProfileService.HCMUserProfileData = null;
                this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.RELOAD_IMAGE_PROFILE, this.appState.businessUser && this.appState.businessUser.employeeCode);

                this.shippingService.personalInfo = null;
                this.localizationService.manualChangeWithOutLogin = false;

                this.appState.mobileInfo.businessUserId = "";

                this.mobileInfoService.saveMobileInformation(this.appState.mobileInfo);

                this.navCtrl.setRoot(MyApp.DEFAULT_PAGE, null, {
                    animate: true
                });
                loading.dismiss();
            }, 550);
            // Remove signed-in class from element too.
            const appElement: HTMLElement = this.app._appRoot.getNativeElement();
            appElement.classList.remove('signed-in');
        }, error => {
            isChromeDev() && console.warn('Error => ', error);
        });
    }

    private getRequireAppPermission(): any {
        if (!this.appServices.isServeChrome()) {
            isDev() && console.log("----Requiring AppPermission----");
            let permsList = [
                this.appPermission.PERMISSION.ACCESS_COARSE_LOCATION,
                this.appPermission.PERMISSION.ACCESS_FINE_LOCATION,
                this.appPermission.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS,
                this.appPermission.PERMISSION.ACCESS_NETWORK_STATE,
                this.appPermission.PERMISSION.CAMERA,
                this.appPermission.PERMISSION.GET_ACCOUNTS,
                this.appPermission.PERMISSION.READ_EXTERNAL_STORAGE,
                this.appPermission.PERMISSION.USE_CREDENTIALS,
                this.appPermission.PERMISSION.VIBRATE,
                this.appPermission.PERMISSION.WAKE_LOCK,
                this.appPermission.PERMISSION.WRITE_EXTERNAL_STORAGE,
            ];
            this.appPermission.requestPermissions(permsList)
                .then((resp) => {
                    isDev() && console.log("requestPermissions resp :", resp);
                }).catch((errMsg) => {
                    isDev() && console.error("requestPermissions errMsg :", errMsg);
                });
        } else {
            isDev() && console.warn("----Skip Requiring AppPermission----");
        }
    }

	/**
	 * 
	 * @param isOpen 
	 */
    private statusBarToggle(isOpen: boolean): void {
        isDev() && console.log("statusBarToggle isOpen:", isOpen);

        // if (isOpen) {
        //   this.statusBar.show();
        // } else {
        //   this.statusBar.hide();
        // }
    }

    public pressTwiceBackButtonToExit() {
        console.log("Register \"pressTwiceBackButtonToExit\"");
        let waitting: number = 2000;//wait for exit app
        let again2exit: boolean = false;
        this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(() => {
                if (this.appLoadingService.isShowing()) {
                    this.appLoadingService.hideLoading();
                } else if (this.menuCtrl.isOpen()) {
                    this.menuCtrl.close();
                } else if (this.navCtrl.canGoBack()) {
                    this.navCtrl.pop();
                } else {
                    if (!again2exit) {
                        const toast = this.toastCtrl.create({
                            message: 'Press the back button twice to exit.',
                            duration: waitting,
                            dismissOnPageChange: true,
                            position: 'bottom'
                        });
                        toast.present();
                        again2exit = true;
                        console.log("will App !!!");
                        setTimeout(() => {
                            again2exit = false;
                            console.log("exit flag clear !!!");
                        }, waitting);
                    } else {
                        console.log("Exit App !!!");
                        this.platform.exitApp();
                    }
                }
            });
        });
    }

    /*********** Con-create function array interface ***********/
    private initialDataTypeInterface() {

        // check if an element exists in array using a comparer function
        // comparer : function(currentElement)
        Array.prototype.inArray = function (comparer) {
            for (let i = 0; i < this.length; i++) {
                if (comparer(this[i])) return true;
            }
            return false;
        };

        // adds an element to the array if it does not already exist using a comparer 
        // function
        Array.prototype.pushIfNotExist = function (element, comparer) {
            if (!this.inArray(comparer)) {
                this.push(element);
            }
        };
        Array.prototype.merge = function (_newArr) {
            for (let i = 0; i < (_newArr || []).length; i++) {
                let elmVal = _newArr[i];
                this.pushIfNotExist(elmVal, (elmItm) => {
                    return elmVal === elmItm;
                });
            }
            return this;
        };
        /*********** Con-create function array interface ***********/

        String.prototype.equals = function (string) {
            return this.toString() == string;
        };

        String.prototype.equalsIgnoreCase = function (string) {
            return (this || '').toString().toLowerCase() == (string || '').toLowerCase();
        };
    }
}
