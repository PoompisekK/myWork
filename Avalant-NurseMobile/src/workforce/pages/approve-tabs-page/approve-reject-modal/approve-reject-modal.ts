import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppConstant } from '../../../../constants/app-constant';
import { AppLoadingService } from '../../../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../../../services/app-services';
import { HCMTranslationService } from '../../../modules/hcm-translation.service';
import { AppAlertService } from '../../../service/appAlertService';
import { ApproveService } from '../../../service/approveService';
import { ExpenseService } from '../../../service/expenseService';
import { LeaveService } from '../../../service/leaveService';

@Component({
    selector: 'approve-reject-modal',
    templateUrl: 'approve-reject-modal.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class ApproveRejectModalPage implements OnInit {
    private rejectReason: string;
    private rejectType: string;
    private taskItemDetail: any = {};
    constructor(
        private appAlertService: AppAlertService,
        private appLoadingService: AppLoadingService,
        private approveService: ApproveService,
        private appServices: AppServices,
        private leaveService: LeaveService,
        private navCtrl: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private expenseService: ExpenseService,
        private hcmTranslationService: HCMTranslationService,
        private appService: AppServices,
    ) {

    }
    private textReject = this.hcmTranslationService.translate('M_APPROVEREJECTMODAL.REJECT_REASON','Reject Reason');
    private approveType: string;
    public ngOnInit(): void {
        this.approveType = this.navParams.get('select');
        console.log('TYPE : ', this.approveType);
        this.taskItemDetail = this.navParams.get("taskItemDetail");
        this.rejectType = this.navParams.get("rejectType");
        console.log("taskItemDetail :", this.taskItemDetail);
        console.log("rejectType :", this.rejectType);
    }

    private isEmptyRejectReason(): boolean {
        return !this.rejectReason || this.rejectReason == "" || (this.rejectReason || '').trim().length == 0;
    }

    private doReject() {
        const _taskItemDetail = this.taskItemDetail;
        let rejectParamObj = {
            approveNo: _taskItemDetail.approveNo,
            approveOrderNo: _taskItemDetail.approveOrderNo,
            reason: this.rejectReason
        };
        console.log("rejectParamObj :", rejectParamObj);
        this.appLoadingService.showLoading();

        let serviceLeaveOrExpense = null;
        if ("leave".equals(this.rejectType)) {
            serviceLeaveOrExpense = this.leaveService.postRejectLeave(rejectParamObj);
            console.log("leaveService.postRejectLeave");
        } else if ("expense".equals(this.rejectType)) {
            serviceLeaveOrExpense = this.expenseService.postRejectExpense(rejectParamObj);
            console.log("expenseService.postRejectLeave");
        }
        if (serviceLeaveOrExpense) {
            serviceLeaveOrExpense.subscribe((resp: any) => {
                this.appLoadingService.hideLoading().then(() => {
                    let alertOpt: any = {
                        description: resp.errorMessage,
                        // onDidDisMiss: this.getLeaveTaskList()
                    };
                    this.appAlertService.successAlertPopup(alertOpt).subscribe(() => {
                        console.log("postRejectLeave resp.errorMessage :", resp.errorMessage);
                        this.viewCtrl && this.viewCtrl.dismiss();
                        this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.REJECT_LEAVE);
                    });
                });
            }, (errResp) => {
                this.appLoadingService.hideLoading().then(() => {
                    let alertOpt: any = {
                        description: errResp.errorMessage,
                    };
                    this.appAlertService.errorAlertPopup(alertOpt).subscribe(() => {
                        console.log("postRejectLeave errResp.errorMessage :", errResp.errorMessage);
                    });
                });
            });
        }
    }

    private checkApproveLeave() {
        // if ("leave".equals(this.rejectType)) {
        //   if (this.approveType == 'approve') {
        //     this.approveThisTask();
        //     console.log('APPROVE');
        //   } else if (this.approveType == 'reject') {
        //     this.doReject();
        //     console.log('REJECT');
        //   }
        // } else {
        console.log('No Service');
        this.viewCtrl && this.viewCtrl.dismiss();
        this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.REJECT_LEAVE);
        // }
    }

    private approveThisTask() {
        this.appLoadingService.showLoading();
        let approveParamObj = {
            approveNo: this.taskItemDetail.approveNo,
            approveOrderNo: this.taskItemDetail.approveOrderNo
        };
        let serviceLeaveOrExpense = null;
        if ("leave".equals(this.rejectType)) {
            serviceLeaveOrExpense = this.leaveService.postApproveLeave(approveParamObj);
            console.log("leaveService.postApproveLeave");
        } else if ("expense".equals(this.rejectType)) {
            serviceLeaveOrExpense = this.expenseService.postApproveExpense(approveParamObj);
            console.log("expenseService.postApproveLeave");
        } else {
            console.error("this.currentTaskDisplay :", this.rejectType);
        }
        if (serviceLeaveOrExpense) {
            serviceLeaveOrExpense.subscribe((resp: any) => {
                this.appLoadingService.hideLoading().then(() => {
                    let alertOpt: any = {
                        description: resp.errorMessage,
                        // onDidDisMiss: this.getTaskList
                    };
                    this.appAlertService.successAlertPopup(alertOpt).subscribe(() => {
                        console.log("postApproveLeave resp.errorMessage :", resp.errorMessage);
                        this.viewCtrl && this.viewCtrl.dismiss();
                        this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.REJECT_LEAVE);
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
    }

    private closeModal() {
        this.viewCtrl && this.viewCtrl.dismiss().then(() => {
            this.appService.publish(AppConstant.EVENTS_SUBSCRIBE.SHIFT_CREATE);
        });
    }
}
