import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslationModule } from 'angular-l10n';
import { GarageSelectionPage } from './garage-selection.page';
import { LayoutModule } from '../../layout-module/layout.module';
import { MotorModule } from '../motor.module';

const PAGES = [
  GarageSelectionPage,
];

// const 

/**
 * Garage Selection page Module
 * 
 * @author NorrapatN
 * @since Fri Nov 03 2017
 */
@NgModule({
  imports: [
    IonicPageModule.forChild(GarageSelectionPage),
    TranslationModule,
    LayoutModule,
    MotorModule,
  ],
  declarations: [
    ...PAGES,
  ],
  entryComponents: [
    ...PAGES,
  ],
  providers: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GarageSelectionPageModule {

}
