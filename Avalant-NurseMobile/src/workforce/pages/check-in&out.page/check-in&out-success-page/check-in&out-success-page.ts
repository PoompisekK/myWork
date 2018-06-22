import { Component } from '@angular/core';

import { AppServices } from '../../../../services/app-services';
import { NavParams } from 'ionic-angular';
import { WorkForceHomePage } from '../../workforce-home/workforce-home.page';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'check-in-out-success-page',
  templateUrl: 'check-in&out-success-page.html',
  styleUrls: ['/check-in&out-success-page.scss']
})
export class CheckInOutSuccesssPage {
  private checkedTime = {};
  private clockType: string = null;
  constructor(
    public appService: AppServices,
    public navParams: NavParams,
    private translationService: TranslationService,
  ) {

  }
  public ionViewDidEnter() {
    console.log("navParams data:", this.navParams.data);
    this.checkedTime = this.navParams.get("data");
    let _clockType = this.navParams.get("clockType");
    if (_clockType == "TIME_IN") {
      this.clockType = this.translationService.translate('M_CHECK_INOUT.YOU_HAVE_CHECK_IN_AT');
    } else if (_clockType == "TIME_OUT") {
      this.clockType = this.translationService.translate('M_CHECK_INOUT.YOU_HAVE_CHECK_OUT_AT');
    }
  }
  public goToHome() {
    this.appService.goToPage(WorkForceHomePage, {}, "forward");
  }
}
