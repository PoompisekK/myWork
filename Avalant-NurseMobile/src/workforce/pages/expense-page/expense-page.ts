import { Component } from '@angular/core';
import { Events, ModalController, NavController } from 'ionic-angular';
import * as moment from 'moment';

import { AnimateCss } from '../../../animations/animate-store';
import { AppConstant } from '../../../constants/app-constant';
import { currencyBahtMask } from '../../../layout-module/mask-function/masks';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../../services/app-services';
import { ExpenseService } from '../../service/expenseService';
import { ExpenseCreatePage } from '../expense-create-page/expense-create-page';
import { ExpenseViewPage } from '../expense-view-page/expense-view-page';
import { NotiPage } from '../noti-page/noti-page';
import { HCMConstant } from '../../../constants/hcm/hcm-constant';

@Component({
  selector: 'expense-page',
  templateUrl: 'expense-page.html',
  animations: [
    AnimateCss.peek(),
  ]
})
export class ExpensePage {
  private expenseGroup: any[] = [];
  private expenseList: any[] = [];
  private expenseTypeList: any[] = [];
  private expenseMasterStatusList: any[] = [];
  private currentDate: Date = new Date();
  constructor(
    private appLoadingService: AppLoadingService,
    private appServices: AppServices,
    private expenseService: ExpenseService,
    private modalController: ModalController,
    private navCtrl: NavController,
  ) {

    this.appServices.subscribe(this.subscribeEventsName, () => {
      this.isLoading = true;
      this.goExpenseHistory();
    });

  }
  private subscribeEventsName: string = AppConstant.EVENTS_SUBSCRIBE.EXPENSE_CREATE;
  public ionViewWillLeave() {
    this.appServices.unsubscribe(this.subscribeEventsName);
  }

  private lowerCaseCompare(str1: string, str2: string) {
    str1 = (str1 || '').toLowerCase();
    str2 = (str2 || '').toLowerCase();
    return (str1 === str2 || (str1 || '').indexOf(str2) > -1);
  }

  private getStatus(objItm: any, index: number): boolean {
    if (index == 0) {
      return this.lowerCaseCompare(objItm && objItm.status, HCMConstant.ExpenseStatus.DRAFT);
    } else if (index == 1) {
      return this.lowerCaseCompare(objItm && objItm.status, HCMConstant.ExpenseStatus.SUBMIT);
    } else if (index == 2) {
      return this.lowerCaseCompare(objItm && objItm.status, HCMConstant.ExpenseStatus.APPROVED);
    } else if (index == 3) {
      return this.lowerCaseCompare(objItm && objItm.status, HCMConstant.ExpenseStatus.REJECT);
    } else if (index == 4) {
      return this.lowerCaseCompare(objItm && objItm.status, HCMConstant.ExpenseStatus.PAY);
    } else {
      return false;
    }
  }

  private currencyMask = currencyBahtMask;
  private isLoading: boolean = true;
  private ionViewDidEnter() {
    this.expenseService.getExpenseType().subscribe(resp => {
      this.expenseTypeList = resp;
      console.log("expenseTypeList:", resp);
    });
    this.expenseService.getExpenseMasterStatus().subscribe(resp => {
      this.expenseMasterStatusList = resp;
      console.log("getExpenseMasterStatus:", resp);
    });

    this.isLoading = true;
    setTimeout(() => {
      this.goExpenseHistory();
    }, AppConstant.APP_DEBOUNCE_LOADING_TIME);
  }

  private createExpense() {
    this.appServices.openModal(ExpenseCreatePage, {});
  }
  private goToNotiPage(params) {
    if (!params) params = {};
    this.navCtrl.push(NotiPage);
  }

  private doRefresh(refresher) {
    this.appLoadingService.showLoading();
    this.isLoading = true;
    setTimeout(() => {
      this.goExpenseHistory(() => {
        (this.appLoadingService.hideLoading() || new Promise((resolve) => resolve()))
          .then(() => {
            refresher.complete();
            console.log("refresher.complete !!!!");
          });
      });
    }, AppConstant.APP_DEBOUNCE_LOADING_TIME);
  }

  private viewExpense(_expenseItm: any) {
    console.log("viewExpense :", _expenseItm);
    this.navCtrl.push(ExpenseViewPage, {
      viewMode: true,
      expenseObject: _expenseItm
    });
  }

  private getImageType(expenseTypeCode: any): string {
    return this.expenseService.getExpenseImageTypeByCode(expenseTypeCode);
  }

  private goExpenseHistory(cb?: (data: any) => void) {
    this.expenseList = [];
    this.expenseGroup = [];

    this.expenseService.getExpenseHistoryList()
      .debounceTime(AppConstant.APP_DEBOUNCE_LOADING_TIME)
      .map((resp: any[]) => {
        let newResp = [];
        (resp || []).forEach(item => {
          const _expenseRequestNo = item.expenseRequestNo;
          (!item.listExpenseDetail) && this.expenseService.getExpenseItemDetail(_expenseRequestNo).subscribe(respDetail => {
            item.listExpenseDetail = respDetail["listExpenseDetail"];
          });
          newResp.push(item);
        });
        return newResp;
      })
      .subscribe(resp => {
        let _expenseGroup = [];

        (resp || []).forEach((expItm) => {
          let dateItm = moment(expItm.createDate);
          const expenseMonth = dateItm.format("MMMM");
          const expenseYear = dateItm.year();
          console.log("dateItm => month-year :", expenseMonth + ' ' + expenseYear);

          let yearObj = _expenseGroup.find(itm => itm.year == expenseYear);
          if (!yearObj) {
            yearObj = {
              year: expenseYear,
              months: []
            };
            _expenseGroup.push(yearObj);
          }
          let monthsList = yearObj.months;
          let monthObj = monthsList.find(itm => itm.month == dateItm.format("MMMM"));
          if (!monthObj) {
            monthObj = {
              month: dateItm.format("MMMM"),
              dateData: []
            };
            monthObj.dateData.push(expItm);
            yearObj.months.push(monthObj);
          } else {
            monthObj.dateData.push(expItm);
          }
        });
        console.log("_expenseGroup:", JSON.parse(JSON.stringify(_expenseGroup)));
        (_expenseGroup || []).forEach((expenseYearItm) => {
          (expenseYearItm.months || []).forEach(expenseMonthItm => {
            (expenseMonthItm.dateData || []).sort((a, b) => {
              let aDate = moment(a.createDate).toDate();
              let bDate = moment(b.createDate).toDate();
              if (aDate == bDate) {
                let aReqNo = a.expenseRequestNo;
                let bReqNo = b.expenseRequestNo;
                if (aReqNo == bReqNo) {
                  return 0;
                } else {
                  return aReqNo > bReqNo ? -1 : 1;
                }
              } else {
                return aDate > bDate ? -1 : 1;
              }
            });
          });
        });
        console.log("_expenseGroup after sort:", JSON.parse(JSON.stringify(_expenseGroup)));
        this.expenseGroup = _expenseGroup;

        this.expenseList = resp;
        this.isLoading = false;
        console.log("expenseList:", resp);
        cb && cb(resp);
      });
  }

  private getExpenseTypeM(expenseTypeCde): any {
    let expenseTypeM = this.expenseTypeList && this.expenseTypeList.find(item => item.expenseCode == expenseTypeCde);
    return expenseTypeM || {};
  }

  private getExpenseTypeDesc(expenseTypeCde): string {
    let nameString: string = (this.getExpenseTypeM(expenseTypeCde) || {}).expenseName || '';
    return (nameString.charAt(0) || "").toUpperCase() + ((nameString || "").slice(1).toLowerCase());
  }

  private isExpenseTypeTransport(expenseTypeCde): boolean {
    return (this.getExpenseTypeM(expenseTypeCde) || {}).expenseCode == "ETM0001";//Transport (MockUp Sample)
  }

  private isExpenseTypeOffice(expenseTypeCde): boolean {
    return (this.getExpenseTypeM(expenseTypeCde) || {}).expenseCode == "ETM0002";//Office (MockUp Sample)
  }

  private isExpenseTypeOvertime(expenseTypeCde): boolean {
    return (this.getExpenseTypeM(expenseTypeCde) || {}).expenseCode == "ETM0003";//Overtime (MockUp Sample)
  }

  private isExpenseTypePhone(expenseTypeCde): boolean {
    return (this.getExpenseTypeM(expenseTypeCde) || {}).expenseCode == "ETM0006";//Phone
  }

  private isExpenseTypeOther(expenseTypeCde): boolean {
    //Other group (Detal Care, Wellness )
    let etm007 = (this.getExpenseTypeM(expenseTypeCde) || {}).expenseCode == "ETM0007";
    let etm008 = (this.getExpenseTypeM(expenseTypeCde) || {}).expenseCode == "ETM0008";
    return etm007 || etm008;
  }
}
