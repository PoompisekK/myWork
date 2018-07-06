import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';
import { AppConstant } from '../../../constants/app-constant';
import { HistoryModel } from '../../model/checkInOut.model';
import { CheckInOutService } from '../../service/checkInOutService';
import { WorkforceService } from '../../service/workforceService';
import { CheckInOut } from '../check-in&out.page/check-in&out.page';

@Component({
    selector: 'check-inout-history-page',
    templateUrl: 'check-in&out-history-page.html'
})
export class CheckInOutHistoryPage implements OnInit {
    private historys: HistoryModel[] = [];
    private historyRecorderDate: any[] = [];
    private currentMonth: Date = new Date();
    private inputSearch: Subject<string> = new Subject();
    constructor(
        public navCtrl: NavController,
        private checkInOutService: CheckInOutService
    ) {

    }
    public ngOnInit() {
        this.getHistory();
        this.inputSearch.debounceTime(AppConstant.APP_DEBOUNCE_SEARCH_TIME).subscribe((res) => {
            console.log("inputSearch :", res);
        });
    }

    private getHistory() {
        this.checkInOutService.getCheckInOutHistory().subscribe((res: HistoryModel[]) => {
            this.historys = res;
            console.log("getCheckInOutHistory :", res);
            this.setListGroup(res);
        }, (err) => {
            console.log(err);
        });
    }

    private listDataMonth = [];
    private setListGroup(_data) {
        let result = [];
        for (let i = 0; i < _data.length; i++) {
            var fromDate = moment(_data[i].recorderDate).format('YYYY-MM');
            if (result.indexOf(fromDate) > -1) continue;
            result.push(fromDate);
        }
        let listMont = {
            date: '',
            dateId: '',
            task: []
        };
        var groupList = [];
        result.forEach(data => {
            listMont = {
                "date": moment(data + '-01').format('MMMM YYYY'),
                "dateId": moment(data + '-01').format('YYYYMM'),
                "task": []
            };
            listMont.task = _data.filter(mItm => moment(mItm.recorderDate).format('MMMM YYYY') == moment(data + '-01').format('MMMM YYYY'));
            groupList.push(listMont);
        });
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
        console.log('groupList : ',groupList);
        this.listDataMonth = groupList;
    }

}
