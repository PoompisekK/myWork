import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { AppServices } from '../../../../services/app-services';
import { HCMTranslationService } from '../../../modules/hcm-translation.service';
import { WorkForceHomePage } from '../../workforce-home/workforce-home.page';

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
    private hcmTranslationService: HCMTranslationService,
  ) {

  }
  public ionViewDidEnter() {
    console.log("navParams data:", this.navParams.data);
    this.checkedTime = this.navParams.get("data");
    let _clockType = this.navParams.get("clockType");
    if (_clockType == "TIME_IN") {
      this.clockType = this.hcmTranslationService.translate('M_CHECK_INOUT.YOU_HAVE_CHECK_IN_AT','You have check in at');
    } else if (_clockType == "TIME_OUT") {
      this.clockType = this.hcmTranslationService.translate('M_CHECK_INOUT.YOU_HAVE_CHECK_OUT_AT','You have check out at');
    }
  }
  public goToHome() {
    this.appService.goToPage(WorkForceHomePage, {}, "forward");
  }
}
