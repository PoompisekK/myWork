import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicPageModule } from 'ionic-angular';
import { SelectCarPage } from './select-car.page';
import { TranslationModule } from 'angular-l10n';
import { LayoutModule } from '../../layout-module/layout.module';
import { MotorModule } from '../motor.module';

const PAGES = [
  SelectCarPage
];

/**
 * Select Car page Module 
 * 
 * @author NorrapatN
 * @since Fri Oct 06 2017
 */
@NgModule({
  imports: [
    CommonModule,
    IonicPageModule.forChild(SelectCarPage),
    TranslationModule,
    LayoutModule,
    MotorModule,
  ],
  declarations: [
    ...PAGES,
  ],
  providers: [

  ],
  entryComponents: [
    ...PAGES,
  ],
  exports: [
    ...PAGES,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SelectCarPageModule {

}
