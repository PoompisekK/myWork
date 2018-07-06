import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as moment from 'moment';

import { AnimateCss } from '../../../animations/animate-store';
import { AppState } from '../../../app/app.state';
import { AppConstant } from '../../../constants/app-constant';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../../services/app-services';
import { HCMShiftRestService } from '../../../services/userprofile/hcm-shift.service';
import { LeaveDetailPage } from '../leave-page/leave-detail-pages/leave-detail-page';
import { ShiftCreatePage } from './shift-create-page/shift-create-page';
import { ShiftSwapCreatePage } from './shift-swap-create-page/shift-swap-create-page';

@Component({
    selector: 'shift-page',
    templateUrl: 'shift-page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class ShiftPage implements OnInit {

    constructor(
        public navCtrl: NavController,
        private appLoadingService: AppLoadingService,
        private appState: AppState,
        private hcmShiftRestService: HCMShiftRestService,
        private appService: AppServices,
    ) {
        this.appService.subscribe(AppConstant.EVENTS_SUBSCRIBE.SHIFT_CREATE, () => {
            this.selectType(this.shiftType);
        });
    }
    private currLang: string = this.appState.language;
    private isLoading: boolean = true;
    private doRefresh(refresher) {
        this.isLoading = true;
        this.appLoadingService.showLoading();
        this.selectType(this.shiftType, () => {
            this.appLoadingService.hideLoading().then(() => {
                refresher.complete();
            });
        });
    }

    private shiftType = "shiftSwap";
    private Shift_Swap: string;
    private Shift: string;

    public ngOnInit() {
        this.Shift_Swap = 'select';
        this.selectType(this.shiftType);
        this.hcmShiftRestService.getShiftSwap().subscribe(dataShiftSwap => {
            let numShiftSwapList = [];
            let checkArray = dataShiftSwap instanceof Array;
            if (dataShiftSwap) {
                if (checkArray == true) {
                    dataShiftSwap.forEach(element => {
                        if (element.status == 'Waiting For Approval' || element.status == 'Waiting For Accept') {
                            numShiftSwapList.push(element);
                        }
                    });
                } else {
                    if (dataShiftSwap.status == 'Waiting For Approval' || dataShiftSwap.status == 'Waiting For Accept') {
                        numShiftSwapList.push(dataShiftSwap);
                    }
                }
            }
            this.numShiftSwap = (numShiftSwapList || []).length;
        });
        this.hcmShiftRestService.getShift().subscribe(dataShift => {
            let checkArray = dataShift instanceof Array;
            let numShiftList = [];
            if (dataShift) {
                if (checkArray == true) {
                    dataShift.forEach(element => {
                        if (element.status == 'Waiting For Approval' || element.status == 'Waiting For Accept') {
                            if(element.employeeCode == this.appState.businessUser.employeeCode) {
                                numShiftList.push(element);
                            }
                        }
                    });
                } else {
                    if (dataShift.status == 'Waiting For Approval' || dataShift.status == 'Waiting For Accept') {
                        if(dataShift.employeeCode == this.appState.businessUser.employeeCode) {
                            numShiftList.push(dataShift);
                        }
                    }
                }
            }            
            this.numShift = (numShiftList || []).length;
        });
    }

    public getDisplayDate(_inDateStr: string): string {
        let dateObj = moment(_inDateStr || '', ["DD/MM/YYYY", "YYYY/MM/DD"]);
        if (dateObj.isValid()) {
            return dateObj.format("ddd D");
        } else {
            null;
        }
    }

    public openCreate() {
        if ("shiftSwap".equals(this.shiftType)) {
            this.navCtrl.push(ShiftSwapCreatePage, { shiftType: this.shiftType });
        } else {
            this.navCtrl.push(ShiftCreatePage, { shiftType: this.shiftType });
        }
    }
    private selectType(_shift, cd?) {
        if (_shift != 'shift') {
            this.shiftType = 'shiftSwap';
            this.Shift = '';
            this.Shift_Swap = 'select';
            this.isLoading = true;
            this.getShiftSwap(cd);
        } else {
            this.shiftType = 'shift';
            this.Shift = 'select';
            this.Shift_Swap = '';
            this.isLoading = true;
            this.getShift(cd); //get data              
        }
    }
    private numShift = 0;
    private numShiftSwap = 0;
    private getShift(cd?) {
        this.hcmShiftRestService.getShift().subscribe(dataShift => {
            cd && cd();
            this.isLoading = false;
            let numShiftList = [];
            let dataListUser: any;
            let checkArray = dataShift instanceof Array;
            if (dataShift) {
                if (checkArray == true) {
                    dataShift.forEach(element => {
                        if (element.status == 'Waiting For Approval' || element.status == 'Waiting For Accept') {
                            if(element.employeeCode == this.appState.businessUser.employeeCode) {
                                numShiftList.push(element);
                            }                            
                        }
                        dataListUser = dataShift.filter(mItm => mItm.employeeCode == this.appState.businessUser.employeeCode);
                    });
                } else {
                    if (dataShift.status == 'Waiting For Approval' || dataShift.status == 'Waiting For Accept') {
                        if(dataShift.employeeCode == this.appState.businessUser.employeeCode) {
                            numShiftList.push(dataShift);
                            dataListUser = dataShift;
                        }
                    }
                }
            }            
            this.numShift = (numShiftList || []).length;
            this.groupList('shift', this.groupByApproval(dataListUser || []));
        });
    }

    private getShiftSwap(cd?) {
        this.hcmShiftRestService.getShiftSwap().subscribe(dataShiftSwap => {
            cd && cd();
            this.isLoading = false;
            let numShiftSwapList = [];
            let checkArray = dataShiftSwap instanceof Array;
            if (dataShiftSwap) {
                if (checkArray == true) {
                    dataShiftSwap.forEach(element => {
                        if (element.status == 'Waiting For Approval' || element.status == 'Waiting For Accept') {
                            numShiftSwapList.push(element);
                        }
                    });
                } else {
                    if (dataShiftSwap.status == 'Waiting For Approval' || dataShiftSwap.status == 'Waiting For Accept') {
                        numShiftSwapList.push(dataShiftSwap);
                    }
                }
            }
            this.numShiftSwap = (numShiftSwapList || []).length;
            this.groupList('shiftSwap', this.groupByApproval(dataShiftSwap || []));
        });
    }

    private showDetail(_data?) {
        console.log('Shoe Detail : ', this.shiftType);
        console.log('Data : ', _data);
        this.navCtrl.push(LeaveDetailPage, {
            viewMode: true,
            leaveObject: {},
            dataShift: _data,
            selectType: this.shiftType
        });
    }

    private groupByApproval(_data) {
        let listApprove = [];
        let checkArray = _data instanceof Array;
        if(checkArray == true) {
            _data.forEach(element => {
                if (moment(element.requestDate).format('YYYY-MM') == moment(new Date()).format('YYYY-MM')) {
                    listApprove.push(element);
                } else {
                    if (element.status == 'Waiting For Accept' || element.status == 'Waiting For Approval') {
                        listApprove.push(element);
                    }
                }
            });
        } else {
            if(moment(_data.requestDate).format('YYYY-MM') == moment(new Date()).format('YYYY-MM')) {
                listApprove.push(_data);
            } else {
                if (_data.status == 'Waiting For Accept' || _data.status == 'Waiting For Approval') {
                    listApprove.push(_data);
                }
            }
        }
       
        return listApprove;
    }

    private dataListShift = [];
    private dataListShiftSwap = [];

    private groupList(_selectType, _data) {
        var result = [];
        _data.forEach(element => {
            result.push(moment(element.requestDate).format('YYYY-MM'));
        });
        var uniqueArray = result.filter(function (elem, pos) {
            return result.indexOf(elem) == pos;
        });
        console.log('uniqueArray : ', uniqueArray);
        var groupList = [];
        var groupMonth = {
            "date": '',
            "dateId": '',
            "task": []
        };
        uniqueArray.forEach(data => {
            groupMonth = {
                "date": moment(data + '-01').format('MMMM YYYY'),
                "dateId": moment(data + '-01').format('YYYYMM'),
                "task": []
            };
            groupMonth.task = _data.filter(mItm => moment(mItm.requestDate).format('MMMM YYYY') == moment(data + '-01').format('MMMM YYYY'));
            groupMonth.task.sort((a, b) => {
                const aData = moment(a.requestDate).format('YYYYMMDD');
                const bData = moment(b.requestDate).format('YYYYMMDD');
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
        console.log('groupListShift : ', groupList);
        this.selectDataList(groupList, _selectType);
    }

    private selectDataList(_data, _selectType) {
        if (_selectType == 'shift') {
            this.dataListShift = _data;
        } else {
            this.dataListShiftSwap = _data;
        }
    }
}
