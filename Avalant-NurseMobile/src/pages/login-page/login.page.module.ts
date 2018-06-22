import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TranslationModule } from 'angular-l10n';
import { IonicPageModule } from 'ionic-angular';

import { LayoutModule } from '../../layout-module/layout.module';
import { LoginPage } from './login.page';

/**
 * Login Page Module
 * 
 * @author NorrapatN
 * @since Fri Dec 01 2017
 */
@NgModule({
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslationModule,
    LayoutModule,
  ],
  declarations: [
    LoginPage,
  ],
  entryComponents: [
    LoginPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPageModule {

}
