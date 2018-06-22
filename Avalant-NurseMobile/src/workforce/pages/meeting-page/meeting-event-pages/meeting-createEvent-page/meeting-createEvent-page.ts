import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

import { AppConstant } from '../../../../../constants/app-constant';
import { AppLoadingService } from '../../../../../services/app-loading-service/app-loading.service';
import {
  CalendarDatePickerService,
} from '../../../../../services/calendar-date-picker-service/calendar-date-picker-service';
import { AttendeeModel, MeetingModel } from '../../../../model/meeting.model.ts';
import { AppAlertService } from '../../../../service/appAlertService';
import { MeetingService } from '../../../../service/meetingService';
import { WorkforceHttpService } from '../../../../service/workforceHttpService';
import { WorkforceService } from '../../../../service/workforceService';
import { GoogleMap } from '../../../google-map/google-map';
import { MeetingAddMemberPage } from './meeting-add-member-page';
import { AnimateCss } from '../../../../../animations/animate-store';
import { AppServices } from '../../../../../services/app-services';

@Component({
  selector: 'meeting-createEvent-page',
  templateUrl: 'meeting-createEvent-page.html',
})
export class MeetingCreateEventPage implements OnInit, OnDestroy {
  private meeting: MeetingModel = new MeetingModel();
  private inputSearch: Subject<string> = new Subject();
  private listEmployee: AttendeeModel[] = [];
  private currentYear: string | number;

  private calbackDataMember: string[] = [];
  private calbackAddMember: (data) => any = (_params) => {
    return new Promise((resolve, reject) => {
      this.calbackDataMember = _params;
      resolve();
    });
  }

  constructor(
    private calendarDatePickerService: CalendarDatePickerService,
    private meetingService: MeetingService,
    private workforceService: WorkforceService,
    private wfHttpService: WorkforceHttpService,
    public navCtrl: NavController,
    public appLoadingService: AppLoadingService,
    public appAlertService: AppAlertService,
    public appServices: AppServices,
    public alertCtrl: AlertController,
  ) {

  }

  public ngOnInit() {
    this.workforceService.seletedPlace = {};
    let currDate = new Date();
    this.currentYear = currDate.getFullYear();

    let ISOToLocalString = (_date: Date): string => {
      let date = new Date(_date.getTime());
      date.setHours(_date.getHours() + 7);
      return date.toISOString();
    };

    // this.meeting.startDateTime = ISOToLocalString(currDate);
    // this.meeting.targetDateTime = ISOToLocalString(currDate);

    this.inputSearch.debounceTime(AppConstant.APP_DEBOUNCE_SEARCH_TIME).subscribe((messageInput) => {
      console.log(messageInput);
      if (messageInput) {

        this.meetingService.getAllEmployee(messageInput).subscribe((res) => {
          this.listEmployee = res;
        });
      } else {
        // this.listEmployee =null;
      }
    });
  }

  private showDateTimePicker(_pickerType: string, _filed: string) {
    if (_filed == 'startDateTime') {
      let dateObj = moment(this.meeting.startDateTime).toDate();
      this.calendarDatePickerService.getDisplayDateTimePicker(dateObj, _pickerType).subscribe((dateResult) => {
        this.meeting.startDateTime = dateResult.toISOString();
      });
    } else if (_filed == 'targetDateTime') {
      let dateObj = moment(this.meeting.targetDateTime).toDate();
      this.calendarDatePickerService.getDisplayDateTimePicker(dateObj, _pickerType).subscribe((dateResult) => {
        this.meeting.targetDateTime = dateResult.toISOString();
      });
    }
  }

  public ngOnDestroy() {
    this.workforceService.seletedPlace = {};
  }

  public ionViewWillEnter() {
    if (this.workforceService.seletedPlace && this.workforceService.seletedPlace.coords) {
      this.meeting.placeDesc = this.workforceService.seletedPlace.name;
      console.log(this.workforceService.seletedPlace);
      this.meeting.latitude = this.workforceService.seletedPlace.coords.lat;
      this.meeting.longitude = this.workforceService.seletedPlace.coords.lng;
      this.meeting.listImageURL = this.workforceService.seletedPlace.urlPhotos;
      // this.workforceService.getPicturesPlaceSearch(this.workforceService.seletedPlace.photoRef).subscribe((res)=>{
      //   this.meeting.listImageURL.push(res);
      //   console.log(res)
      // });
    }
  }
  private goToGoogleMap() {
    this.navCtrl.push(GoogleMap, {
      seletedPlace: this.workforceService.seletedPlace,
      formPage: "meeting"
    });
  }
  @ViewChild('urgentRequest') private urgentRequest: any;
  private checkCreate() {
    let checkCre = true;
    document.getElementById("topicDesc").classList.remove('red');
    document.getElementById("description").classList.remove('red');
    document.getElementById("startDateTime").classList.remove('red');
    document.getElementById("endDate").classList.remove('red');
    document.getElementById("member").classList.remove('red');

    if (this.meeting.topicDesc == null || this.meeting.topicDesc == '') {
      document.getElementById("topicDesc").classList.add('red');
      checkCre = false;
    }
    if (this.meeting.assignDesc == null || this.meeting.assignDesc == '') {
      document.getElementById("description").classList.add('red');
      checkCre = false;
    }
    if (this.meeting.startDateTime == null || this.meeting.startDateTime == '') {
      document.getElementById("startDateTime").classList.add('red');
      checkCre = false;
    }
    if (this.meeting.targetDateTime == null || this.meeting.targetDateTime == '') {
      document.getElementById("endDate").classList.add('red');
      checkCre = false;
    }
    if (this.calbackDataMember.length <= 0) {
      document.getElementById("member").classList.add('red');
      checkCre = false;
    }
    if (this.urgentRequest.text == '') {
      this.urgentRequest.value = 'N';
    }

    if (checkCre == true) {
      this.createMeeting();
    } else {
      let alert = this.alertCtrl.create({
        title: 'Warning',
        subTitle: 'Please verify your input.',
        buttons: ['Ok']
      });
      alert.present();
    }
  }
  private createMeeting() {
    this.appLoadingService.showLoading();
    let targetDateTime = new Date(this.meeting.targetDateTime);
    let startDateTime = new Date(this.meeting.startDateTime);

    if (this.meeting.topicDesc && this.meeting.assignDesc && (this.calbackDataMember && this.calbackDataMember.length > 0)) {
      let params = {
        "projectId": 1,
        "assignType": "MEETING",
        // "assignStatus":"ST0002", 
        "topicDesc": this.meeting.topicDesc,
        "assignDesc": this.meeting.assignDesc,
        "assignBy": this.wfHttpService.employeeCode,
        // "assignDate":"2017-11-16",
        // "assignTime":"08:00",
        "severityType": "H",
        "estimatehours": "",
        "placeDesc": this.meeting.placeDesc,
        "latitude": this.meeting.latitude,
        "longitude": this.meeting.longitude,
        "startDate": moment(targetDateTime).format("YYYY-MM-DD"),
        "startTime": moment(targetDateTime).format("HH:mm"),
        "targetDate": moment(startDateTime).format("YYYY-MM-DD"),
        "targetTime": moment(startDateTime).format("HH:mm"),
        "organizeId": AppConstant.DEFAULT_ORG_PARAMS.ORG_WORKFORCE.organizationId,
        "organizationId": AppConstant.DEFAULT_ORG_PARAMS.ORG_WORKFORCE.organizationId,
        "createBy": this.wfHttpService.employeeCode,
        "listAssignTo": (this.calbackDataMember || []),
        "listImageURL": (this.meeting.listImageURL || []),
        "listAttachmentFile": []
      };
      console.log("Meeting params Data 👉 :", params);
      this.meetingService.createMeeting(params).subscribe((resp) => {
        console.log("createMeeting resp:", resp);
        this.appLoadingService.hideLoading().then(() => {
          this.appAlertService.successAlertPopup({ description: resp })
            .subscribe(() => {
              this.navCtrl.pop().then(() => {
                this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.CALENDAR_MEETING_CREATE);
                this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.MEETING_CREATE);
              });
            });
        });
      }, (respErr) => {
        console.error("createMeeting respErr:", respErr);
        this.appLoadingService.hideLoading().then(() => {
          this.appAlertService.errorAlertPopup({ description: respErr })
            .subscribe(() => {
            });
        });
      });
    } else {
      console.warn("Please input more infomation...");
      this.appLoadingService.hideLoading().then(() => {
        this.appAlertService.warningAlertPopup({ description: "Please input more infomation..." })
          .subscribe(() => {
          });
      });
    }
  }

  private addEmployeeMember(_empCode?: string) {
    this.navCtrl.push(MeetingAddMemberPage, {
      selectedData: this.calbackDataMember,
      callback: this.calbackAddMember
    }, {
        animate: true, direction: "forward"
      });
  }
}
