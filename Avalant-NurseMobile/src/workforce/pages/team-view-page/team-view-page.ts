import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import * as moment from 'moment';

import { AnimateCss } from '../../../animations/animate-store';
import { AppState } from '../../../app/app.state';
import { AssignmentService } from '../../service/assignmentService';
import { CalendarService } from '../../service/calendarService';


@Component({
    selector: 'team-view-page',
    templateUrl: 'team-view-page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class TeamViewPage {
    private viewTitle: string;

    private calendar = {
        mode: 'week',
        currentDate: new Date(),
        dateFormatter: {
            formatMonthViewDay: (date: Date) => {
                return moment(date).format("D");// date.getDate().toString();
            },
            formatMonthViewDayHeader: (date: Date) => {
                return moment(date).format("ddd");// 'testMDH';
            },
            formatMonthViewTitle: (date: Date) => {
                return moment(date).format("MMMM YYYY");// 'testMT';
            },
            // formatWeekViewDayHeader: (date: Date) => {
            // 	return 'testWDH';
            // },
            formatWeekViewTitle: (date: Date) => {
                return moment(date).format("MMMM YYYY");// 'testWT';
            },
            formatWeekViewHourColumn: (date: Date) => {
                return moment(date).format("HH:mm");// 'testWH';
            },
            formatDayViewHourColumn: (date: Date) => {
                return moment(date).format("H:mm");// 'testDH';
            },
            formatDayViewTitle: (date: Date) => {
                return moment(date).format("MMMM YYYY");
            }
        }
    };

    private weekDate: any[]=[];
    private weekDatePrev: any[]=[];
    private weekDateNext: any[]=[];

    constructor(
        private navCtrl: NavController,
        private appState: AppState,
        private nacParam: NavParams,
        private calendarService: CalendarService,   
        private assignmentService: AssignmentService,
    ) {
        this.weekDate = [{
            date: moment().format('ddd'),
            dateNum: moment().format('D')
        },
        {
            date: moment().add(1, 'day').format('ddd'),
            dateNum: moment().add(1, 'day').format('D')
        },
        {
            date: moment().add(2, 'day').format('ddd'),
            dateNum: moment().add(2, 'day').format('D')
        },
        {
            date: moment().add(3, 'day').format('ddd'),
            dateNum: moment().add(3, 'day').format('D')
        },
        {
            date: moment().add(4, 'day').format('ddd'),
            dateNum: moment().add(4, 'day').format('D')
        },
        {
            date: moment().add(5, 'day').format('ddd'),
            dateNum: moment().add(5, 'day').format('D')
        },
        {
            date: moment().add(6, 'day').format('ddd'),
            dateNum: moment().add(6, 'day').format('D')
        }
        ];
        this.weekDatePrev = [{
            date: moment().add(-7, 'day').format('ddd'),
            dateNum: moment().add(-7, 'day').format('D')
        },
        {
            date: moment().add(-6, 'day').format('ddd'),
            dateNum: moment().add(-6, 'day').format('D')
        },
        {
            date: moment().add(-5, 'day').format('ddd'),
            dateNum: moment().add(-5, 'day').format('D')
        },
        {
            date: moment().add(-4, 'day').format('ddd'),
            dateNum: moment().add(-4, 'day').format('D')
        },
        {
            date: moment().add(-3, 'day').format('ddd'),
            dateNum: moment().add(-3, 'day').format('D')
        },
        {
            date: moment().add(-2, 'day').format('ddd'),
            dateNum: moment().add(-2, 'day').format('D')
        },
        {
            date: moment().add(-1, 'day').format('ddd'),
            dateNum: moment().add(-1, 'day').format('D')
        }
        ];
        this.weekDateNext = [{
            date: moment().add(7, 'day').format('ddd'),
            dateNum: moment().add(7, 'day').format('D')
        },
        {
            date: moment().add(8, 'day').format('ddd'),
            dateNum: moment().add(8, 'day').format('D')
        },
        {
            date: moment().add(9, 'day').format('ddd'),
            dateNum: moment().add(9, 'day').format('D')
        },
        {
            date: moment().add(10, 'day').format('ddd'),
            dateNum: moment().add(10, 'day').format('D')
        },
        {
            date: moment().add(11, 'day').format('ddd'),
            dateNum: moment().add(11, 'day').format('D')
        },
        {
            date: moment().add(12, 'day').format('ddd'),
            dateNum: moment().add(12, 'day').format('D')
        },
        {
            date: moment().add(13, 'day').format('ddd'),
            dateNum: moment().add(13, 'day').format('D')
        }
        ];
    }
    @ViewChild(Slides) private slides: Slides;
    private slideChanged() {
        let currentIndex = this.slides.getActiveIndex();
        console.log('Current index is', currentIndex);
    }
    private goToSlide() {
        this.slides.slideTo(1, 500);
    }

    private onTimeSelected(ev) {
        
    }
    
    private onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    private onEventSelected(event){

    }

}
