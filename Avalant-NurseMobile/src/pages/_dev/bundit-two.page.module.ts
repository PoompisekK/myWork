import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslationModule } from 'angular-l10n';
import { LayoutModule } from '../../layout-module/layout.module';
import { BunditTwoPage } from './bundit-two.page';
/**
 * @author Bundit.Ng
 * @since  Tue Sep 05 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@NgModule({
  imports: [
    IonicPageModule.forChild(BunditTwoPage),
    TranslationModule,
    LayoutModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    BunditTwoPage,
  ]
})
export class BunditTwoPageModule {

}
