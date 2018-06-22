import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicPageModule } from 'ionic-angular';
import { TranslationModule } from 'angular-l10n';
import { MultiPickerModule } from 'ion-multi-picker';
import { AddCarPage } from './add-car.page';
import { LayoutModule } from '../../layout-module/layout.module';
import { MotorModule } from '../motor.module';

const MOTOR_PAGES = [
  AddCarPage,
];

const MOTOR_COMPONENTS = [

];

/**
 * Select Car Page Module
 * 
 * @author NorrapatN
 * @since Wed Sep 27 2017
 */
@NgModule({
  imports: [
    CommonModule, // IMPORTANT THING FOR USE WITH NG VALUE ACCESSOR!!
    IonicPageModule.forChild(AddCarPage),
    TranslationModule,
    LayoutModule,
    MultiPickerModule,
    MotorModule,
  ],
  declarations: [
    ...MOTOR_PAGES,
    ...MOTOR_COMPONENTS,
  ],
  providers: [

  ],
  entryComponents: [
    ...MOTOR_PAGES,
  ],
  exports: [
    ...MOTOR_PAGES,
    ...MOTOR_COMPONENTS,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SelectCarPageModule {

}
