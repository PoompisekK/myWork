import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login-page';
import { TimeLine } from '../timeline/timeline';

import { ExpenseCreatePage } from '../expense-create-page/expense-create-page';
import { NotiPage } from '../noti-page/noti-page';
import { ShopCartStep1 } from '../shop-cart-step1/shop-cart-step1';
import { WorkForceHomePage } from '../workforce-home/workforce-home.page';

@Component({
  selector: 'shop-detail-page',
  templateUrl: 'shop-detail-page.html'
})
export class ShopDetailPage {
  
  private currentNumber = 0;
 
  private increment() {
    this.currentNumber++;
  }

  private decrement() {
    this.currentNumber--;
  }

  constructor(public navCtrl: NavController) {

  }
  public goToHome(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(WorkForceHomePage);
  }
  private goToCart1(params) {
    if (!params) params = {};
    this.navCtrl.push(ShopCartStep1);
  }
  public goToNotiPage(params) {
    if (!params) params = {};
    this.navCtrl.push(NotiPage);
  }
}
