import { Component, OnInit } from '@angular/core';

import { AppState } from '../../../app/app.state';
import { MyOrderService } from '../../../services/my-order-service/my-order.service';
import { PaymentService } from '../../../services/payment-services/payment-service';

/**
 * Motor's Order summary Component
 * 
 * @author NorrapatN
 * @since Thu Nov 23 2017
 */
@Component({
  selector: 'motor-order-summary',
  templateUrl: 'motor-order-summary.component.html',
})
export class MotorOrderSummary implements OnInit {

  private cartItemList: any[];

  constructor(
    private appState: AppState,
    private myOrderService: MyOrderService,
    private paymentService: PaymentService,
  ) {

  }

  public ngOnInit(): void {
    this.loadCarts();
  }

  public loadCarts(): void {
    // let carts = this.cartService.filterCartByOrganization(this.appState.currentOrganizationId);
    // if (carts && carts.length) {
    //   this.cartItemList = carts[0].cartDetails;
    // }
  }

}
