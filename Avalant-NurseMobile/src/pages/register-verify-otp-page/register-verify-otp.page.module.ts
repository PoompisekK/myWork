import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslationModule } from 'angular-l10n';
import { LayoutModule } from '../../layout-module/layout.module';
import { RegisterVerifyOTPPage } from './register-verify-otp.page';
import { RegisterRequestOTPPage } from '../register-request-otp-page/register-request-otp.page';
/**
 * @author Bundit.Ng
 * @since  Tue Sep 05 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@NgModule({
  imports: [
    IonicPageModule.forChild(RegisterVerifyOTPPage),
    TranslationModule,
    LayoutModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    RegisterVerifyOTPPage,
  ]
})
export class RegisterVerifyOTPPageModule {

}
