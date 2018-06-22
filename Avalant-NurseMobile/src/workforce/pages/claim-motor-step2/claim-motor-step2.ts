import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login-page';
import { TimeLine } from '../timeline/timeline';
import { ExpenseCreatePage } from '../expense-create-page/expense-create-page';
import { NotiPage } from '../noti-page/noti-page';
import { ShopCartStep3 } from '../shop-cart-step3/shop-cart-step3';
import { ClaimMotorStep3 } from '../claim-motor-step3/claim-motor-step3';
import { WorkForceHomePage } from '../workforce-home/workforce-home.page';
import { MeetingCreateEventPage } from '../meeting-page/meeting-event-pages/meeting-createEvent-page/meeting-createEvent-page';

@Component({
  selector: 'claim-motor-step2',
  templateUrl: 'claim-motor-step2.html'
})
export class ClaimMotorStep2 {

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
  private goToClaimMotor3(params) {
    if (!params) params = {};
    this.navCtrl.push(ClaimMotorStep3);
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
