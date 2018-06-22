import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationPage } from './notification.page';
import { TranslationModule } from 'angular-l10n';
import { LayoutModule } from '../../layout-module/layout.module';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    IonicPageModule.forChild(NotificationPage),
    TranslationModule,
    LayoutModule,
    MomentModule
  ],
  declarations: [
    NotificationPage
  ],
  entryComponents: [
    NotificationPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotificationPageModule {

}