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

@Component({
    selector: 'shift-page',
    templateUrl: 'shift-page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class ShiftPage implements OnInit {

    private makeShiftSwap = [
        {
            status: 'Waiting For Approval',
            name: 'Angelica Ramos',
            fromDate: '2018-05-12',
            toDate: '2018-05-13',
            fromShift: 'D(07:00) - (15:00)',
            toShift: 'E(15:00) - (07:00)',
            off: 'OFF',
            requestDate: '2018-05-07'
        },
        {
            status: 'Approved',
            name: 'Angelica Ramos',
            fromDate: '2018-06-08',
            toDate: '2018-06-09',
            fromShift: 'D(07:00) - (15:00)',
            toShift: 'E(15:00) - (07:00)',
            requestDate: '2018-06-07'
        },
        {
            status: 'Rejected',
            name: 'Angelica Ramos',
            fromDate: '2018-05-10',
            toDate: '2018-05-11',
            fromShift: 'D(07:00) - (15:00)',
            toShift: 'E(15:00) - (07:00)',
            off: 'OFF',
            requestDate: '2018-05-07'
        }
    ];

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
        this.listShift = this.makeShiftSwap;
        this.selectType(this.shiftType);
    }

    private openCreate() {
        this.navCtrl.push(ShiftCreatePage, {
            shiftType: this.shiftType
        });
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
    private getShift() {
        this.hcmShiftRestService.getShift().subscribe(dataShift => {
            this.isLoading = false;
            this.listShift = dataShift;
            this.groupList();
        });
    }

    private getShiftSwap() {
        this.hcmShiftRestService.getShiftSwap().subscribe(dataShiftSwap => {
            this.isLoading = false;
            this.listShift = dataShiftSwap;
            this.groupList();
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

    private listShift: any; // data start
    private groupListShift = []; // data end
    private groupList() {
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
    }
}
