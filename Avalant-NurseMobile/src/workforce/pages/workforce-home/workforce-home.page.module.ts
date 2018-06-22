import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { TranslationModule } from 'angular-l10n';
import { MomentModule } from 'angular2-moment';
import { TextMaskModule } from 'angular2-text-mask';
import { IonicPageModule } from 'ionic-angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { DatePickerModule } from 'ionic2-date-picker';
import { SuperTabsModule } from 'ionic2-super-tabs';

import { WorkForceHomePage } from './workforce-home.page';
import {
  WORKFORCE_DECLARATIONS,
  WORKFORCE_DIRECTIVE,
  WORKFORCE_EXPORTS,
  WORKFORCE_MODULES,
  WORKFORCE_PAGES,
  WORKFORCE_PIPES,
  WORKFORCE_PROVIDERS,
} from './workforce.declarations';

@NgModule({
  imports: [
    ...WORKFORCE_MODULES,
    CommonModule, // IMPORTANT THING FOR USE WITH NG VALUE ACCESSOR!!
    DatePickerModule,
    HttpModule,
    IonicPageModule.forChild(WorkForceHomePage),
    MomentModule,
    NgCalendarModule,
    SuperTabsModule.forRoot(),
    TextMaskModule,
    TranslationModule,
  ],
  declarations: [
    ...WORKFORCE_DECLARATIONS,
  ],
  providers: [
    ...WORKFORCE_PROVIDERS,
    ...WORKFORCE_PIPES,
  ],
  entryComponents: [
    ...WORKFORCE_PAGES,
  ],
  exports: [
    ...WORKFORCE_EXPORTS
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class WorkforceModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: WorkforceModule,
      providers: [
        ...WORKFORCE_PROVIDERS,
        ...WORKFORCE_PIPES,
        ...WORKFORCE_DIRECTIVE,
      ],
    };
  }
}
