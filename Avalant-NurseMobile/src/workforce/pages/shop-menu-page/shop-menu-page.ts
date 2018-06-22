import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login-page';
import { TimeLine } from '../timeline/timeline';

import { ExpenseCreatePage } from '../expense-create-page/expense-create-page';
import { NotiPage } from '../noti-page/noti-page';
import { ShopHomePage } from '../shop-home-page/shop-home-page';
import { WorkForceHomePage } from '../workforce-home/workforce-home.page';
import { MeetingCreateEventPage } from '../meeting-page/meeting-event-pages/meeting-createEvent-page/meeting-createEvent-page';

@Component({
  selector: 'shop-menu-page',
  templateUrl: 'shop-menu-page.html'
})
export class ShopeMenuPage {

  constructor(public navCtrl: NavController) {

  }
  public goToHome(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(WorkForceHomePage);
  }
  private goToShopHome(params) {
    if (!params) params = {};
    this.navCtrl.push(ShopHomePage);
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
