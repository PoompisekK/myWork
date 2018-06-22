import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupEventPage } from './group-event.page';
import { TranslationModule } from 'angular-l10n';
import { LayoutModule } from '../../layout-module/layout.module';

const GROUP_EVENT_PAGES = [
  GroupEventPage,
];

/**
 * 
 * @author NorrapatN
 * @since Mon Jul 24 2017
 */
@NgModule({
  imports: [
    IonicPageModule.forChild(GroupEventPage),
    TranslationModule,
    LayoutModule,
  ],
  declarations: [
    ...GROUP_EVENT_PAGES,
  ],
  entryComponents: [
    ...GROUP_EVENT_PAGES,
  ],
  providers: [],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GroupEventPageModule {

}
