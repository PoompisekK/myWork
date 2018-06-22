import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TabPage } from './tab.page';
import { IonicPageModule } from 'ionic-angular';
import { TranslationModule } from 'angular-l10n';
import { LayoutModule } from '../../layout-module/layout.module';
import { SuperTabsModule } from 'ionic2-super-tabs';

const TAB_PAGES = [
  TabPage
];

/**
 * Tab Page Module
 * 
 * @author NorrapatN
 * @since Thu Aug 03 2017
 */
@NgModule({
  imports: [
    IonicPageModule.forChild(TabPage),
    TranslationModule,
    LayoutModule,
    SuperTabsModule,
  ],
  declarations: [
    ...TAB_PAGES,
  ],
  entryComponents: [
    ...TAB_PAGES,
  ],
  providers: [],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TabPageModule {

}
