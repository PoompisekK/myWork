import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TranslationModule } from 'angular-l10n';
import { IonicPageModule } from 'ionic-angular';

import { LayoutModule } from '../../layout-module/layout.module';
import { RegisterPage } from './register.page';

/**
 * Register Page Module
 * 
 * @author NorrapatN
 * @since Fri Dec 01 2017
 */
@NgModule({
  imports: [
    IonicPageModule.forChild(RegisterPage),
    TranslationModule,
    LayoutModule,
  ],
  declarations: [
    RegisterPage,
  ],
  entryComponents: [
    RegisterPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterPageModule {

}
