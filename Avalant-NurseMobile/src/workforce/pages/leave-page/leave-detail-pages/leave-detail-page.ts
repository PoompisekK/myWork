import { Component, OnInit } from '@angular/core';
import { ModalController, ModalOptions, NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppLoadingService } from '../../../../services/app-loading-service/app-loading.service';
import { ContsVariables } from '../../../global/contsVariables';
import { LeaveModel } from '../../../model/leave.model';
import { AppAlertService } from '../../../service/appAlertService';
import { LeaveService } from '../../../service/leaveService';
import { ApproveRejectModalPage } from '../../approve-tabs-page/approve-reject-modal/approve-reject-modal';
import { HCMApprovalRestService } from '../../../../services/userprofile/hcm-approval.service';
import { ApproveTabPage } from '../../approve-tabs-page/approve-tabs-page';
import { AppState } from '../../../../app/app.state';
import { HCMShiftRestService } from '../../../../services/userprofile/hcm-shift.service';
import { AppServices } from '../../../../services/app-services';
import { AppConstant } from '../../../../constants/app-constant';

@Component({
    selector: 'leave-detail-page',
    templateUrl: 'leave-detail-page.html',
    styleUrls: ['/leave-detail-page.scss'],
    animations: [
        AnimateCss.peek(),
    ]
})
export class LeaveDetailPage implements OnInit {
    private leave: LeaveModel = new LeaveModel();
    private LEAVE_TYPE = ContsVariables.leaveConst.leaveType;
    private isOtherLeaveType = false;
    private isApprover: boolean = false;
    private isNonProduct: boolean = false;
    private fullDayCheck: string = "";
    private fromDate: string = "";
    private toDate: string = "";
    private requestDate: string = "";
    private requestTime: string = "";
    private SEdate: string = "";

    private select_type: string;

    constructor(
        public navCtrl: NavController,
        private navParams: NavParams,
        private appLoadingService: AppLoadingService,
        private appAlertService: AppAlertService,
        private modalCtrl: ModalController,
        private leaveService: LeaveService,
        private hcmApprovalRestService: HCMApprovalRestService,
        private appState: AppState,
        private shiftService: HCMShiftRestService,
        private viewCtrl: ViewController,
        private appServices: AppServices
    ) {
        this.appServices.subscribe(AppConstant.EVENTS_SUBSCRIBE.REJECT_LEAVE, () => {
            this.viewCtrl && this.viewCtrl.dismiss();
        });
    }
    public selectedRecommendOfficerList: any[] = [];
    private selectedAcknowledgeList: any[] = [];
    public ngOnInit() {
        this.select_type = this.navParams.get("selectType");
        console.log('this.select_type : ', this.select_type)
        if (this.select_type == 'shift' || this.select_type == 'shiftSwap' || this.select_type == 'shiftSwapAcceptant') {
            this.checkTypeShift();
            this.dataShift = this.navParams.get("dataShift");
            this.dataApprove = this.navParams.get("dataApprove");
            this.isApprover = this.navParams.get("isApprover");
            this.isNonProduct = this.navParams.get("isNonProduct");
        } else if (this.select_type == 'leave') {
            this.leave = this.navParams.get("leaveObject");
            this.isApprover = this.navParams.get("isApprover");
            this.isNonProduct = this.navParams.get("isNonProduct");
            console.log("%cleave :" + JSON.stringify(this.leave, null, 2), "background:#FEFBE6;color:#735C2E");
            this.selectedAcknowledgeList = this.leave.acknowledge;
            let matchIdx1 = this.isMatch(this.leave.leaveTypeNo, this.LEAVE_TYPE.sick);
            let matchIdx2 = this.isMatch(this.leave.leaveTypeNo, this.LEAVE_TYPE.business);
            let matchIdx3 = this.isMatch(this.leave.leaveTypeNo, this.LEAVE_TYPE.vacation);
            let matchIdx4 = !(matchIdx1 || matchIdx2 || matchIdx3);
            if (matchIdx4) {
                this.isOtherLeaveType = true;
            }
            if (!this.leave.rejectReason) {
                this.leave.rejectReason = null;
            }

            this.checkFullDay();
            this.displayDateNTime();
        }

        this.getStepApprove();

    }

    private displayDateNTime() {
        if (this.leave.fromDate == this.leave.toDate) {
            this.SEdate = this.dateFormat(this.leave.fromDate);
        } else {
            this.SEdate = this.dateFormat(this.leave.fromDate) + ' - ' + this.dateFormat(this.leave.toDate);
        }
    }

    private dateFormat(_dd: string) {
        return moment(_dd).format("MMM D, YYYY");
    }

    private timeFormat(_tm) {
        if(_tm && _tm.length != 0){
            return moment(_tm).format("HH:mm");
        }else{
            return "";
        }
    }

    private getDisplay(_inp: string) {
        return moment(_inp).format("MMM D, YYYY h:mm");
    }

    private checkNull(_itm) {
        if (_itm == " " || _itm == undefined || _itm.length == 0) {
            return "";
        } else {
            return _itm;
        }
    }

    private checkFullDay() {
        if (this.leave.fullDay == 'N') {
            console.log("Leave Fullday: ", this.leave.fullDay);
            this.fullDayCheck = "No";
        } else {
            this.fullDayCheck = "Yes";
        }
    }
    private lowerCaseCompare(str1: string, str2: string, isUsedIndex?: boolean) {
        str1 = (str1 || '').toLowerCase();
        str2 = (str2 || '').toLowerCase();
        return ((isUsedIndex && ((str1 || '').indexOf(str2) > -1)) || str1 === str2);
    }

    private getStatus(objItm: any, index: number): boolean {
        // return (status || "").toLowerCase() == (compareWith || "").toLowerCase();
        if(objItm){
            if (index == 1) {
                return this.lowerCaseCompare(objItm.status, 'approved');
            } else if (index == 2) {
                return this.lowerCaseCompare(objItm.status, 'waiting for approve', true);
            } else if (index == 3) {
                return this.lowerCaseCompare(objItm.status, 'rejected');
            } else if (index == 4) {
                return this.lowerCaseCompare(objItm.status, 'Waiting For Approval');
            } else if (index == 5) {
                return this.lowerCaseCompare(objItm.status, 'Waiting For Accept');
            } else {
                return false;
            }
        }
    }

    private shiftTimeString: string = "";
    private getDisplayDateFullDayOrShift(_leaveObj: any): string {
        this.shiftTimeString = "";
        if (_leaveObj) {
            const fromDate = moment(_leaveObj.fromDate).format("MMM D, YYYY");
            const toDate = moment(_leaveObj.toDate).format("MMM D, YYYY");
            if (_leaveObj.fullDay == 'N') {
                if (fromDate == toDate) {
                    return fromDate;
                } else {
                    return [fromDate, toDate].join(" to ");
                }
            } else {
                const fDateTime = _leaveObj.fromDate + (_leaveObj.fromTime ? 'T' + _leaveObj.fromTime : '');
                const tDateTime = _leaveObj.toDate + (_leaveObj.toTime ? 'T' + _leaveObj.toTime : '');

                const fromDateString = moment(fDateTime).format("MMM D, YYYY HH:mm a");
                const toDateString = moment(tDateTime).format("MMM D, YYYY HH:mm a");

                if (fromDate != toDate) {
                    this.shiftTimeString = toDateString;
                    return fromDateString + " to ";
                } else {
                    this.shiftTimeString = "(" + (moment(fDateTime).format("HH:mm a")) + " - " + (moment(tDateTime).format("HH:mm a")) + ")";
                    return fromDate;// with shift time;
                }
            }
        } else {
            return null;
        }
    }

    public ionViewDidEnter() {
    }

    public isMatch(_value: string, object: any): boolean {
        return _value == object.code || _value == object.name || _value == object.nameEn || _value == object || ((_value || "").indexOf(object.nameEn) > -1 || (object.nameEn || "").indexOf(_value) > -1);
    }

    private vacation(_leaveObj: any) {
        const date2 = new Date(moment(_leaveObj.toDate).format("MM/DD/YYYY"));
        const date1 = new Date(moment(_leaveObj.fromDate).format("MM/DD/YYYY"));
        const timeDiff = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays + 1;
    }

    private backToApprovePage() {
        this.navCtrl.pop();
    }

    private approveThisTask(_taskItemDetail: any) {
        this.appLoadingService.showLoading();
        let approveParamObj = {
            approveNo: _taskItemDetail.approveNo,
            approveOrderNo: _taskItemDetail.approveOrderNo
        };
        this.leaveService.postApproveLeave(approveParamObj)
            .subscribe((resp: any) => {
                this.appLoadingService.hideLoading().then(() => {
                    let alertOpt: any = {
                        description: resp.errorMessage,
                        // onDidDisMiss: this.getTaskList
                    };
                    this.appAlertService.successAlertPopup(alertOpt).subscribe(() => {
                        console.log("postApproveLeave resp.errorMessage :", resp.errorMessage);
                        this.backToApprovePage();
                    });
                });
            }, (errResp) => {
                this.appLoadingService.hideLoading().then(() => {
                    let alertOpt: any = {
                        description: errResp.errorMessage,
                    };
                    this.appAlertService.errorAlertPopup(alertOpt).subscribe(() => {
                        console.log("postApproveLeave errResp.errorMessage :", errResp.errorMessage);
                        this.backToApprovePage();
                    });
                });
            });
    }    

    private isFileType(fileItm: any, index: number): boolean {
        let fileIx = (fileItm.name || fileItm.fileName || fileItm.documentName);
        if (index == 1 && "log txt text doc ppt xls docx pptx xlsx".indexOf(this.getFileExtension(fileIx)) > -1) {
            return true;
        } else if (index == 2 && "pdf".indexOf(this.getFileExtension(fileIx)) > -1) {
            return true;
        } else if (index == 3 && "png jpg jpeg gif bmp svg".indexOf(this.getFileExtension(fileIx)) > -1) {
            return true;
        } else {
            return false;
        }
    }

    private getFileExtension(filename: string): string {
        return ((/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined || '').toLowerCase();
    }

    private showImageView(_inputFile: any) {
        console.log("showImageView !!!", _inputFile);
    }

    //-----------Shift--------------
    private shiftType: string;
    private dataShift: any;
    private checkTypeShift() {
        if (this.select_type == 'shift') {
            this.shiftType = 'Shift Request';
        } else {
            this.shiftType = 'Shift Swap Request';
        }
    }
    //-----------Approve--------------
    private dataApprove: any;
    private formatDate(_statrD, _endD) {
        if (_statrD == _endD) {
            return moment(_statrD).format('MMM D,YYYY');
        } else {
            return moment(_statrD).format('MMM D,YYYY') + ' - ' + moment(_endD).format('MMM D,YYYY');
        }
    }
    private userApprove: any;
    private getStepApprove() {
        this.hcmApprovalRestService.getApproveStep({ DOCUMENT_NO: (this.leave['leaveNo'] || this.dataShift.swapNo || this.dataShift.shiftReqNo) }).subscribe(data => {
            console.log('Data User Approve : ', data);
            this.userApprove = data;
        });
    }

    public getDisplayDate(_inDateStr: string): string {
        let dateObj = moment(_inDateStr || '', ["DD/MM/YYYY", "YYYY/MM/DD"]);
        if (dateObj.isValid()) {
            return dateObj.format("MMM D,YYYY");
        } else {
            null;
        }
    }

    //----------------------- approve / reject --------------------------
    private rejectThisTask(_type) {
        let _taskItemDetail = this.dataShift;
        this.appLoadingService.showLoading();
        if (this.select_type == 'shiftSwapAcceptant') {
            let dataPositionBoxCode: any;
            this.shiftService.getPositionBoxCode({ EMPLOYEE_CODE: _taskItemDetail.employeeCode }).subscribe(data => {
                this.appLoadingService.hideLoading();
                console.log("model position box code :", data);
                data.forEach(element => {
                    dataPositionBoxCode = element;
                });
                console.log('_taskItemDetail : ', _taskItemDetail);
                this.modelShiftSwapAcceptant.EMPLOYEE_CODE = _taskItemDetail.employeeCode;
                this.modelShiftSwapAcceptant.SHIFT_NAME_CODE = _taskItemDetail.shiftNameCode;
                this.modelShiftSwapAcceptant.SWAP_EMPLOYEE_CODE = _taskItemDetail.swapEmployeeCode;
                this.modelShiftSwapAcceptant.SWAP_NO = _taskItemDetail.swapNo;
                this.modelShiftSwapAcceptant.SWAP_TYPE = _taskItemDetail.swapType;
                this.modelShiftSwapAcceptant.POSITION_BOX_CODE = dataPositionBoxCode.positionBoxCode;
                console.log('MODEL SHIFT SWAP APPROVE : ', this.modelShiftSwapAcceptant);
                if (_type == 'approve') {
                    this.modelShiftSwapAcceptant.STATUS = 'Waiting For Approval';
                } else if (_type == 'reject') {
                    this.modelShiftSwapAcceptant.STATUS = 'Rejected';
                }
                console.log('DATA APPROVE / REJECT : ', this.modelShiftSwapAcceptant);
                const modalOpt: ModalOptions = {};
                modalOpt.cssClass = "reject-modal";
                modalOpt.enableBackdropDismiss = false;
                modalOpt.showBackdrop = false;
                const approveRejectModal = this.modalCtrl.create(ApproveRejectModalPage, {
                    select: _type,
                    taskItemDetail: this.modelShiftSwapAcceptant,
                    rejectType: this.select_type,

                }, modalOpt);
                approveRejectModal.present();
            });
        } else if (this.select_type == 'shiftSwap' || this.select_type == 'shift' || this.select_type == 'leave') {
            this.appLoadingService.hideLoading();
            let addtionalParam = {
                approveFlowNo: _taskItemDetail.approveFlowNo,
                orderNo: _taskItemDetail.orderNo,
                organizationId: this.appState.businessUser.orgId,
                userName: this.appState.businessUser.scmUserName
            };
            console.log('Data Approve : ', addtionalParam);
            const modalOpt: ModalOptions = {};
            modalOpt.cssClass = "reject-modal";
            modalOpt.enableBackdropDismiss = false;
            modalOpt.showBackdrop = false;
            const approveRejectModal = this.modalCtrl.create(ApproveRejectModalPage, {
                select: _type,
                taskItemDetail: addtionalParam,
                rejectType: this.select_type,

            }, modalOpt);
            approveRejectModal.present();
        } else {
            this.appLoadingService.hideLoading();
            console.log('> > > Not Approve < < <');
        }
    }
    private modelShiftSwapAcceptant = {
        EMPLOYEE_CODE: "",
        ORGANIZE_ID: "",
        POSITION_BOX_CODE: "",
        SHIFT_NAME_CODE: "",
        STATUS: "",
        SWAP_EMPLOYEE_CODE: "",
        SWAP_NO: "",
        SWAP_TYPE: ""
    };
    //-----------------------------------------------------------------
}