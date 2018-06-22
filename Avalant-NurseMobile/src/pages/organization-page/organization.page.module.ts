import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslationModule } from 'angular-l10n';
import { IonicPageModule } from 'ionic-angular';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { LayoutModule } from '../../layout-module/layout.module';
import { OrganizationPage } from './organization.page';
import { OrganizationHeader } from './organization-header/organization-header';

const ORG_PAGES = [
  OrganizationPage,
];

/**
 * Organization Page Module
 * 
 * @author NorrapatN
 * @since Fri Jul 14 2017
 */
@NgModule({
  imports: [
    IonicPageModule.forChild(OrganizationPage),
    TranslationModule,
    LayoutModule,
    SuperTabsModule,
  ],
  declarations: [
    ...ORG_PAGES,
    OrganizationHeader,
  ],
  entryComponents: [
    ...ORG_PAGES,
  ],
  providers: [],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrganizationPageModule {

}
