import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {
  MeetingCreateEventPage,
} from '../meeting-page/meeting-event-pages/meeting-createEvent-page/meeting-createEvent-page';
import { NotiPage } from '../noti-page/noti-page';
import { ShopCartStep3 } from '../shop-cart-step3/shop-cart-step3';
import { WorkForceHomePage } from '../workforce-home/workforce-home.page';

@Component({
  selector: 'claim-step4',
  templateUrl: 'claim-step4.html'
})
export class ClaimStep4 {

  constructor(public navCtrl: NavController) {

  }
  private goToHome(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(WorkForceHomePage);
  }
  public goToCart3(params) {
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
