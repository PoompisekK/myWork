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

@Component({
    selector: 'approve-tabs-page',
    templateUrl: 'approve-tabs-page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class ApproveTabPage implements OnInit {

    private makeApprove = [
        {
            ListAttachFile: [],
            approveNo: "AF0000010792",
            approveOrderNo: "20",
            empCode: "00008",
            empName: "Akanit Bhaholpolbhayuhasena",
            fromDate: "2018-05-01",
            fromTime: "08:00:00",
            fullDay: "N",
            leaveDays: 1,
            leaveHours: 0,
            leaveReason: "ปวดหัว เป็นไข้",
            leaveStatus: "Waiting Approve",
            leaveType: "Sick Leave",
            period: "Half Day",
            shiftName: "General Shift",
            toDate: "2018-05-01",
            toTime: "10:00:00",
            urgentRequest: "Y",
            year: "2018",
            requestDate: '2018-04-30'
        },
        {
            ListAttachFile: [],
            approveNo: "AF0000010792",
            approveOrderNo: "20",
            empCode: "00008",
            empName: "Akanit Bhaholpolbhayuhasena",
            fromDate: "2018-05-02",
            fromTime: "08:00:00",
            fullDay: "N",
            leaveDays: 1,
            leaveHours: 0,
            leaveReason: "zjkayo86f",
            leaveStatus: "Waiting Approve",
            leaveType: "Sick Leave",
            period: "Half Day",
            shiftName: "General Shift",
            toDate: "2018-05-02",
            toTime: "10:00:00",
            urgentRequest: "Y",
            year: "2018",
            requestDate: '2018-05-01'
        },
        {
            ListAttachFile: [],
            approveNo: "AF0000010793",
            approveOrderNo: "20",
            empCode: "00008",
            empName: "Akanit Bhaholpolbhayuhasena",
            fromDate: "2018-04-01",
            fromTime: "08:00:00",
            fullDay: "N",
            leaveDays: 1,
            leaveHours: 0,
            leaveReason: "ท้องเสีย",
            leaveStatus: "Waiting Approve",
            leaveType: "Sick Leave",
            period: "Half Day",
            shiftName: "General Shift",
            toDate: "2018-04-01",
            toTime: "10:00:00",
            urgentRequest: "Y",
            year: "2018",
            requestDate: '2018-03-30'
        }
    ];
    private makeShiftSwapAcceptant = [
        {
            name: 'Angelica Ramos',
            fromDate: '2018-06-09',
            fromShift: 'D(07:00 - 15:00)',
            toDate: '2018-06-09',
            toShift: 'E(15:00 - 23:00)',
            status: 'nooff',
            requestDate: '2018-06-08'
        },
        {
            name: 'Angelica Ramos',
            fromDate: '2018-05-10',
            fromShift: 'D(07:00 - 15:00)',
            toDate: '2018-05-10',
            toShift: 'E(15:00 - 23:00)',
            status: 'off',
            requestDate: '2018-05-08'
        },
        {
            name: 'Angelica Ramos',
            fromDate: '2018-05-11',
            fromShift: 'D(07:00 - 15:00)',
            toDate: '2018-05-11',
            toShift: 'E(15:00 - 23:00)',
            status: 'no',
            requestDate: '2018-05-08'
        }
    ];
    private makeShiftSwap = [
        {
            fromname: 'Angelica Ramos',
            toname: 'Robert Thingnongnai',
            fromDate: '2018-06-09',
            fromShift: 'D(07:00 - 15:00)',
            toDate: '2018-06-9',
            toShift: 'E(15:00 - 23:00)',
            status: 'nooff',
            requestDate: '2018-06-08'
        },
        {
            fromname: 'Angelica Ramos',
            toname: 'Robert Thingnongnai',
            fromDate: '2018-06-10',
            fromShift: 'D(07:00 - 15:00)',
            toDate: '2018-06-10',
            toShift: 'E(15:00 - 23:00)',
            status: 'off',
            requestDate: '2018-05-08'
        },
        {
            fromname: 'Angelica Ramos',
            toname: 'Robert Thingnongnai',
            fromDate: '2018-05-10',
            fromShift: 'D(23:00 - 07:00)',
            toDate: '2018-05-10',
            toShift: 'E(07:00 - 15:00)',
            status: 'nooff',
            requestDate: '2018-04-08'
        }
    ];
    private makeShift = [
        {
            name: 'Angelica Ramos',
            zoneA: 'Zone A',
            zoneB: 'Zone B',
            shift: 'E(07:00 - 15:00)',
            fromDate: '2018-05-10',
            requestDate: '2018-05-08'
        },
        {
            name: 'Angelica Ramos',
            zoneA: 'Zone A',
            zoneB: 'Zone B',
            shift: 'D(23:00 - 07:00)',
            fromDate: '2018-06-10',
            requestDate: '2018-06-08'
        }
    ];

    private type_Leave: string = '';
    private type_shiftSwapAcceptant: string = '';
    private type_shiftSwap: string = '';
    private type_shift: string = '';
    private type_Resource: string = '';

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
    ) {
        this.appServices.subscribe(AppConstant.EVENTS_SUBSCRIBE.REJECT_LEAVE, () => {
            this.getSlideTask(this.typeSelect);
        });
    }

    public ngOnInit() {
        this.getApproveLeave();
        this.typeSelect = 'leave';
        this.type_Leave = 'select';
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

    private rejectThisTask(_taskItemDetail: any, _type) {
        console.log('_taskItemDetail : ', _taskItemDetail);
        const modalOpt: ModalOptions = {};
        modalOpt.cssClass = "reject-modal";
        modalOpt.enableBackdropDismiss = false;
        modalOpt.showBackdrop = false;
        const approveRejectModal = this.modalCtrl.create(ApproveRejectModalPage, {
            select: _type,
            "taskItemDetail": _taskItemDetail,
            "rejectType": this.typeSelect
        }, modalOpt);
        approveRejectModal.present();
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
                this.type_Resource = '';
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
                this.type_Resource = '';
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
                this.type_Resource = '';
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
                this.type_Resource = '';
                this.checkID = [];
                this.getShiftApprove();
                break;
            }
            default:
                break;
        }
    }

    private numLeave = 0;
    private numShiftSwapAcceptant = 0;
    private numShiftSwap = 0;
    private numShift = 0;

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
            this.groupList(leaveList || []);
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
                    (data || []).forEach(element => {
                        if (element.status == 'Waiting For Accept' || element.status == 'Waiting For Approval') {
                            listSwapAcceptant.push(element);
                        };
                    });
                } else {
                    if (data.status == 'Waiting For Accept') {
                        listSwapAcceptant.push(data);
                    }
                }
            }
            this.numShiftSwapAcceptant = (listSwapAcceptant || []).length;
            this.groupList(listSwapAcceptant || []);
            console.log('list status is Waiting For Accept : ', listSwapAcceptant);
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
            this.groupList(listShiftApprove || []);
        });
    }

    private shiftSwapApprove() {
        let listShiftSwapApprove = [];
        this.hcmApprovalRestService.getShiftSwapApprove().subscribe(shiftSwapApprove => {
            console.log('data shift swap approve : ', shiftSwapApprove);
            let checkArray = shiftSwapApprove instanceof Array;
            if (shiftSwapApprove) {
                if(checkArray == true) {
                    listShiftSwapApprove = shiftSwapApprove;
                } else {
                    listShiftSwapApprove.push(shiftSwapApprove);
                }                
            }
            this.numShiftSwap = (listShiftSwapApprove || []).length;
            this.groupList(listShiftSwapApprove || []);
        });
    }

    private groupList(_list) {
        this.isLoading = false;
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
}
