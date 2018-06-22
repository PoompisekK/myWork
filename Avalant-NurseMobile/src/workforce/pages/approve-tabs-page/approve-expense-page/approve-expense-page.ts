import { Component, forwardRef, Inject } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppConstant } from '../../../../constants/app-constant';
import { AppLoadingService } from '../../../../services/app-loading-service/app-loading.service';
import { ApproveService } from '../../../service/approveService';
import { ExpenseService } from '../../../service/expenseService';
import { ApproveTabPage } from '../approve-tabs-page';

@Component({
  selector: 'approve-expense-page',
  templateUrl: 'approve-expense-page.html',
  animations: [
    AnimateCss.peek()
  ]
})
export class ApproveExpensePage {
  private myApproveTaskList: any[];

  constructor(
    public app: App,
    public navCtrl: NavController,
    public approveService: ApproveService,
    public alertCtrl: AlertController,
    public appLoadingService: AppLoadingService,
    public expenseService: ExpenseService,

    @Inject(forwardRef(() => ApproveTabPage)) public approveTabPage: ApproveTabPage,
  ) {

  }

  private ionViewDidEnter() {
    console.log("ionViewDidEnter");
    this.getTaskList();
  }

  private displayDetail(_taskItem): void {
    if (_taskItem.show == true) {
      _taskItem.show = false;
    } else {
      this.myApproveTaskList && this.myApproveTaskList.forEach((taskItem) => {
        taskItem.show = false;
      });
      _taskItem.show = true;
    }
  }

  private getTaskList(cb?: () => void): void {
    this.approveService.getMyExpenseTaskList()
      .debounceTime(AppConstant.APP_DEBOUNCE_LOADING_TIME).subscribe(resp => {
        this.myApproveTaskList = resp;
        console.log("myApproveTaskList:", this.myApproveTaskList);
        // this.approveTabPage.tabsBadge('approveExpense', (this.myApproveTaskList || []).length);
        cb && cb();
      });
  }

  private doRefresh(refresher) {
    this.appLoadingService.showLoading();
    // this.approveTabPage.tabsBadge('approveExpense', 0);
    // this.getTaskList(() => {
    //   (this.appLoadingService.hideLoading() || new Promise((resolve) => resolve()))
    //     .then(() => {
    //       refresher.complete();
    //       console.log("refresher.complete !!!!");
    //     });
    // });
  }

  private approveThisTask(_taskItemDetail) {
    this.appLoadingService.showLoading();
    let approveParamObj = {
      approveNo: _taskItemDetail.approveNo,
      approveOrderNo: _taskItemDetail.approveOrderNo
    };
    this.expenseService.postApproveExpense(approveParamObj)
      .subscribe((resp: any) => {
        this.appLoadingService.hideLoading().then(() => {
          if (resp.errorMessage || resp.processMessage) {
            let alertPopup = this.alertCtrl.create({
              message: resp.errorMessage || resp.processMessage,
              buttons: ['OK']
            });
            alertPopup.onDidDismiss(() => {
              this.getTaskList();
            });
            alertPopup.present();
          }
        });
      });
  }

  private rejectThisTask(_taskItemDetail) {
    this.appLoadingService.showLoading();
    let rejectParamObj = {
      approveNo: _taskItemDetail.approveNo,
      approveOrderNo: _taskItemDetail.approveOrderNo,
      reason: null,
    };
    this.expenseService.postRejectExpense(rejectParamObj)
      .subscribe((resp: any) => {
        this.appLoadingService.hideLoading().then(() => {
          if (resp.errorMessage || resp.processMessage) {
            let alertPopup = this.alertCtrl.create({
              message: resp.errorMessage || resp.processMessage,
              buttons: ['OK']
            });
            alertPopup.onDidDismiss(() => {
              this.getTaskList();
            });
            alertPopup.present();
          }
        });
      });
  }
}
