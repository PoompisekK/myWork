import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { AppState } from '../../app/app.state';
import { PaymentMethodModel } from '../../model/payment/payment-method.model';
import { PaymentService } from '../../services/payment-services/payment-service';

@Component({
  selector: 'payment-page',
  templateUrl: 'payment.page.html',
  styleUrls: ['/payment.page.scss']

})

export class PaymentComponent implements OnInit {

  private validDate: any;
  private expireDate: any;
  private paymentMethodList: PaymentMethodModel[] = [];

  constructor(
    private navParams: NavParams,
    private paymentService: PaymentService,
    private appState: AppState,
  ) {
  }

  private selectedPaymentMethod = 'CREDIT';

  public ngOnInit() {
    this.getPaymentMethod();
    // console.log(this.paymentService.order.orderID)
  }

  private pay() {
  }

  private getPaymentMethod() {
    // This orgID for Ybat only
    this.paymentService.getPaymentMethodFromOrgID(this.appState.currentOrganizationId).subscribe((response) => {
      // console.log('reponse => ', response);
      this.paymentMethodList = response;
    }, (error) => {
      console.warn('error => ', error);
    });
  }

}
