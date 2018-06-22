import { Component, OnInit } from '@angular/core';
import { App, LoadingController, NavController, NavParams } from 'ionic-angular';

import { AppState } from '../../app/app.state';
import { AppConstant } from '../../constants/app-constant';
import { IOrderLine, IOrderResponse } from '../../model/payment/order-response.model';

@Component({
  selector: 'payment-success',
  templateUrl: 'payment-success.page.html',
  styleUrls: ['/payment-success.page.scss']
})

export class PaymentSuccessPage implements OnInit {

  /**
   * When success, The page will render Check sign animation.
   * 
   * It will not work with 'showSummary = true'
   */
  private isSuccessful: boolean = false;

  /**
   * This flag for show header on top of page ?
   */
  private haveHeader: boolean = false;

  /**
   * If required to show summary of order, This flag will be true.
   */
  private showSummary: boolean = false;

  /**
   * Use for force it go back when tap on Back button
   */
  private canGoBack: boolean = false;

  /**
   * Order data
   */
  private order: IOrderResponse;
  private orderLineProduct: IOrderLine;
  private orderLinePerson: IOrderLine[];

  /**
   * Temporary get Person Card ID from Business user
   * 
   * NOTE : TAMMA said he will put CARD ID into Order model
   */
  get personCardId(): string {
    return this.appState.businessUser && this.appState.businessUser.cardId;
  }

  /**
   * Title of order
   */
  private title: string;

  constructor(
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private appCtrl: App,
    private appState: AppState,
    private navParams: NavParams
  ) {
    this.haveHeader = navParams.get('haveHeader');
    this.showSummary = navParams.get('showSummary');
    this.title = navParams.get('title');
    this.canGoBack = navParams.get('canGoBack') === true;

    this.order = navParams.get('order');
    this.mapOrder(this.order);

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
      this.success();
      // console.log('isSuccessful => ', this.isSuccessful);
    }, 100);

    // console.log('isSuccessful => ', this.isSuccessful);
  }

  private success() {
    this.isSuccessful = true;
  }

  private goHome() {
    this.appCtrl.getRootNav().setRoot(AppConstant.DEFAULT_PAGE, null, { animate: true });
  }

  public goMoreProduct() {
    this.navCtrl.pop();
  }

  private mapOrder(order: IOrderResponse): void {
    this.orderLineProduct = order && order.orderlines
      && order.orderlines.find((orderLine) => orderLine.LINETYPE == AppConstant.ORDER_LINE_TYPE.PRODUCT);
    this.orderLinePerson = order && order.orderlines 
      && order.orderlines.filter(orderLine=>orderLine.LINETYPE == AppConstant.ORDER_LINE_TYPE.PERSON);
      // console.log(this.orderLinePerson);
  }

}