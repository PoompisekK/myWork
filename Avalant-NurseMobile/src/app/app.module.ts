import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationModule } from 'angular-l10n';
import { QRCodeModule } from 'angular2-qrcode';
import { IonicApp, IonicModule } from 'ionic-angular';
import { CacheModule } from 'ionic-cache';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { OrderModule } from 'ngx-order-pipe';
import { Ng2Webstorage } from 'ngx-Webstorage';

import { IONIC_ENV } from '../constants/environment';
import { EAFContext } from '../eaf/eaf-context';
import { LayoutModule } from '../layout-module/layout.module';
import { BunditTwoPageModule } from '../pages/_dev/bundit-two.page.module';
import { BunditPageModule } from '../pages/_dev/bundit.page.module';
import { ForgotPwdPageModule } from '../pages/forgot-pwd-page/forgot-pwd.page.module';
import { ForgotPwdVerifyOtpPageModule } from '../pages/forgot-pwd-verify-otp-page/forgot-pwd-verify-otp.page.module';
import { LoginPageModule } from '../pages/login-page/login.page.module';
import { NotificationPageModule } from '../pages/notification-page/notification.page.module';
import { PlacePageModule } from '../pages/place-page/place.page.module';
import { RegisterPageModule } from '../pages/register-page/register.page.module';
import { RegisterRequestOTPPageModule } from '../pages/register-request-otp-page/register-request-otp.page.module';
import { RegisterVerifyOTPPageModule } from '../pages/register-verify-otp-page/register-verify-otp.page.module';
import { WorkforceModule } from '../workforce/pages/workforce-home/workforce-home.page.module';
import { LoadImgModule } from '../workforce/pipe/loadImgPipe.module';
import { MyApp } from './app.component';
import { APP_DECLARATIONS, APP_ENTRY_COMPONENTS } from './app.declarations';
import { APP_PROVIDERS } from './app.providers';
import { UearnTranslationProvider } from '../services/localization/uearn-translation.provider';
import { HCMTranslationProvider } from '../workforce/modules/hcm-translation.provider';

@NgModule({
  declarations: [
    ...APP_DECLARATIONS
  ],
  imports: [
    LoginPageModule,
    RegisterPageModule,
    NotificationPageModule,
    LoadImgModule,
    IonicImageViewerModule,
    WorkforceModule.forRoot(),
    CurrencyMaskModule,
    BrowserAnimationsModule,
    QRCodeModule,
    PlacePageModule,
    BrowserModule,
    JsonpModule,
    CacheModule.forRoot(),
    HttpModule,
    SuperTabsModule.forRoot(),
    TranslationModule.forRoot({
      // translationProvider: UearnTranslationProvider,
      translationProvider: HCMTranslationProvider,
    }),
    Ng2Webstorage.forRoot({
      /** 
       * ISSUE :  Can't use prefix right now. 
       * @see https://github.com/PillowPillow/ng2-webstorage/issues/55
       */
      // prefix: 'DMPMobile',
      // separator: '.',
      // caseSensitive: true
    }),
    LayoutModule.forRoot(),
    BunditPageModule,
    BunditTwoPageModule,
    ForgotPwdPageModule,
    ForgotPwdVerifyOtpPageModule,
    RegisterRequestOTPPageModule,
    RegisterVerifyOTPPageModule,
    // IonicModule.forRoot(MyApp),
    IonicModule.forRoot(MyApp, {
      // scrollAssist: false,
      // autoFocusAssist: false,
      // mode: 'md', // Force use Material Design (Effect to iOS device)
      tabsPlacement: 'top',
      // statusbarPadding: true,
      platforms: {
        ios: {
          backButtonText: '',
          // statusbarPadding: true,
        },
        android: {
          // statusbarPadding: true,
        },
      },
    }),
    OrderModule,
  ],
  exports: [
    TranslationModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    ...APP_ENTRY_COMPONENTS
  ],
  providers: [
    ...APP_PROVIDERS,
    // ...APP_MOCKUP_SERVICE_PROVIDERS.providers,
  ],
  bootstrap: [IonicApp]
})
export class AppModule {

  constructor() {
    if (IONIC_ENV == 'dev') {
      setTimeout(() => {
        this.logAllEAFModules();
        console.info(` 😉 Table of EAF Module will show only DEV environment !`);
        console.info(` 👉 Type "eaflist" (w/o quote) to show.`);
      }, 1000);
      Object.defineProperty(window, 'eaflist', {
        get: () => {
          this.logAllEAFModules(true);
        }
      });
    }
  }

  private logAllEAFModules(show?: boolean): void {
    let title: string = ` 👉 [EAF Module List] (${EAFContext.EAF_MODULE_LIST.length}) `;
    if (show) {
      console.group(title);
    } else {
      console.groupCollapsed(title);
    }
    console.debug(`EAF : There are ${EAFContext.EAF_MODULE_LIST.length} Entity's Module(s) in application.`);
    console.table(EAFContext.EAF_MODULE_LIST);
    console.groupEnd();
    console.info(` 👉 Type "eaflist" (w/o quote) to show this again.`);
  }

}
