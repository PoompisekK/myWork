import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OrganizationHomePage } from './organization-home.page';
import { IonicPageModule } from 'ionic-angular';
import { TranslationModule } from 'angular-l10n';
import { LayoutModule } from '../../layout-module/layout.module';

const ORG_HOME_PAGES = [
  OrganizationHomePage,
];

/**
 * Organization Home Page Module
 * 
 * @author NorrapatN
 * @since Fri Jul 14 2017
 */
@NgModule({
  imports: [
    IonicPageModule.forChild(OrganizationHomePage),
    TranslationModule,
    LayoutModule,
  ],
  declarations: [
    ...ORG_HOME_PAGES,
  ],
  entryComponents: [
    ...ORG_HOME_PAGES,
  ],
  providers: [],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrganizationHomePageModule {

}
