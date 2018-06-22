import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TranslationModule } from 'angular-l10n';
import { IonicPageModule } from 'ionic-angular';

import { AppBackButtonFabs } from './app-back-btn.fabs';

/**
 * @author Bundit.Ng
 * @since  Tue Sep 05 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@NgModule({
  imports: [
    IonicPageModule.forChild(AppBackButtonFabs),
    TranslationModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppBackButtonFabs,
  ]
})
export class AppBackButtonFabsModule {

}
