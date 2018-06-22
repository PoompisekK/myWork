import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login-page';
import { TimeLine } from '../timeline/timeline';

import { ExpenseCreatePage } from '../expense-create-page/expense-create-page';
import { NotiPage } from '../noti-page/noti-page';
import { ShopCartStep4 } from '../shop-cart-step4/shop-cart-step4';
import { WorkForceHomePage } from '../workforce-home/workforce-home.page';
import { MeetingCreateEventPage } from '../meeting-page/meeting-event-pages/meeting-createEvent-page/meeting-createEvent-page';

@Component({
  selector: 'shop-cart-step3',
  templateUrl: 'shop-cart-step3.html'
})
export class ShopCartStep3 {

  constructor(public navCtrl: NavController) {

  }
  public goToHome(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(WorkForceHomePage);
  }
  public goToMeeting2(params) {
    if (!params) params = {};
    this.navCtrl.push(MeetingCreateEventPage);
  }
  private goToPaymentComplete(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(ShopCartStep4);
  }
  public goToNotiPage(params) {
    if (!params) params = {};
    this.navCtrl.push(NotiPage);
  }
}
