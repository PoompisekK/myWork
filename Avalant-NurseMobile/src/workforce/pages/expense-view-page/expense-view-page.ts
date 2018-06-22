import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, ModalOptions } from 'ionic-angular';

import { AnimateCss } from '../../../animations/animate-store';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../../services/app-services';
import { ExpenseService } from '../../service/expenseService';
import { ExpenseCreatePage } from '../expense-create-page/expense-create-page';
import { ExpensePage } from '../expense-page/expense-page';
import { ExpenseViewItemDetailPage } from '../expense-view-item-detail-page/expense-view-item-detail-page';
import { AppState } from '../../../app/app.state';
import { ApproveRejectModalPage } from '../approve-tabs-page/approve-reject-modal/approve-reject-modal';
import { AppAlertService } from '../../service/appAlertService';

@Component({
  selector: 'expense-view-page',
  templateUrl: 'expense-view-page.html',
  animations: [
    AnimateCss.peek(),
  ]
})
export class ExpenseViewPage {
  private canUpdateExpense: boolean = false;
  private isApprover: boolean = false;
  private expenseM: any = {};
  private currExpenseDate: any = new Date();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public expenseService: ExpenseService,
    public appAlertService: AppAlertService,
    public appState: AppState,
    public appLoadingService: AppLoadingService,
    public appServices: AppServices,
    public modalCtrl: ModalController,
    public modalController: ModalController,
  ) {

  }

  public ionViewWillEnter() {
    console.clear();
    this.isApprover = this.navParams.get("isApprover");
    this.expenseM = this.navParams.get("expenseObject");
    this.expenseService.getExpenseItemDetail(this.expenseM.expenseRequestNo).subscribe(respDetail => {
      this.expenseM.listExpenseDetail = respDetail["listExpenseDetail"];
    });
    if (this.expenseM && this.expenseM.status == "EXPS0000") {
      this.canUpdateExpense = true;
    }
    console.log("getExpenseItemDetail :", this.expenseM);
  }

  private viewExpenseItemDetail(_expenseItems: any): void {
    // ExpenseViewItemDetailPage
    this.appServices.openModal(ExpenseViewItemDetailPage, { expenseObject: _expenseItems });
  }

  private getImageType(expenseTypeCode: any): string {
    return this.expenseService.getExpenseImageTypeByCode(expenseTypeCode);
  }

  private getExpenseTypeName(_expenseTypeCode: string): string {
    return this.expenseService.getExpenseTypeName(_expenseTypeCode);
  }

  private submitExpense() {
    this.appLoadingService.showLoading();
    const expenseObject = {
      status: "EXPS0001",
      orgId: this.appState.currentOrganizationId,
      organizationId: this.appState.currentOrganizationId,
      expenseRequestNo: this.expenseM["expenseRequestNo"],
    };
    this.expenseService.updateExpenseStatus(expenseObject).subscribe(resp => {
      console.log("updateExpenseStatus:", resp);
      this.appLoadingService.hideLoading().then(() => {
        this.navCtrl.popTo(ExpensePage);
      });
    });
  }

  private addExpenseToDay() {
    this.appServices.openModal(ExpenseCreatePage, { expenseM: this.expenseM, fromDate: this.currExpenseDate, });
  }

  private approveThisTask(_expenseM: any) {
    this.appLoadingService.showLoading();
    let approveParamObj = {
      approveNo: _expenseM.approveNo,
      approveOrderNo: _expenseM.approveOrderNo
    };
    this.expenseService.postApproveExpense(approveParamObj).subscribe((resp: any) => {
      console.log("postApproveLeave resp :", resp);
      this.appLoadingService.hideLoading().then(() => {
        let alertOpt: any = {
          description: resp.errorMessage,
        };
        this.appAlertService.successAlertPopup(alertOpt).subscribe(() => {
          console.log("postApproveLeave resp.errorMessage :", resp.errorMessage);
          this.navCtrl.pop();
        });
      });
    }, (errResp) => {
      this.appLoadingService.hideLoading().then(() => {
        let alertOpt: any = {
          description: errResp.errorMessage,
        };
        this.appAlertService.errorAlertPopup(alertOpt).subscribe(() => {
          console.log("postApproveLeave errResp.errorMessage :", errResp.errorMessage);
        });
      });
    });
  }

  private rejectThisTask(_expenseM: any) {
    const modalOpt: ModalOptions = {};
    modalOpt.cssClass = "reject-modal";
    modalOpt.enableBackdropDismiss = false;
    modalOpt.showBackdrop = false;

    const approveRejectModal = this.modalCtrl.create(ApproveRejectModalPage, {
      "taskItemDetail": _expenseM,
      "rejectType": "expense"
    }, modalOpt);
    approveRejectModal.present();
  }
}
