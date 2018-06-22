import 'rxjs/add/operator/debounceTime';

import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

import { AnimateCss } from '../../../animations/animate-store';
import { AppConstant } from '../../../constants/app-constant';
import { toRaw } from '../../../constants/environment';
import { HCMConstant } from '../../../constants/hcm/hcm-constant';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../../services/app-services';
import { StringUtil } from '../../../utilities/string.util';
import { ContsVariables } from '../../global/contsVariables';
import { MeetingModel } from '../../model/meeting.model.ts';
import { MeetingService, MeetingUpdateStatusModel } from '../../service/meetingService';
import { WorkforceService } from '../../service/workforceService';
import { MeetingDetailPage } from './meeting-detail-page/meeting-detail-page';
import { MeetingCreateEventPage } from './meeting-event-pages/meeting-createEvent-page/meeting-createEvent-page';
import { MeetingEditEventPage } from './meeting-event-pages/meeting-editEvent-page/meeting-editEvent-page';
import { AppState } from '../../../app/app.state';

declare var google;
@Component({
  selector: 'meeting-page',
  templateUrl: 'meeting-page.html',
  animations: [
    AnimateCss.peek(),
  ]
})
export class MeetingPage implements OnInit {

  private KEY_INBOX: string = "inbox";
  private KEY_OUTBOX: string = "outbox";

  private inputSearch: Subject<string> = new Subject();
  private selectInbox: boolean = true;
  private selectOutbox: boolean = false;
  private selectedMeeting: string = this.KEY_INBOX;
  private viewingMonth: Date = new Date();

  constructor(
    public navCtrl: NavController,
    private meetingService: MeetingService,
    private appLoadingService: AppLoadingService,
    private workforceService: WorkforceService,
    private appState: AppState,
    private appServices: AppServices,
  ) {

  }
  public ngOnInit() {
    this.inputSearch.debounceTime(AppConstant.APP_DEBOUNCE_SEARCH_TIME).subscribe((messageInput) => {
      this.meetingService.searchMeeting(messageInput).subscribe((res) => {
        console.log(res);
        // this.leaves = res;
      });
    });
    this.initSlideDayView();
  }

  @ViewChild("slidesMeetingView") private slidesMeetingView: Slides;
  private daySlides: any[] = [];

  private firstLoad = true;
  private initSlideDayView() {
    this.daySlides = [{
      "viewingMonth": moment(this.viewingMonth).add(-1, "days").toDate(),
      "allMeetingTask": [],
    }, {
      "viewingMonth": moment(this.viewingMonth).toDate(),
      "allMeetingTask": this.allMeetingTask,
    }, {
      "viewingMonth": moment(this.viewingMonth).add(1, "days").toDate(),
      "allMeetingTask": [],
    }];
    this.toGroupDate(moment(this.viewingMonth).add(-1, "days").toDate());
    this.toGroupDate(moment(this.viewingMonth).add(1, "days").toDate());

    this.firstLoad = true;
  }
  private loadPrev() {
    let newIndex = this.slidesMeetingView.getActiveIndex();
    let firstDay = this.daySlides && this.daySlides[0].viewingMonth;
    let prevDate = moment(firstDay).add(-1, "days").toDate();
    this.daySlides.unshift({
      "keyDate": moment(prevDate).format("YYYY-MM-DD"),
      "viewingMonth": prevDate,
      "allMeetingTask": [],
    });
    this.toGroupDate(prevDate);
    this.daySlides.pop();
    this.slidesMeetingView.slideTo(newIndex + 1, 0, false);// Work around to make it work: breaks the animation
  }
  private loadNext() {
    if (this.firstLoad) { // Since the initial slide is 1, prevent the first movement to modify the slides
      this.firstLoad = false;
      return;
    }
    let newIndex = this.slidesMeetingView.getActiveIndex();
    let indx = (this.daySlides || []).length > 0 ? (this.daySlides || []).length - 1 : (this.daySlides || []).length;
    let lastDay = this.daySlides[indx].viewingMonth;
    let nextDate = moment(lastDay).add(1, "days").toDate();
    this.daySlides.push({
      "keyDate": moment(nextDate).format("YYYY-MM-DD"),
      "viewingMonth": nextDate,
      "allMeetingTask": [],
    });
    this.toGroupDate(nextDate);
    this.daySlides.shift();
    this.slidesMeetingView.slideTo(newIndex - 1, 0, false);// Work around to make it work: breaks the animation
  }

  private toGroupDate(_date) {
    const selectedDate = moment(_date).format("YYYY-MM-DD");
    let dayResult = this.daySlides.find(itm => itm.keyDate == selectedDate);
    if (dayResult) {
      // dayResult.allMeetingTask = _calendars;
      // console.log("dayResult[" + selectedDate + "] allMeetingTask:", _calendars);
    }
  }

  private isLoading = true;
  public ionViewWillEnter() {
    this.isLoading = true;
    this.selectAssign(this.selectedMeeting);
  }

  private doRefresh(refresher) {
    // refresher
    this.appLoadingService.showLoading();
    this.initSlideDayView();
    this.selectAssign(this.selectedMeeting, () => {
      refresher.complete();
    });
  }

  private allMeetingTask: any[] = [];
  private getInboxTask(cb?: () => void) {
    this.meetingService.getResponsiblet().subscribe((inbotResult) => {
      this.sortTask(inbotResult, cb);
    });
  }
  private getOutboxTask(cb?: () => void) {
    this.meetingService.getMeeting().subscribe((outboxResult) => {
      this.sortTask(outboxResult, cb);
    });
  }

  private sortTask(_taskArr: any[], cb?: () => void) {
    let currentDate = this.truncateTime(new Date());
    let toDayTask: any[] = [];
    let otherDayTask = [];
    (_taskArr || []).forEach((taskMeeting) => {
      let targetDate = this.truncateTime(new Date(taskMeeting.targetDate));
      taskMeeting.targetDateTime = new Date(taskMeeting.targetDate + 'T' + taskMeeting.targetTime);
      if (targetDate.toDateString() == currentDate.toDateString()) {
        toDayTask.push(taskMeeting);
      } else {
        otherDayTask.push(taskMeeting);
      }
    });
    this.allMeetingTask = [];
    setTimeout(() => {
      this.allMeetingTask.push(...toDayTask);
      this.allMeetingTask.push(...otherDayTask);
      console.log("allMeetingTask :", toRaw(this.allMeetingTask));
      this.appLoadingService.hideLoading().then(() => {
        this.isLoading = false;
        cb && cb();
      });
    }, 750);
  }

  private isHasLatLngParams(_assign: any): boolean {
    let lat, lng;
    lat = ((_assign || {}).latitude || "");
    lng = ((_assign || {}).longitude || "");
    return !StringUtil.isEmptyString(lat + lng);
  }

  private getLatLngParams(_assign: any) {
    let latlng = null, lat, lng;
    lat = ((_assign || {}).latitude || "");
    lng = ((_assign || {}).longitude || "");
    latlng = [lat, lng].join(",");
    return latlng;
  }

  private goMeetingDetailPage(_meeting: any) {
    this.navCtrl.push(MeetingDetailPage, { meetingData: _meeting });
  }

  private clickSelectAssign(type: string, cb?: () => void) {
    this.isLoading = true;
    this.selectAssign(type);
  }

  private selectAssign(type: string, cb?: () => void) {
    if (type == this.KEY_INBOX) {
      this.selectInbox = true;
      this.selectOutbox = !this.selectInbox;
      this.selectedMeeting = this.KEY_INBOX;
      this.getInboxTask(cb);
    } else if (type == this.KEY_OUTBOX) {
      this.selectInbox = false;
      this.selectOutbox = !this.selectInbox;
      this.selectedMeeting = this.KEY_OUTBOX;
      this.getOutboxTask(cb);
    } else {
      console.error("type :", type);
    }
  }

  private getMeetingClassStatus(_taskStatus: string): string {
    return this.meetingService.getMeetingClassStatus(_taskStatus);
  }

  private truncateTime(_inDate: Date): Date {
    _inDate.setHours(0, 0, 0, 0);
    return _inDate;
  }

  private acceptAssign(meeting: MeetingModel) {
    this.appLoadingService.showLoading();
    const acceptM: MeetingUpdateStatusModel = new MeetingUpdateStatusModel;
    acceptM.status = ContsVariables.StatusAssigment.ACCEPTED;
    acceptM.responsibleCode = meeting.responsibleCode;
    acceptM.organizationId = this.appState.currentOrganizationId;
    acceptM.userId = this.appState.employeeCode;
    this.meetingService.updateStatusResponsible(acceptM).subscribe((res) => {
      console.log("acceptAssign res:", res);
      this.appLoadingService.hideLoading().then(() => {
        this.selectAssign(this.selectedMeeting);
      });
    });
  }

  private rejectAssign(meeting: MeetingModel) {
    this.appLoadingService.showLoading();
    const rejectM: MeetingUpdateStatusModel = new MeetingUpdateStatusModel;
    rejectM.status = ContsVariables.StatusAssigment.DENIED;
    rejectM.responsibleCode = meeting.responsibleCode;
    rejectM.organizationId = this.appState.currentOrganizationId;
    rejectM.userId = this.appState.employeeCode;
    this.meetingService.updateStatusResponsible(rejectM).subscribe((res) => {
      console.log("rejectAssign res:", res);
      this.appLoadingService.hideLoading().then(() => {
        this.selectAssign(this.selectedMeeting);
      });
    });
  }

  private goToCreateEventMeeting() {
    // this.navCtrl.push(MeetingCreateEventPage);
    this.appServices.openModal(MeetingCreateEventPage, {});
    this.appServices.subscribe(AppConstant.EVENTS_SUBSCRIBE.MEETING_CREATE, () => {
      this.ionViewWillEnter();
    });
  }

  private editMeeting(meeting: MeetingModel) {
    this.navCtrl.push(MeetingEditEventPage, {
      meeting: meeting
    });
  }

}