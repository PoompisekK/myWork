import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicPageModule } from 'ionic-angular';
import { TranslationModule } from 'angular-l10n';
import { LayoutModule } from '../layout-module/layout.module';
import { MotorHomePage } from './motor-home.page';
import { MotorHomeHeaderComponent } from './motor-home-header/motor-home-header.component';
import { UserVehicleBarComponent } from './user-vehicle-bar/user-vehicle-bar.component';
import { MotorModule } from './motor.module';

const MOTOR_PAGES = [
  MotorHomePage,
];

const MOTOR_COMPONENTS = [
  MotorHomeHeaderComponent,
  UserVehicleBarComponent,
];

/**
 * Motor Home Page Module
 * 
 * @author NorrapatN
 * @since Mon Sep 25 2017
 */
@NgModule({
  imports: [
    CommonModule, // IMPORTANT THING FOR USE WITH NG VALUE ACCESSOR!!
    IonicPageModule.forChild(MotorHomePage),
    TranslationModule,
    LayoutModule,
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
export class MotorHomePageModule {

}
