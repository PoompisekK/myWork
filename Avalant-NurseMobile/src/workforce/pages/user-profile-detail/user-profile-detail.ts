import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AnimateCss } from '../../../animations/animate-store';
import { AppState } from '../../../app/app.state';
import { MyProfilePage } from './my-profile-page/my-profile-page';
import { PersonalConditionPage } from './personal-condition-page/personal-condition-page';
import { SkillPage } from './skill-page/skill-page';
import { LeaveSummaryPage } from './leave-summary-page/leave-summary-page';
import { timeRecordingPage } from './time-recording-page/time-recording-page';
import { WorkingHoursSummaryPage } from './working-hours-summary-page/working-hours-summary-page';

@Component({
  selector: 'user-profile-detail',
  templateUrl: 'user-profile-detail.html',
  animations: [
    AnimateCss.peek()
  ]
})
export class UserProfileDetailPage {

  private checkIn: string;
  private checkOut: string;

  constructor(
    private navCtrl: NavController,
    private appState: AppState,
    private nacParam: NavParams,
  ) {
    console.log('User : ', appState.businessUser);

    this.checkIn = this.nacParam.get('checkIn');
    this.checkOut = this.nacParam.get('checkOut');

    console.log("Check In Time: " + this.checkIn);
    console.log("Check Out TimeL " + this.checkOut);
  }

  private PAGE_COMP = {
    "MyProfilePage": MyProfilePage,
    "PersonalConditionPage": PersonalConditionPage,
    "SkillPage": SkillPage,
    "LeaveSummaryPage": LeaveSummaryPage,
    "TimeRecordingPage": timeRecordingPage,
    "WorkingHoursSummeryPage": WorkingHoursSummaryPage,
  };

  private goRoot(page: any) {
    const pageComponent = this.PAGE_COMP[page];
    this.navCtrl.push(pageComponent, {}, { animate: true, direction: "forward"});
  }
}
