import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ClaimStep4 } from '../claim-step4/claim-step4';
import { MeetingCreateEventPage, } from '../meeting-page/meeting-event-pages/meeting-createEvent-page/meeting-createEvent-page';
import { NotiPage } from '../noti-page/noti-page';
import { ShopCartStep3 } from '../shop-cart-step3/shop-cart-step3';
import { WorkForceHomePage } from '../workforce-home/workforce-home.page';

@Component({
  selector: 'claim-motor-step3',
  templateUrl: 'claim-motor-step3.html'
})
export class ClaimMotorStep3 {

  constructor(public navCtrl: NavController) {

  }
  public goToHome(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(WorkForceHomePage);
  }
  public goToCart3(params) {
    if (!params) params = {};
    this.navCtrl.push(ShopCartStep3);
  }
  private goToClaimStep4(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(ClaimStep4);
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
