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
        // this.getDisplayApproveList(() => {
        this.appLoadingService.hideLoading().then(() => {
            this.isLoading = false;
            refresher.complete();
        });
        // });        
    }

    private shiftType = "shiftSwap";
    private Shift_Swap: string;
    private Shift: string;

    public ngOnInit() {
        this.Shift_Swap = 'select';
        this.selectType(this.shiftType);
        this.hcmShiftRestService.getShiftSwap().subscribe(dataShiftSwap => {
            this.numShiftSwap = dataShiftSwap.length;          
        });
        this.hcmShiftRestService.getShift().subscribe(dataShift => {
            this.numShift = dataShift.length;
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
    private selectType(_shift) {
        if (_shift != 'shift') {
            this.shiftType = 'shiftSwap';
            this.Shift = '';
            this.Shift_Swap = 'select';
            this.listShift = [];
            this.groupListShift = [];
            this.isLoading = true;
            this.getShiftSwap();
        } else {
            this.shiftType = 'shift';
            this.Shift = 'select';
            this.Shift_Swap = '';
            this.listShift = [];
            this.groupListShift = [];
            this.isLoading = true;
            this.getShift(); //get data              
        }
    }
    private numShift = 0;
    private numShiftSwap = 0;
    private getShift() {
        this.hcmShiftRestService.getShift().subscribe(dataShift => {
            this.isLoading = false;
            this.listShift = dataShift;
            this.numShift = dataShift.length;
            this.groupList('shift');
        });
    }

    private getShiftSwap() {
        this.hcmShiftRestService.getShiftSwap().subscribe(dataShiftSwap => {
            this.isLoading = false;
            this.listShift = dataShiftSwap;
            this.numShiftSwap = dataShiftSwap.length;
            this.groupList('shiftSwap');
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

    private dataListShift = [];
    private dataListShiftSwap = [];

    private listShift: any; // data start
    private groupListShift = []; // data end
    private groupList(_selectType) {
        var result = [];
        this.listShift.forEach(element => {
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
            groupMonth.task = this.listShift.filter(mItm => moment(mItm.requestDate).format('MMMM YYYY') == moment(data + '-01').format('MMMM YYYY'));
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
        this.groupListShift = groupList;
        console.log('groupListShift : ', this.groupListShift);
        this.selectDataList(this.groupListShift,_selectType);
    }

    private selectDataList(_data,_selectType) {
        if (_selectType == 'shift') {
            this.dataListShift = _data;
        } else {
            this.dataListShiftSwap = _data;
        }
    }
}
