import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login-page';
import { TimeLine } from '../timeline/timeline';
import { ExpenseCreatePage } from '../expense-create-page/expense-create-page';
import { NotiPage } from '../noti-page/noti-page';
import { ShopCartStep3 } from '../shop-cart-step3/shop-cart-step3';
import { ClaimMotorStep2 } from '../claim-motor-step2/claim-motor-step2';
import { WorkForceHomePage } from '../workforce-home/workforce-home.page';
import { MeetingCreateEventPage } from '../meeting-page/meeting-event-pages/meeting-createEvent-page/meeting-createEvent-page';

@Component({
  selector: 'claim-motor-step1',
  templateUrl: 'claim-motor-step1.html'
})
export class ClaimMotorStep1 {

  constructor(public navCtrl: NavController) {

  }
  private goToClaimMotor2(params) {
    if (!params) params = {};
    this.navCtrl.push(ClaimMotorStep2);
  }
  public goToHome(params) {
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
