import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationModule } from 'angular-l10n';
import { IonicModule } from 'ionic-angular/module';
import { OrderModule } from 'ngx-order-pipe';
import { MotorService } from './services/motor.service';
import { MotorCartComponent } from './components/motor-cart.component';
import { LayoutModule } from '../layout-module/layout.module';
import { MotorShippingComponent } from './components/motor-shipping.component';
import { MotorPaymentMethodComponent } from './components/payment-method/motor-payment-method.component';
import { MotorOrderSummary } from './components/order-summary/motor-order-summary.component';

const DECLARATIONS = [
  MotorCartComponent,
  MotorShippingComponent,
  MotorPaymentMethodComponent,
  MotorOrderSummary,
];

/**
 * Motor Module for share many Services that used in Motor module.
 * 
 * @author NorrapatN
 * @since Thu Nov 09 2017
 */
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    LayoutModule,
    TranslationModule,
    OrderModule,
  ],
  declarations: [
    ...DECLARATIONS,
  ],
  providers: [
    MotorService,
  ],
  exports: [
    ...DECLARATIONS,
  ]
})
export class MotorModule {

}
