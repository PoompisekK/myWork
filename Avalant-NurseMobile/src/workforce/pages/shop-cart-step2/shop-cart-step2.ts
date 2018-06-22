import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login-page';
import { TimeLine } from '../timeline/timeline';

import { ExpenseCreatePage } from '../expense-create-page/expense-create-page';
import { NotiPage } from '../noti-page/noti-page';
import { ShopCartStep3 } from '../shop-cart-step3/shop-cart-step3';
import { WorkForceHomePage } from '../workforce-home/workforce-home.page';
import { MeetingCreateEventPage } from '../meeting-page/meeting-event-pages/meeting-createEvent-page/meeting-createEvent-page';

@Component({
  selector: 'shop-cart-step2',
  templateUrl: 'shop-cart-step2.html'
})
export class ShopCartStep2 {

  constructor(public navCtrl: NavController) {

  }
  public goToHome(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(WorkForceHomePage);
  }
  private goToCart3(params) {
    if (!params) params = {};
    this.navCtrl.push(ShopCartStep3);
  }
  public goToMeeting2(params) {
    if (!params) params = {};
    this.navCtrl.push(MeetingCreateEventPage);
  }
  public goToNotiPage(params) {
    if (!params) params = {};
    this.navCtrl.push(NotiPage);
  }
}
