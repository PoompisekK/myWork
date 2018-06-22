import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslationModule } from 'angular-l10n';
import { LayoutModule } from '../../layout-module/layout.module';
import { BunditPage } from './bundit.page';

/**
 * @author Bundit.Ng
 * @since  Fri Dec 08 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@NgModule({
  imports: [
    IonicPageModule.forChild(BunditPage),
    TranslationModule,
    LayoutModule,
  ],
  declarations: [
    BunditPage,
  ]
})
export class BunditPageModule {

}
