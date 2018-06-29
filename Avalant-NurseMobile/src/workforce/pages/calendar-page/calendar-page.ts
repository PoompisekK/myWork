import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, PopoverController, PopoverOptions, Slides } from 'ionic-angular';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import * as moment from 'moment';

import { AnimateCss } from '../../../animations/animate-store';
import { AppConstant } from '../../../constants/app-constant';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../../services/app-services';
import { EventModel } from '../../model/event.model';
import { AssignmentService, ObjectGroupDataM } from '../../service/assignmentService';
import { CalendarService } from '../../service/calendarService';
import { WorkforceService } from '../../service/workforceService';
import {
    AssignmentCreateEventPage,
} from '../assignment-page/assignment-event-pages/assignment-createEvent-page/assignment-createEvent-page';
import {
    AssignmentViewEventPage,
} from '../assignment-page/assignment-event-pages/assignment-viewEvent-page/assignment-viewEvent-page';
import {
    MeetingCreateEventPage,
} from '../meeting-page/meeting-event-pages/meeting-createEvent-page/meeting-createEvent-page';
import { CalendarViewEventPage } from './calendar-event-pages/calendar-viewEvent-page/calendar-viewEvent-page';
import { MeetingViewEventPage } from '../meeting-page/meeting-event-pages/meeting-viewEvent-page/meeting-viewEvent-page';
import { SelectOptionsListPopoverPage } from '../../components/select-popover/select-option.popover';
import { LeaveCreateDetailPage } from '../leave-page/leave-createDetail-pages/leave-createDetail-page';
import { ShiftCreatePage } from '../shift-page/shift-create-page/shift-create-page';

@Component({
    selector: 'calendar-page',
    templateUrl: 'calendar-page.html',
    animations: [
        AnimateCss.peek(500)
    ]
})
export class CalendarPage {

    private viewingMonth: Date = new Date();

    private eventSource: any[] = [];
    private groupCalendarList: ObjectGroupDataM[] = [];
    private viewTitle;
    private KEY_MONTH: string = "month";
    private KEY_WEEK: string = "week";
    private KEY_DAY: string = "day";

    private monthActive: boolean = true;
    private weekActive: boolean = false;
    private dayActive: boolean = false;

    private isToday: boolean;
    private focusDate: any = new Date();
    private calendarCfg = {
        mode: this.KEY_MONTH,
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

    @ViewChild(CalendarComponent) private myCalendar: CalendarComponent;
    private isLoading: boolean = true;

    private seqIndx = 0;
    constructor(
        public navCtrl: NavController,
        private workforceService: WorkforceService,
        private calendarService: CalendarService,
        private assignmentService: AssignmentService,
        private appLoadingService: AppLoadingService,
        private appServices: AppServices,
        private popoverCtrl: PopoverController,
        private zone: NgZone
    ) {
        console.log("CalendarPage constructor seqIndx : " + (this.seqIndx++));
    }

    public ionViewDidEnter() {
        console.log("CalendarPage ionViewDidEnter seqIndx : " + (this.seqIndx++));
        this.getEventsMonth();

        setTimeout(() => {
            this.eventSource = [
                {
                    title:"Test 01",
                    status: "Waiting for Approve",
                    startTime: new Date(moment('080000', "HHmmss").add(-2, 'days').format("YYYY/MM/DD H:mm:ss")),
                    endTime: new Date(moment('150000', "HHmmss").add(-2, 'days').format("YYYY/MM/DD H:mm:ss")),
                    color: 'black',
                },
                {
                    title:"Test 02",
                    status: "Approved",
                    startTime: new Date(moment('150000', "HHmmss").add(-2, 'days').format("YYYY/MM/DD H:mm:ss")),
                    endTime: new Date(moment('210000', "HHmmss").add(-2, 'days').format("YYYY/MM/DD H:mm:ss")),
                    color: 'black',
                },
                {
                    title:"Test 03",
                    status: "Waiting for Approve",
                    startTime: new Date(moment('080000', "HHmmss").add(1, 'days').format("YYYY/MM/DD H:mm:ss")),
                    endTime: new Date(moment('160000', "HHmmss").add(1, 'days').format("YYYY/MM/DD H:mm:ss")),
                    color: 'black',
                },
                {
                    title:"Test 04",
                    status: "Waiting for Approve",
                    startTime: new Date(moment('080000', "HHmmss").add(2, 'days').format("YYYY/MM/DD H:mm:ss")),
                    endTime: new Date(moment('160000', "HHmmss").add(2, 'days').format("YYYY/MM/DD H:mm:ss")),
                    color: 'black',
                },
                {
                    title:"Test 04",
                    status: "Waiting for Approve",
                    startTime: new Date(moment('150000', "HHmmss").add(0, 'days').format("YYYY/MM/DD H:mm:ss")),
                    endTime: new Date(moment('210000', "HHmmss").add(0, 'days').format("YYYY/MM/DD H:mm:ss")),
                    color: 'black',
                },
            ];
            console.log("eventSource : ", this.eventSource);
        }, 3000);
    }

    private doRefresh(refresher) {
        this.appLoadingService.showLoading();
        this.getEventsMonth(() => {
            refresher.complete();
        });
    }
    private calendarDayAddTask() {
        console.log("CalendarPage calendarDayAddTask seqIndx : " + (this.seqIndx++));
        console.log("--calendarDayAddTask--");
        const popoverOpt: PopoverOptions = {};
        popoverOpt.cssClass = "custom-popover";
        popoverOpt.showBackdrop = true;
        const settingOpt = [
            { code: '1', name: 'Create Leave' },
            { code: '2', name: "Create Shift" },
        ];
        const popover = this.popoverCtrl.create(SelectOptionsListPopoverPage, settingOpt, popoverOpt);
        popover.present();
        popover.onWillDismiss(resp => {
            switch (resp) {
                case '1': this.createShift();
                    break;
                case '2': this.createLeave();
                    break;
                default:
                    console.warn("no anything to do");
                    break;
            }
        });
    }

    @ViewChild("slidesDayView") private slidesDayView: Slides;
    private daySlides: any[] = [];

    private firstLoad = true;
    private initSlideDayView() {
        console.log("CalendarPage initSlideDayView seqIndx : " + (this.seqIndx++));
        this.daySlides = [{
            "viewingMonth": moment(this.viewingMonth).add(-1, "days").toDate(),
            "groupCalendarList": [],
        }, {
            "viewingMonth": moment(this.viewingMonth).toDate(),
            "groupCalendarList": this.groupCalendarList,
        }, {
            "viewingMonth": moment(this.viewingMonth).add(1, "days").toDate(),
            "groupCalendarList": [],
        }];
        this.toGroupDate(moment(this.viewingMonth).add(-1, "days").toDate());
        this.toGroupDate(moment(this.viewingMonth).add(1, "days").toDate());

        this.firstLoad = true;
    }
    private loadPrev() {
        console.log("CalendarPage loadPrev seqIndx : " + (this.seqIndx++));
        let newIndex = this.slidesDayView.getActiveIndex();
        let firstDay = this.daySlides && this.daySlides[0].viewingMonth;
        let prevDate = moment(firstDay).add(-1, "days").toDate();
        this.daySlides.unshift({
            "keyDate": moment(prevDate).format("YYYY-MM-DD"),
            "viewingMonth": prevDate,
            "groupCalendarList": [],
        });
        this.toGroupDate(prevDate, firstDay);
        this.daySlides.pop();
        this.slidesDayView.slideTo(newIndex + 1, 0, false);// Workaround to make it work: breaks the animation
    }
    private loadNext() {
        console.log("CalendarPage loadNext seqIndx : " + (this.seqIndx++));
        if (this.firstLoad) { // Since the initial slide is 1, prevent the first movement to modify the slides
            this.firstLoad = false;
            return;
        }
        let newIndex = this.slidesDayView.getActiveIndex();
        let indx = (this.daySlides || []).length > 0 ? (this.daySlides || []).length - 1 : (this.daySlides || []).length;
        let lastDay = this.daySlides[indx].viewingMonth;
        let nextDate = moment(lastDay).add(1, "days").toDate();
        this.daySlides.push({
            "keyDate": moment(nextDate).format("YYYY-MM-DD"),
            "viewingMonth": nextDate,
            "groupCalendarList": [],
        });
        this.toGroupDate(nextDate, lastDay);
        this.daySlides.shift();
        this.slidesDayView.slideTo(newIndex - 1, 0, false);// Workaround to make it work: breaks the animation
    }

    private toGroupDate(_date, _dateM?) {
        console.log("CalendarPage toGroupDate seqIndx : " + (this.seqIndx++));
        const selectedDate = moment(_date).format("YYYY-MM-DD");
        this.calendarService.getCalendarDay(selectedDate).toPromise()
            .then((resp) => {
                const _calendars = this.assignmentService.collapsedToGroup(resp);
                // this.groupCalendarList = _calendars;
                let dayResult = this.daySlides.find(itm => itm.keyDate == selectedDate);
                if (dayResult) {
                    dayResult.groupCalendarList = _calendars;
                    console.log("dayResult[" + selectedDate + "] groupCalendarList:", _calendars);
                    this.viewTitle = moment(_dateM).format("MMMM YYYY");
                }
            });
    }

    private getCalendar(_startDate?: Date): Promise<{ events: any[], groupCalendars: any[] }> {
        console.log("CalendarPage getCalendar seqIndx : " + (this.seqIndx++));
        const toDateUCT = (_date: Date) => {
            return new Date(Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate()));
        };

        return new Promise((resolve, reject) => {
            let calendarEvents = [];
            let currentDate = _startDate || this.calendarCfg.currentDate;
            let startDate = moment(currentDate).format("YYYY-MM-DD");
            this.calendarService.getCalendar(startDate)
                .debounceTime(AppConstant.APP_DEBOUNCE_LOADING_TIME).subscribe((res) => {
                    console.log("getCalendar :", res);

                    const _calendars = this.assignmentService.collapsedToGroup(res);
                    console.log("groupCalendarList :", this.groupCalendarList);

                    (res || []).forEach((element) => {
                        let startDateTime: Date = new Date(element.startDate + "T" + element.startTime),
                            endDateTime: Date = new Date(element.targetDate + "T" + element.targetTime);

                        startDateTime = toDateUCT(startDateTime);
                        endDateTime = toDateUCT(endDateTime);

                        calendarEvents.push({
                            // title: element.topicDesc,
                            "startTime": startDateTime,
                            "endTime": endDateTime,
                            "allDay": false
                        });
                    });

                    this.appLoadingService.hideLoading().then(() => {
                        resolve({
                            events: calendarEvents,
                            groupCalendars: _calendars
                        });
                    });
                }, (err) => {
                    this.appLoadingService.hideLoading().then(() => {
                        console.error("err :", err);
                        reject({
                            events: calendarEvents || [],
                            group: []
                        });
                    });
                });
        });
    }

    private changeMode(switchToMode: string) {
        console.log("CalendarPage changeMode seqIndx : " + (this.seqIndx++));
        const CONST_MODE = {
            "M": this.KEY_MONTH,
            "W": this.KEY_WEEK,
            "D": this.KEY_DAY,
        };
        console.log("switchToMode :", switchToMode, "=>", CONST_MODE[switchToMode]);
        this.calendarCfg.mode = CONST_MODE[switchToMode];
        console.log("this.calendar.mode :", this.calendarCfg);
        this.monthActive = this.KEY_MONTH == this.calendarCfg.mode;
        this.weekActive = this.KEY_WEEK == this.calendarCfg.mode;
        this.dayActive = this.KEY_DAY == this.calendarCfg.mode;

        // this.focusDate = this.calendarCfg.currentDate;		
        this.loadCalendarView(this.calendarCfg.mode);
        // this.dayActive && this.initSlideDayView();		
    }

    private loadCalendarView(_viewMode: string) {
        console.log("CalendarPage loadCalendarView seqIndx : " + (this.seqIndx++));
        console.log("loadCalendarView:", _viewMode);
        // if (this.calendarCfg.mode == this.KEY_MONTH) {
        // 	this.getEventsMonth();
        // } else if (this.calendarCfg.mode == this.KEY_DAY) {
        // 	this.getEventsMonth();
        // }
        this.loadCalendarByDate(this.focusDate);
    }
    private loadCalendarByDate(_date: Date | string) {
        console.log("CalendarPage loadCalendarByDate seqIndx : " + (this.seqIndx++));
        console.log("loadCalendarByDate :", _date);
        const selectedDate = moment(_date).format("YYYY-MM-DD");
        this.calendarService.getCalendarDay(selectedDate).toPromise()
            .then((resp) => {
                console.log("getCalendarDay :", resp);
                const _calendars = this.assignmentService.collapsedToGroup(resp);
                this.groupCalendarList = _calendars;
                this.isLoading = false;
                console.log("groupCalendarList :", this.groupCalendarList);

                this.dayActive && this.initSlideDayView();
            });

    }
    private getDayItm(_view: any, _row: any, _col: any): any {
        return _view.dates[_row * 7 + _col];
    }

    private toString(_any: any): string {
        return JSON.stringify(_any || {});
    }

    private selectDateTime: Date = null;

    private onTimeSelected(ev) {
        console.log('onTimeSelected : ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
        this.focusDate = ev.selectedTime;
        if (this.selectDateTime != ev.selectedTime) {
            this.selectDateTime = ev.selectedTime;
            this.viewingMonth = this.selectDateTime;
            if (this.monthActive) {
                console.log("this.monthActive :", this.monthActive);
                const selectedDate = moment(ev.selectedTime).format("YYYY-MM-DD");
                this.calendarService.getCalendarDay(selectedDate).toPromise()
                    .then((resp) => {
                        console.log("getCalendarDay :", resp);
                        const _calendars = this.assignmentService.collapsedToGroup(resp);
                        this.groupCalendarList = _calendars;
                        this.isLoading = false;
                        console.log("groupCalendarList :", this.groupCalendarList);
                    });
            } else {
                console.log("this.weekActive :", !this.monthActive);
            }
        }
    }

    private getEventsMonth(cb?: () => void): void {
        console.log("CalendarPage getEventsMonth seqIndx : " + (this.seqIndx++));
        this.viewingMonth = this.viewingMonth || new Date();
        this.getCalendar(this.firstDayMonth(this.viewingMonth)).then((_events) => {
            console.log("this.getCalendar _events: " , _events);
            this.eventSource = _events.events;
            this.groupCalendarList = _events.groupCalendars;
            this.appLoadingService.hideLoading().then(() => {
                this.isLoading = false;
                cb && cb();
            });
        });
    }

    private firstDayMonth(ev: Date): Date {
        let _ev = new Date(ev);
        _ev.setDate(1);
        return _ev;
    }

    private onCurrentDateChanged(ev: Date) {
        console.log("onCurrentDateChanged event :", ev);
        this.viewingMonth = ev;
        this.getCalendar(this.firstDayMonth(ev)).then((_events) => {
            this.eventSource = _events.events;
            this.groupCalendarList = _events.groupCalendars;
        }).then(() => {
            // this.myCalendar.loadEvents();
        });
    }

    private onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    private onEventSelected(event) {
        console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    }

    private isTabActive(_tabIdx: number): boolean {
        return true;
        // return ;
    }

    private showTaskDetail(_event: any) {
        console.log("showTaskDetail event:", _event);
        if (_event.assignType && _event.assignType == "ASSIGN") {
            this.navCtrl.push(AssignmentViewEventPage, { assign: _event });
        } else if (_event.assignType && _event.assignType == "MEETING") {
            // this.navCtrl.push(MeetingViewEventPage, { assign: _event });
        } else {

        }
    }

    private createShift() {
        this.navCtrl.push(ShiftCreatePage, { shiftType: 'shift' });
    }

    private createLeave() {
        this.navCtrl.push(LeaveCreateDetailPage);
    }

    private editEvent(event: EventModel) {
        console.log("editEvent event:", event);
        this.navCtrl.push(CalendarViewEventPage, {
            event: event
        });
    }

    private setStatus(_status) {
        let status: string;
        switch (_status) {
            case 'S0007': status = 'dotorange';
                break;
            case 'S0006': status = 'dotred';
                break;
            case 'S0005': status = 'dotgreen';
                break;
            default:
                status = 'dotorange';
                console.log("Not Status");
                break;
        }
        return status;
    }
}
