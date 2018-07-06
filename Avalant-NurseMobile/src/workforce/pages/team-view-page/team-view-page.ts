import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import * as moment from 'moment';

import { AnimateCss } from '../../../animations/animate-store';
import { AppState } from '../../../app/app.state';
import { AssignmentService } from '../../service/assignmentService';
import { HCMMicroFlowService } from '../../../services/userprofile/hcm-microflow.service';


@Component({
    selector: 'team-view-page',
    templateUrl: 'team-view-page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class TeamViewPage {
    private viewTitle: string;
    private allWeek: any[] = [];
    private weekDate: any[] = [];
    private empData: any[] = [];
    private mockData: any[] = [];

    constructor(
        private navCtrl: NavController,
        private appState: AppState,
        private assignmentService: AssignmentService,
        private hcmMicroFlowService: HCMMicroFlowService
    ) {

        this.dayCount = new Date(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), 0).getDate();
        this.checkDayInMonth();

        this.mockData = [{
            name: 'Michael',
            id: 'N1234',
            workHr: '160',
            ot: '0',
            rlv: '12',
            task: {
                status: 'D',
                date: '2018-07-01'
            }
        },
        {
            name: 'Gloria',
            id: 'N1234',
            workHr: '176',
            ot: '8',
            rlv: '22',
            task: {
                status: 'E',
                date: '2018-07-04'
            }
        },
        {
            name: 'Jenette',
            id: 'N1234',
            workHr: '176',
            ot: '8',
            rlv: '20',
            task: {
                status: 'N',
                date: '2018-07-06'
            }
        }];
        console.log("Mock Data View: ", this.mockData);

        this.getWorkGroupData(moment().format('MM'), moment().format('YYYY'));
    }


    private wGData: any[] = [];
    private getWorkGroupData(_month, _year) {
        this.empData = [];
        this.hcmMicroFlowService.getWorkGroupSchedule(_month, _year).subscribe((resp) => {
            console.log("responseObjectsMap ; ", resp.responseObjectsMap);
            if (resp.responseObjectsMap && resp.responseObjectsMap.SchedM[0]) {
                console.log("Test getWorkGroupSchedule => ", resp);
                console.log(" getWorkGroupSchedule =>  ", resp.responseObjectsMap.SchedM[0].wGSchedule);
                this.wGData = resp.responseObjectsMap.SchedM[0].wGSchedule;
                console.log(this.wGData.length);

                for (let i = 0; i < this.wGData.length; i++) {
                    this.empData.push({
                        name: this.wGData[i].employee_name,
                        emp_id: this.wGData[i].employee_id,
                        position: this.wGData[i].position,
                        workHr: this.wGData[i].state_name_Pl.working_hour,
                        ot: this.wGData[i].state_name_Pl.ot_hour,
                        rlv: this.wGData[i].state_name_Pl.rlv_adm_hour,
                        status: this.wGData[i].dWork,
                    });
                    // for(let j = 0;j<31;j++){
                    //     let z = 7;
                    //     let wk = this.empData[i].status[z];
                    //     console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ" , wk);
                    // }
                }
                console.log(" AAAAAAAAAAAAAAAAA : ", this.empData[0].status.length);

            }
        });

    }

    private getMonth: any;
    private year: any;
    private month: any;
    private dayCount: any;

    private prevMonth() {
        this.getMonth = moment(this.getMonth).add(-1, "month").toDate();
        this.year = moment(this.getMonth).format('YYYY');
        this.month = moment(this.getMonth).format('MM');
        this.dayCount = new Date(this.year, this.month, 0).getDate();
        this.getWorkGroupData(this.month, this.year);
        this.checkDayInMonth();
        this.slides.slideTo(0, 500);
    }
    private nextMonth() {
        this.getMonth = moment(this.getMonth).add(1, "month").toDate();
        this.year = moment(this.getMonth).format('YYYY');
        this.month = moment(this.getMonth).format('MM');
        this.dayCount = new Date(this.year, this.month, 0).getDate();
        this.getWorkGroupData(this.month, this.year);
        this.checkDayInMonth();
        this.slides.slideTo(0, 500);
    }

    private checkDayInMonth() {
        if (this.dayCount == 31) {
            this.allWeek = [{ week: this.getWeekDate(0) },
            { week: this.getWeekDate(6) },
            { week: this.getWeekDate(12) },
            { week: this.getWeekDate(18) },
            { week: this.getWeekDate(24) },
            {
                week: this.weekDate = [{
                    date: moment(this.getMonth).add(30, 'day').format('ddd'),
                    dateNum: moment(this.getMonth).add(30, 'day').format('D')
                }]
            }];
        } else {
            this.allWeek = [{ week: this.getWeekDate(0) },
            { week: this.getWeekDate(6) },
            { week: this.getWeekDate(12) },
            { week: this.getWeekDate(18) },
            { week: this.getWeekDate(24) }];
        }
    }

    private getDayHeader(wIdx, dIdx) {
        let day = (wIdx * 6) + (dIdx + 1);
        if (this.dayCount == 31) {
            if (day <= 31) { return moment(this.getMonth).set("date", day); }
        } else if (this.dayCount == 30) {
            if (day <= 30) { return moment(this.getMonth).set("date", day); }
        } else if (this.dayCount == 28) {
            if (day <= 28) { return moment(this.getMonth).set("date", day); }
        }
    }
    private getWorkPositionHtml(wIdx, dIdx, dataIdx): string {

        return "<div class='dot-yellow'  >" +21321314+ "</div>";
    }
    private getWorkPosition(wIdx, dIdx, dataIdx) {
        let day = (wIdx * 6) + (dIdx + 1);
        let dateStr = moment(this.getMonth).set("date", day).format("D");

        // let works = this.empData[0];


        // if (works && works.status[parseInt(dateStr)-1] && works.status[parseInt(dateStr)-1].state_nameP[0].day_activityP == (dataIdx && dataIdx.status[parseInt(dateStr)-1].state_nameP[0].day_activityP)) {
        //     return works.status[parseInt(dateStr)-1].state_nameP[0].day_activityP ;
        // } else {
        //     return "";
        // }

        let works = this.empData[2];

        if (works && works.status[parseInt(dateStr) - 1] && works.status[parseInt(dateStr) - 1].state_nameP[0].day_activityP == (dataIdx && dataIdx.status[parseInt(dateStr) - 1].state_nameP[0].day_activityP)) {
            return works.status[parseInt(dateStr) - 1].state_nameP[0].day_activityP;
        } else {
            return "";
        }

    }

    private getWeekDate(_num) {
        return this.weekDate = [{
            date: moment(this.getMonth).add(_num + 0, 'day').format('ddd'),
            dateNum: moment(this.getMonth).add(_num + 0, 'day').format('D')
        },
        {
            date: moment(this.getMonth).add(_num + 1, 'day').format('ddd'),
            dateNum: moment(this.getMonth).add(_num + 1, 'day').format('D')
        },
        {
            date: moment(this.getMonth).add(_num + 2, 'day').format('ddd'),
            dateNum: moment(this.getMonth).add(_num + 2, 'day').format('D')
        },
        {
            date: moment(this.getMonth).add(_num + 3, 'day').format('ddd'),
            dateNum: moment(this.getMonth).add(_num + 3, 'day').format('D')
        },
        {
            date: moment(this.getMonth).add(_num + 4, 'day').format('ddd'),
            dateNum: moment(this.getMonth).add(_num + 4, 'day').format('D')
        },
        {
            date: moment(this.getMonth).add(_num + 5, 'day').format('ddd'),
            dateNum: moment(this.getMonth).add(_num + 5, 'day').format('D')
        }];

    }

    @ViewChild(Slides) private slides: Slides;
    private slideChanged() {
        let currentIndex = this.slides.getActiveIndex();
    }
    private goToSlide() {
        this.slides.slideTo(1, 500);
    }

    private onTimeSelected(ev) {

    }

    private onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    private onEventSelected(event) {

    }
}
