import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ModalOptions, NavController } from 'ionic-angular';
import * as moment from 'moment';

import { AnimateCss } from '../../../animations/animate-store';
import { AppState } from '../../../app/app.state';
import { AppConstant } from '../../../constants/app-constant';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../../services/app-services';
import { HCMEAFRestService } from '../../../services/eaf-rest/hcm-eaf-rest.service';
import { HCMApprovalRestService } from '../../../services/userprofile/hcm-approval.service';
import { HCMUserProfileRestService } from '../../../services/userprofile/hcm-userprofile.service';
import { AppAlertService } from '../../service/appAlertService';
import { ApproveService } from '../../service/approveService';
import { LeaveService } from '../../service/leaveService';
import { LeaveDetailPage } from '../leave-page/leave-detail-pages/leave-detail-page';
import { ApproveRejectModalPage } from './approve-reject-modal/approve-reject-modal';
import { EAFContext } from '../../../eaf/eaf-context';
import { HCMShiftRestService } from '../../../services/userprofile/hcm-shift.service';

@Component({
    selector: 'approve-tabs-page',
    templateUrl: 'approve-tabs-page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class ApproveTabPage implements OnInit {

    private type_Leave: string = '';
    private type_shiftSwapAcceptant: string = '';
    private type_shiftSwap: string = '';
    private type_shift: string = '';
    private type_resource: string = '';

    private dataLeave: any;
    private dataShiftSwapAcceptant: any;
    private dataShiftSwap: any;
    private dataShift: any;
    private dataResource: any;

    constructor(
        private hcmApprovalRestService: HCMApprovalRestService,
        private appAlertService: AppAlertService,
        private appLoadingService: AppLoadingService,
        private approveService: ApproveService,
        private alertController: AlertController,
        private appServices: AppServices,
        private leaveService: LeaveService,
        private modalCtrl: ModalController,
        private navCtrl: NavController,
        private hcmUserProfileService: HCMUserProfileRestService,
        private hcmEAFRestService: HCMEAFRestService,
        private appState: AppState,
        private shiftService: HCMShiftRestService,
    ) {
        this.appServices.subscribe(AppConstant.EVENTS_SUBSCRIBE.REJECT_LEAVE, () => {
            this.getSlideTask(this.typeSelect);
        });
    }

    public ngOnInit() {
        this.getApproveLeave();
        this.typeSelect = 'leave';
        this.type_Leave = 'select';

        this.hcmApprovalRestService.getLeaveApprove().subscribe(data => {
            let checkArray = data instanceof Array;
            let listData = [];
            if (data) {
                if (checkArray == true) {
                    this.numLeave = (data || []).length;
                } else {
                    listData.push(data);
                    this.numLeave = (listData || []).length;
                }
            } else {
                this.numLeave = (listData || []).length;
            }

        });
        this.hcmApprovalRestService.getSwapTransactionApprove().subscribe(data => {
            let checkArray = data instanceof Array;
            let listData = [];
            if (data) {
                if (checkArray == true) {
                    data.forEach(element => {
                        if (element.status == 'Waiting For Accept') {
                            listData.push(element);
                        }
                    });
                    this.numShiftSwapAcceptant = (listData || []).length;
                } else {
                    if (data.status == 'Waiting For Accept') {
                        listData.push(data);
                        this.numShiftSwapAcceptant = (listData || []).length;
                    }
                }
            } else {
                this.numShiftSwapAcceptant = (listData || []).length;
            }
        });
        this.hcmApprovalRestService.getShiftApprove().subscribe(data => {
            let checkArray = data instanceof Array;
            let listData = [];
            if (data) {
                if (checkArray == true) {
                    this.numShift = (data || []).length;
                } else {
                    listData.push(data);
                    this.numShift = (listData || []).length;
                }
            } else {
                this.numShift = (listData || []).length;
            }

        });
        this.hcmApprovalRestService.getShiftSwapApprove().subscribe(data => {
            let checkArray = data instanceof Array;
            let listData = [];
            if (data) {
                if (checkArray == true) {
                    listData = data.filter(mItm => mItm.status == 'Waiting Approve');
                    this.numShiftSwap = (listData || []).length;
                } else {
                    if(data.status == 'Waiting Approve') {
                        listData.push(data);
                    }                    
                    this.numShiftSwap = (listData || []).length;
                }
            } else {
                this.numShiftSwap = (listData || []).length;
            }
        });
        // this.hcmApprovalRestService.getResource().subscribe(data => {
        //     let checkArray = data instanceof Array;
        //     let listData = [];
        //     if (data) {
        //         if(checkArray == true) {
        //             this.numResource = (data || []).length;
        //         } else {
        //             listData.push(data);
        //             this.numResource = (listData || []).length;
        //         }
        //     } else {
        //         this.numResource = (listData || []).length;
        //     }
        // });
    }

    private checkID = [];
    private allList = [];

    private doRefresh(refresher) {
        this.appLoadingService.showLoading();
        this.getDisplayApproveList(() => {
            this.appLoadingService.hideLoading().then(() => {
                refresher.complete();
            });
        });
    }
    private isLoading = true;
    private getDisplayApproveList(cb?: () => void) {
        this.isLoading = true;
        this.getSlideTask(this.typeSelect);
        cb && cb();

    }

    private setDate(_fromDate, _toDate?) {
        const fromDate = moment(_fromDate).format('ddd. D');
        const toDate = moment(_toDate).format('ddd. D');
        if (_toDate == null || _toDate == _fromDate) {
            return fromDate;
        } else {
            return fromDate + ' - ' + toDate;
        }
    }

    private checkApproval(_idx, _index, _data?) {
        console.log('data approve : ', _data);
        if (this.checkID[_index][_idx] == true) {
            this.navCtrl.push(LeaveDetailPage, {
                viewMode: true,
                leaveObject: _data,
                dataShift: _data,
                selectType: this.typeSelect,
                isApprover: true
            });
            console.log('selectType : ', this.typeSelect);
            console.log('data approve : ', _data);
            this.checkID[_index][_idx] = false;
        } else {
            for (let i = 0; i < this.checkID.length; i++) {
                if (i == _index) {
                    for (let x = 0; x < this.checkID[_index].length; x++) {
                        if (x == _idx) {
                            this.checkID[i][x] = true;
                        } else {
                            this.checkID[i][x] = false;
                        }
                    }
                } else {
                    for (let x = 0; x < this.checkID[_index].length; x++) {
                        this.checkID[i][x] = false;
                    }
                }
            }
        }
        console.log('checkID : ', this.checkID);
    }

    private typeSelect: string;

    private getSlideTask(_activeIdx) {
        this.isLoading = true;
        switch (_activeIdx) {
            case 'leave': {
                console.log('Leave');
                this.typeSelect = 'leave';
                this.type_Leave = 'select';
                this.type_shiftSwapAcceptant = '';
                this.type_shiftSwap = '';
                this.type_shift = '';
                this.type_resource = '';
                this.checkID = [];
                this.getApproveLeave();
                break;
            }
            case 'shiftSwapAcceptant': {
                console.log('Shift Swap Acceptant');
                this.typeSelect = 'shiftSwapAcceptant';
                this.type_Leave = '';
                this.type_shiftSwapAcceptant = 'select';
                this.type_shiftSwap = '';
                this.type_shift = '';
                this.type_resource = '';
                this.checkID = [];
                this.getShiftSwapAcceptant();
                break;
            }
            case 'shiftSwap': {
                console.log('Shift Swap');
                this.typeSelect = 'shiftSwap';
                this.type_Leave = '';
                this.type_shiftSwapAcceptant = '';
                this.type_shiftSwap = 'select';
                this.type_shift = '';
                this.type_resource = '';
                this.checkID = [];
                this.shiftSwapApprove();
                break;
            }
            case 'shift': {
                console.log('Shift');
                this.typeSelect = 'shift';
                this.type_Leave = '';
                this.type_shiftSwapAcceptant = '';
                this.type_shiftSwap = '';
                this.type_shift = 'select';
                this.type_resource = '';
                this.checkID = [];
                this.getShiftApprove();
                break;
            }
            case 'resource': {
                console.log('resource');
                this.typeSelect = 'resource';
                this.type_Leave = '';
                this.type_shiftSwapAcceptant = '';
                this.type_shiftSwap = '';
                this.type_shift = '';
                this.type_resource = 'select';
                this.checkID = [];
                this.getResource();
                break;
            }
            default:
                console.log('No Case');
                break;
        }
    }

    private numLeave = 0;
    private numShiftSwapAcceptant = 0;
    private numShiftSwap = 0;
    private numShift = 0;
    private numResource = 0;

    private getResource() {
        let listResource = [];
        this.hcmApprovalRestService.getResource().subscribe(data => {
            console.log('Dat Resource : ', data);
            let checkArray = data instanceof Array;
            if (data) {
                if(checkArray == true) {
                    listResource = data;
                } else {
                    listResource.push(data);
                }
            }
            this.numResource = (listResource || []).length;
            this.groupList(listResource || [], 'resource');
        });
    }

    private getApproveLeave() {
        let leaveList = [];
        this.hcmApprovalRestService.getLeaveApprove().subscribe(empDeleteLeave => {
            let checkArray = empDeleteLeave instanceof Array;
            if (empDeleteLeave) {
                if (checkArray == true) {
                    leaveList = empDeleteLeave;
                } else if (checkArray == false) {
                    leaveList.push(empDeleteLeave);
                }
            }
            this.numLeave = (leaveList || []).length;
            this.groupList(leaveList || [], 'leave');
            console.log('data leave approve : ', leaveList);
        });
        // Leave Delegate -----------------------------------------------------------------------
        // this.hcmApprovalRestService.getDelegateLeaveApprove().subscribe(empDeleteLeave => {
        //     this.numLeave = (empDeleteLeave || []).length;
        //     this.groupList(empDeleteLeave || []);
        //     console.log('data leave approve : ', empDeleteLeave);
        // });
    }

    private getShiftSwapAcceptant() {
        let listSwapAcceptant = [];
        this.hcmApprovalRestService.getSwapTransactionApprove().subscribe(data => {
            console.log('data shift swap acceptant approve : ', data);
            let checkArray = data instanceof Array;
            if (data) {
                if (checkArray == true) {
                    data.forEach(element => {
                        if (element.status == 'Waiting For Accept') {
                            listSwapAcceptant.push(element);
                        }
                    });
                    this.numShiftSwapAcceptant = (listSwapAcceptant || []).length;
                } else {
                    if (data.status == 'Waiting For Accept') {
                        listSwapAcceptant.push(data);
                        this.numShiftSwapAcceptant = (listSwapAcceptant || []).length;
                    }
                }
                this.groupList(listSwapAcceptant || [], 'shiftSwapAcceptant');
                console.log('list status is Waiting For Accept : ', listSwapAcceptant);
            } else {
                this.numShiftSwapAcceptant = (listSwapAcceptant || []).length;
                this.groupList(listSwapAcceptant || [], 'shiftSwapAcceptant');
                console.log('list status is Waiting For Accept : ', listSwapAcceptant);
            }

        });
    }

    private getShiftApprove() {
        let listShiftApprove = [];
        this.hcmApprovalRestService.getShiftApprove().subscribe(shiftApprove => {
            let checkArray = shiftApprove instanceof Array;
            if (shiftApprove) {
                if (checkArray == true) {
                    listShiftApprove = shiftApprove;
                } else {
                    listShiftApprove.push(shiftApprove);
                }
            }
            console.log('data shift approve : ', listShiftApprove);
            this.numShift = (listShiftApprove || []).length;
            this.groupList(listShiftApprove || [], 'shift');
        });
    }

    private shiftSwapApprove() {
        let listShiftSwapApprove = [];
        this.hcmApprovalRestService.getShiftSwapApprove().subscribe(shiftSwapApprove => {
            console.log('data shift swap approve : ', shiftSwapApprove);
            let checkArray = shiftSwapApprove instanceof Array;
            if (shiftSwapApprove) {
                if (checkArray == true) {
                    listShiftSwapApprove = shiftSwapApprove.filter(mItm => mItm.status == 'Waiting Approve');
                } else {
                    listShiftSwapApprove.push(shiftSwapApprove);
                }
            }
            this.numShiftSwap = (listShiftSwapApprove || []).length;
            this.groupList(listShiftSwapApprove || [], 'shiftSwap');
        });
    }

    private groupList(_list, _type) {
        var result = [];
        for (let i = 0; i < _list.length; i++) {
            var fromDate = moment(_list[i].requestDate).format('YYYY-MM');
            if (result.indexOf(fromDate) > -1) continue;
            result.push(fromDate);
        }
        console.log(result);
        var groupList = [];
        var groupMonth = {
            "date": '',
            "dateId": '',
            "task": []
        };
        result.forEach(data => {
            groupMonth = {
                "date": moment(data + '-01').format('MMMM YYYY'),
                "dateId": moment(data + '-01').format('YYYYMM'),
                "task": []
            };
            groupMonth.task = _list.filter(mItm => moment(mItm.requestDate).format('MMMM YYYY') == moment(data + '-01').format('MMMM YYYY'));
            groupList.push(groupMonth);
        });
        console.log(groupList);
        groupList.sort((a, b) => {
            const aData = a.dateId;
            const bData = b.dateId;
            if (aData == bData) {
                return 0;
            } else {
                if (aData < bData) {
                    return 1;
                } else {
                    return -1;
                }
            }
        });
        this.allList = groupList;
        console.log('groupListShift : ', this.allList);
        this.checkIdList(this.allList);
        this.selectDataList(this.allList, _type);
    }
    private selectDataList(_data, _type) {
        this.isLoading = false;
        if (_type == 'leave') {
            this.dataLeave = _data;
        } else if (_type == 'shiftSwapAcceptant') {
            this.dataShiftSwapAcceptant = _data;
        } else if (_type == 'shiftSwap') {
            this.dataShiftSwap = _data;
        } else if (_type == 'shift') {
            this.dataShift = _data;
        } else if (_type == 'resource') {
            this.dataResource = _data;
        }
    }

    private checkIdList(_dataCheck) {
        let numID = [];
        _dataCheck.forEach(element => {
            numID = [];
            for (let i = 1; i <= element.task.length; i++) {
                numID.push(false);
            }
            this.checkID.push(numID);
        });
        console.log('this.checkID : ', this.checkID);
    }

    //-------------- approve --------------
    private rejectThisTask(_taskItemDetail: any, _type) {
        this.appLoadingService.showLoading();
        if (this.typeSelect == 'shiftSwapAcceptant') {
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
                    rejectType: this.typeSelect,

                }, modalOpt);
                approveRejectModal.present();
            });
        } else if (this.typeSelect == 'shiftSwap' || this.typeSelect == 'shift' || this.typeSelect == 'leave') {
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
                rejectType: this.typeSelect,

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

}
