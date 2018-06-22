import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login-page';
import { TimeLine } from '../timeline/timeline';

import { ExpenseCreatePage } from '../expense-create-page/expense-create-page';
import { NotiPage } from '../noti-page/noti-page';
import { ShopCartStep2 } from '../shop-cart-step2/shop-cart-step2';
import { WorkForceHomePage } from '../workforce-home/workforce-home.page';
import { MeetingCreateEventPage } from '../meeting-page/meeting-event-pages/meeting-createEvent-page/meeting-createEvent-page';

@Component({
  selector: 'shop-cart-step1',
  templateUrl: 'shop-cart-step1.html'
})
export class ShopCartStep1 {

  private currentNumber = 1;
 
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
  private goToCart2(params) {
    if (!params) params = {};
    this.navCtrl.push(ShopCartStep2);
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
