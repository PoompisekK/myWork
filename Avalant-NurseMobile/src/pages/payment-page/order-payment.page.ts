import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { AppConstant } from '../../constants/app-constant';
import { PaymentMethodModel } from '../../model/payment/payment-method.model';
import { PaymentService } from '../../services/payment-services/payment-service';

@Component({
  selector: 'order-payment-page',
  templateUrl: 'order-payment.page.html',
  //styleUrls: ['/order-payment.page.scss']

})

export class OrderPaymentPage implements OnInit {

  private validDate: any;
  private expireDate: any;
  private paymentMethodList: PaymentMethodModel[] = [];

  private shopType = AppConstant.SHOP_TYPE_MS;

  constructor(
    private navParams: NavParams,
    private paymentService: PaymentService,
  ) {
  }
  //Todo not use change to order in future 
  private cart: any = {};

  private selectedPaymentMethod = 'CREDIT';

  public ngOnInit() {
    //Todo not use change to order.shopTypeId in future 

  }

}