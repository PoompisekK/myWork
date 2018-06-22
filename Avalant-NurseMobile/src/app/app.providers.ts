import { APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AppVersion } from '@ionic-native/app-version';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Facebook } from '@ionic-native/facebook';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Geolocation as ionGeolocation } from '@ionic-native/geolocation';
import { GooglePlus } from '@ionic-native/google-plus';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageResizer } from '@ionic-native/image-resizer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';
import { LinkedIn } from '@ionic-native/linkedin';
import { Market } from '@ionic-native/market';
import { Network } from '@ionic-native/network';
import { Push } from '@ionic-native/push';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Transfer } from '@ionic-native/transfer';
import { TranslationService } from 'angular-l10n';
import { IonicErrorHandler } from 'ionic-angular';

import { TestService } from '../pages/_dev/test.service';
import { ImagePickerMockup } from '../services-mockup/image-picker/image-picker-mockup';
import { AddressService } from '../services/address/address.service';
import { AppBridge } from '../services/app-bridge/app-bridge.service';
import { AppServices } from '../services/app-services';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { HCMAuthenticationService } from '../services/authentication/hcm-authentication.service';
import { BrandService } from '../services/brand-service/brand.service';
import { AvaCacheService } from '../services/cache/cache.service';
import { CourseService } from '../services/course/course.service';
import { DMPSocialService } from '../services/dmp-social/dmp-social.service';
import { EAFRestService } from '../services/eaf-rest/eaf-rest.service';
import { HttpService } from '../services/http-services/http.service';
import { initLocalization } from '../services/localization';
import { LocalizationService } from '../services/localization/localization-service';
import { UearnTranslationService } from '../services/localization/uearn-translation.service';
import { MasterDataService } from '../services/master-data/master-data.service';
import { MessengerService } from '../services/messenger/messenger.service';
import { MobileInfoService } from '../services/mobile-service/mobile-info.service';
import { MyOrderService } from '../services/my-order-service/my-order.service';
import { MyRewardService } from '../services/myreward-service/myreward-service';
import { OrganizationService } from '../services/organization/organization.service';
import { OTPVerificationService } from '../services/otp-verification/otp-verification.service';
import { PaymentService } from '../services/payment-services/payment-service';
import { PictureService } from '../services/picture-service/picture.service';
import { ProductService } from '../services/product-service/product.service';
import { SearchService } from '../services/search-services/search.service';
import { ShippingService } from '../services/shipping-services/shipping.service';
import { StoreService } from '../services/store/store.service';
import { StreamFeedService } from '../services/stream-feed/stream-feed.service';
import { UserProfileService } from '../services/userprofile/userprofile.service';
import { ValidationUtil } from '../utilities/validation.util';
import { AppAlertService } from '../workforce/service/appAlertService';
import { CalendarService } from '../workforce/service/calendarService';
import { AppState } from './app.state';
import { HCMUserProfileRestService } from '../services/userprofile/hcm-userprofile.service';
import { HCMEAFRestService } from '../services/eaf-rest/hcm-eaf-rest.service';
import { HCMShiftRestService } from '../services/userprofile/hcm-shift.service';
import { HCMApprovalRestService } from '../services/userprofile/hcm-approval.service';

// let providers = {
//   "google": {
//     "clientId": "226197184145-ee4nlfqdpu42uaj0tediachb1kgeep2q.apps.googleusercontent.com"
//   },
//   "linkedin": {
//     // "clientId": "819qlhj1ctkv8s" // Web
//     "clientId": "81248rgxyd0xns" // Mobile
//   },
//   "facebook": {
//     // "clientId": "103793800184117",//Uearn-Web (*.dmp.com)
//     // "apiVersion": "v2.8" //like v2.4 
//     "clientId": "1627901700857050",//Uearn-Mobile (localhost)
//     "apiVersion": "v2.9"
//   }
// };

// Angular2SocialLoginModule.loadProvidersScripts(providers);
/**
 * Mockup services provider list
 * 
 * Use for Web browser Development only
 */
export const APP_MOCKUP_SERVICE_PROVIDERS = {
  providers: [
    {
      provide: ImagePicker,
      useClass: ImagePickerMockup,
    },
  ]
};

// if (!isWebDev()) {
APP_MOCKUP_SERVICE_PROVIDERS.providers = [];
// }

/**
 * Application Providers
 * 
 * @author NorrapatN
 * @since Thu May 18 2017
 */
export const APP_PROVIDERS: any[] = [
  AppState,
  Deeplinks,
  EAFRestService,
  HCMEAFRestService,
  HttpService,
  InAppBrowser,
  Keyboard,
  Push,
  SplashScreen,
  StatusBar,
  StreamFeedService,
  {
    provide: ErrorHandler,
    useClass: IonicErrorHandler
  },

  // Localization
  LocalizationService,
  {
    provide: APP_INITIALIZER,
    useFactory: initLocalization,
    deps: [LocalizationService],
    multi: true
  },

  // Custom Translation Provider
  {
    provide: TranslationService,
    useClass: UearnTranslationService,
  },

  AddressService,
  AndroidPermissions,
  AppAlertService,
  AppBridge,
  AppServices,
  AppVersion,
  AuthenticationService,
  HCMAuthenticationService,
  AvaCacheService,
  BrandService,
  CalendarService,
  Camera,
  CourseService,
  Crop,
  Device,
  Diagnostic,
  DMPSocialService,
  Facebook,
  File,
  FilePath,
  GooglePlus,
  ImagePicker,
  ImageResizer,
  ionGeolocation,
  LinkedIn,
  Market,
  MasterDataService,
  MessengerService,
  MobileInfoService,
  MyOrderService,
  MyRewardService,
  Network,
  OrganizationService,
  OTPVerificationService,
  PaymentService,
  PictureService,
  ProductService,
  ScreenOrientation,
  SearchService,
  ShippingService,
  StoreService,
  TestService,
  Transfer,
  UserProfileService,
  HCMUserProfileRestService,
  HCMApprovalRestService,
  HCMShiftRestService,
  ValidationUtil,
]; 
