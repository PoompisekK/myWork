import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslationModule } from 'angular-l10n';
import { LayoutModule } from '../../layout-module/layout.module';
import { ForgotPwdPage } from './forgot-pwd.page';

/**
 * @author Bundit.Ng
 * @since  Fri Sep 15 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@NgModule({
  imports: [
    IonicPageModule.forChild(ForgotPwdPage),
    TranslationModule,
    LayoutModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    ForgotPwdPage,
  ]
})
export class ForgotPwdPageModule {

}
