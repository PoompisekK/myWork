import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';

import { AppConstant } from '../../../constants/app-constant';
import { HistoryModel } from '../../model/checkInOut.model';
import { CheckInOutService } from '../../service/checkInOutService';
import { WorkforceService } from '../../service/workforceService';
import { CheckInOut } from '../check-in&out.page/check-in&out.page';

@Component({
  selector: 'check-inout-history-page',
  templateUrl: 'check-in&out-history-page.html'
})
export class CheckInOutHistoryPage implements OnInit {
  private historys: HistoryModel[] = [];
  private historyRecorderDate: any[] = [];
  private currentMonth: Date = new Date();
  private inputSearch: Subject<string> = new Subject();
  constructor(
    public navCtrl: NavController,
    private checkInOutService: CheckInOutService
  ) {

  }
  public ngOnInit() {
    this.getHistory();
    this.inputSearch.debounceTime(AppConstant.APP_DEBOUNCE_SEARCH_TIME).subscribe((res) => {
      console.log("inputSearch :", res);
    });
  }

  private getHistory() {
    this.checkInOutService.getCheckInOutHistory().subscribe((res: HistoryModel[]) => {
      this.historys = res;
      console.log("getCheckInOutHistory :", res);
    }, (err) => {
      console.log(err);
    });
  }

}
