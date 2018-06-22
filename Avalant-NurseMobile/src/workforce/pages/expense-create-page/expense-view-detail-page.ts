import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Loading } from 'ionic-angular/components/loading/loading';

import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { CalendarDatePickerService } from '../../../services/calendar-date-picker-service/calendar-date-picker-service';
import { ExpenseService } from '../../service/expenseService';
import { WorkforceHttpService } from '../../service/workforceHttpService';
import { WorkforceService } from '../../service/workforceService';
import { NotiPage } from '../noti-page/noti-page';

@Component({
  selector: 'expense-view-detail-page',
  templateUrl: 'expense-view-detail-page.html'
})
export class ExpenseViewDetailPage implements OnInit {
  @ViewChild(Slides) public slides: Slides;

  private currExpenseTypeCode: string = "ETM0001";//default before change to another;
  private _opacity: number = 0.4;
  private projectLists: any[] = [];
  private activeList: any[] = [
    { opacity: 1 },
    { opacity: this._opacity },
    { opacity: this._opacity },
    { opacity: this._opacity },
  ];

  private expenseCodeOther: string = "ETMOTHER";
  private expenseTypeOtherLists: any[] = [];
  private displayExpenseTypeList: any[] = [
    { "expenseCode": "ETM0001", "expenseName": "Transport", "expenseGroupCode": "EXPENSE" },
    { "expenseCode": "ETM0002", "expenseName": "Office", "expenseGroupCode": "EXPENSE" },
    { "expenseCode": "ETM0003", "expenseName": "Over Time", "expenseGroupCode": "EXPENSE" },
    { "expenseCode": this.expenseCodeOther }
  ];

  // goToSlide(_index: number) {
  //   this.slides && this.slides.slideTo(_index, 500);
  //   this.activeImgChanged(_index);
  // }

  private activeImgChanged(_index: number | 0) {
    if (_index < this.activeList.length) {
      this.activeList.forEach(itm => {
        itm.opacity = this._opacity;
      });
      (this.activeList[_index] || {}).opacity = 1;

      let expType = this.displayExpenseTypeList[_index].expenseCode;
      if (_index > 0 && _index < this.displayExpenseTypeList.length && expType != this.expenseCodeOther) {
        this.currExpenseTypeCode = expType;
      } else {
        this.currExpenseTypeCode = null;
      }
    }
  }

  private expenseData: any = {
    startDateTime: new Date()
  };
  constructor(
    public alertController: AlertController,
    public calendarDatePickerService: CalendarDatePickerService,
    public expenseService: ExpenseService,
    public appLoadingService: AppLoadingService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public wfHttpService: WorkforceHttpService,
    public workforceService: WorkforceService,
  ) { }

  private expenseTypeData: any;
  private expenseIndex: number;

  public ngOnInit() {
    this.appLoadingService.showLoading();
    this.expenseTypeData = this.navParams.get("expenseObject");
    console.warn("expenseTypeData :", JSON.stringify(this.expenseTypeData, null, 2));

    this.expenseIndex = this.displayExpenseTypeList.findIndex(item => item.expenseCode === this.expenseTypeData.expenseTypeCode);
    console.log("expenseIndex :", this.expenseIndex);
    if (this.expenseIndex != -1) {
      this.activeImgChanged(this.expenseIndex);
    } else {
      this.activeImgChanged(3);
    }

    this.expenseService.getProjectList().subscribe((resp) => {
      this.projectLists = resp;
      console.log("projectLists :", resp);
    });
    this.expenseService.getExpenseType().subscribe((resp) => {
      resp && resp.forEach((item) => {
        let isExist = this.displayExpenseTypeList.find(existItm => existItm.expenseCode == item.expenseCode);
        if (isExist == null) {
          if (item.expenseGroupCode == 'EXPENSE') {
            this.expenseTypeOtherLists.push(item);
          }
        }
      });
    });
    setTimeout(() => {
      this.appLoadingService.hideLoading();
    }, 1000);
  }

  private goToNotiPage(paams) {
    this.navCtrl.push(NotiPage);
  }

}
