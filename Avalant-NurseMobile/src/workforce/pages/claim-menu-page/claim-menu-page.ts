import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login-page';
import { TimeLine } from '../timeline/timeline';
import { LeavePage } from '../leave-page/leave-page';

import { ExpensePage } from '../expense-page/expense-page';
import { CalendarPage } from '../calendar-page/calendar-page';
import { NotiPage } from '../noti-page/noti-page';
import { ClaimMotorStep1 } from '../claim-motor-step1/claim-motor-step1';

@Component({
  selector: 'claim-menu-page',
  templateUrl: 'claim-menu-page.html'
})
export class ClaimMenu {

  constructor(public navCtrl: NavController) {

  }
  public goToNotiPage(params) {
    if (!params) params = {};
    this.navCtrl.push(NotiPage);
  }
  private goToClaimMotor1(params) {
    if (!params) params = {};
    this.navCtrl.push(ClaimMotorStep1);
  }
}
