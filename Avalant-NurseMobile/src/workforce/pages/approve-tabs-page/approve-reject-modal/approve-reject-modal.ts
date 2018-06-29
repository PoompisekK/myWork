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
import { HCMShiftRestService } from '../../../../services/userprofile/hcm-shift.service';
import { HCMApprovalRestService } from '../../../../services/userprofile/hcm-approval.service';
import { HCMEAFRestService } from '../../../../services/eaf-rest/hcm-eaf-rest.service';

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
        private shiftService: HCMShiftRestService,
        private hcmApprovalRestService: HCMApprovalRestService,
        private hcmEAFRestService: HCMEAFRestService
    ) {

    }
    private textReject = this.hcmTranslationService.translate('M_APPROVEREJECTMODAL.REJECT_REASON', 'Reject Reason');
    private approveType: string;
    public ngOnInit(): void {
        this.dataCreate = this.navParams.get('dataCreate');
        console.log('dataCreate : ', this.dataCreate);
        this.typeCreate = this.navParams.get('typeCreate');
        console.log('typeCreate : ', this.typeCreate);
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
        if (this.approveType == 'approve') {
            if (this.rejectType == 'shiftSwapAcceptant') {
                this.hcmApprovalRestService.updateApproveShiftSwapAcceptant(this.taskItemDetail).subscribe(data => {
                    console.log('return from create : ', data);
                    this.viewCtrl && this.viewCtrl.dismiss();
                    this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.REJECT_LEAVE);
                });
            } else if (this.rejectType == 'shiftSwap' || this.rejectType == 'shift' || this.rejectType == 'leave') {
                this.hcmApprovalRestService.saveApproveShiftSwap('/approve/approve-step', this.taskItemDetail).subscribe(data => {
                    console.log('Data Approve Shift Swap : ', data);
                    this.viewCtrl && this.viewCtrl.dismiss();
                    this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.REJECT_LEAVE);
                });
            } else {
                console.log('> > > No Service < < <');
                this.viewCtrl && this.viewCtrl.dismiss();
                this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.REJECT_LEAVE);
            }
        } else if (this.approveType == 'reject') {
            if (this.rejectType == 'shiftSwapAcceptant') {
                this.hcmApprovalRestService.updateApproveShiftSwapAcceptant(this.taskItemDetail).subscribe(data => {
                    console.log('return from create : ', data);
                    this.viewCtrl && this.viewCtrl.dismiss();
                    this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.REJECT_LEAVE);
                });
            } else if(this.rejectType == 'shiftSwap' || this.rejectType == 'shift' || this.rejectType == 'leave') {
                this.taskItemDetail['reason'] = this.rejectReason;
                this.hcmApprovalRestService.saveRejectShift('/approve/reject-step', this.taskItemDetail).subscribe(data => {
                    console.log('Data Reject Shift : ', data);
                    this.viewCtrl && this.viewCtrl.dismiss();
                    this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.REJECT_LEAVE);
                });
            }else {
                console.log('> > > No Service < < <');
                this.viewCtrl && this.viewCtrl.dismiss();
                this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.REJECT_LEAVE);
            }
        }
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
    private dataCreate: any;
    private typeCreate: string;
    private createTask() {
        if (this.typeCreate == 'createShift') {
            console.log('dataCreate : ', this.dataCreate);
            this.shiftService.saveShift(this.dataCreate).subscribe(data => {
                console.log('return from create : ', data);
            });
            // create ได้แล้วแต่ยัง fix อยู่
            // สร้าง service this.hcmEAFRestService.saveEntityModel ขึ้นมาใหม่ copy จาก this.hcmEAFRestService.saveEntity
        } else if (this.typeCreate == 'createShiftSwap') {
            console.log('CREATE SHIFT SWAP');
        }
        this.viewCtrl && this.viewCtrl.dismiss().then(() => {
            this.appService.publish(AppConstant.EVENTS_SUBSCRIBE.SHIFT_CREATE);
        });
    }
}
