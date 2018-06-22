import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TranslationModule } from 'angular-l10n';
import { IonicPageModule } from 'ionic-angular';

import { LayoutModule } from '../../layout-module/layout.module';
import { MotorModule } from '../motor.module';
import { MotorCartPage } from './motor-cart.page';

const CART_PAGES = [
  MotorCartPage,

];

const CART_PIPES = [
];

/**
 * Motor Cart page module
 * 
 * @author NorrapatN
 * @since Wed Nov 01 2017
 */
@NgModule({
  imports: [
    IonicPageModule.forChild(MotorCartPage),
    TranslationModule,
    LayoutModule,
    MotorModule,
  ],
  declarations: [
    ...CART_PAGES,
    ...CART_PIPES,
  ],
  entryComponents: [
    ...CART_PAGES,
  ],
  providers: [
  ],
  exports: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MotorCartPageModule {

}
