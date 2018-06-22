import { Component, OnInit } from '@angular/core';
import { App, LoadingController, NavParams } from 'ionic-angular';

import { AppConstant } from '../../../constants/app-constant';
import { PaymentMethodModel } from '../../../model/payment/payment-method.model';
import { PaymentService } from '../../../services/payment-services/payment-service';

@Component({
  selector: 'order-success-component',
  templateUrl: 'order-success.component.html',
  //styleUrls: ['/payment.page.scss']

})

export class OrderSuccessComponent implements OnInit {

  private validDate: any;
  private expireDate: any;
  private paymentMethodList: PaymentMethodModel[] = [];
  private isSuccessful: boolean = false;
  private haveHeader: boolean = false;
  private orderID: string;

  constructor(
    private navParams: NavParams,
    private paymentService: PaymentService,
    private loadingCtrl: LoadingController,
    private appCtrl: App,
  ) {
    this.haveHeader = navParams.get('haveHeader');
  }

  public ngOnInit() {
    this.presentLoadingCustom();
  }
  private presentLoadingCustom() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
      // console.log(this.paymentService)
      if (this.paymentService.order) {
        this.orderID = this.paymentService.order.orderID;
      }
      this.success();

      // console.log('isSuccessful => ', this.isSuccessful);
    }, 100);

    // console.log('isSuccessful => ', this.isSuccessful);

  }

  public success() {
    this.isSuccessful = true;
  }
  private goHome() {
    this.appCtrl.getRootNav().setRoot(AppConstant.DEFAULT_PAGE, null, { animate: true });
  }

}