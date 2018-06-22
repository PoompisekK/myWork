import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';

import { AppConstant } from '../../../../../constants/app-constant';
import { AttendeeModel, MeetingModel } from '../../../../model/meeting.model.ts';
import { MeetingService } from '../../../../service/meetingService';
import { WorkforceService } from '../../../../service/workforceService';
import { GoogleMap } from '../../../google-map/google-map';
import { MeetingPage } from '../../meeting-page';

@Component({
  selector: 'meeting-editEvent-page',
  templateUrl: 'meeting-editEvent-page.html'
})
export class MeetingEditEventPage implements OnInit, OnDestroy {
  private meeting: MeetingModel = new MeetingModel();
  private listEmployee: AttendeeModel[] = new Array<AttendeeModel>();
  private trackEmployee: any[] = new Array<any>();
  private inputSearch: Subject<string> = new Subject();
  private listCancelAssign: any[] = [];
  private listAddAssign: any[] = [];

  constructor(
    public navCtrl: NavController,
    private workforceService: WorkforceService,
    private meetingService: MeetingService,
    public navParam: NavParams
  ) {

  }
  public ngOnInit() {
    this.meeting = this.navParam.get("meeting");
    console.log("this.meeting:", this.meeting);
    console.log("this.workforceService.seletedPlace:", this.workforceService.seletedPlace);

    this.meeting.startDateTime = new Date(this.meeting.startDate).toISOString();
    this.meeting.targetDateTime = new Date(this.meeting.targetDate).toISOString();
    console.log(this.meeting);
    this.meeting.listAssignResponsible.forEach((emp) => {
      this.trackEmployee.push(emp.employeeCode);
    });
    this.workforceService.seletedPlace.name = this.meeting.placeDesc;
    this.workforceService.seletedPlace.coords.lat = this.meeting.latitude;
    this.workforceService.seletedPlace.coords.lng = this.meeting.longitude;
    this.inputSearch.debounceTime(AppConstant.APP_DEBOUNCE_SEARCH_TIME).subscribe((messageInput) => {
      if (messageInput) {
        this.meetingService.getAllEmployee(messageInput).subscribe((res) => {
          this.listEmployee = res;
        });
      } else {
        this.listEmployee = null;
      }

      // this.leaves = res;
    });
    // this.assignmentService.getEmployee().then((res)=>{
    //     this.listEmployee =res;
    //     console.log(this.listEmployee);
    // });

  }

  public ngOnDestroy() {
    //   this.workforceService.seletedPlace = {};
  }

  public ionViewWillEnter() {
    if (this.workforceService.seletedPlace) {
      this.meeting.placeDesc = this.workforceService.seletedPlace.name;
      this.meeting.latitude = this.workforceService.seletedPlace.coords.lat;
      this.meeting.longitude = this.workforceService.seletedPlace.coords.lng;
      console.log(this.workforceService.seletedPlace);
    }
  }
  public goToAssignment() {
    this.navCtrl.push(MeetingPage);
  }
  private goToGoogleMap() {
    this.navCtrl.push(GoogleMap, {
      seletedPlace: this.workforceService.seletedPlace,
      formPage: "assignment"
    });
  }
  private editAssignment() {
    // if(this.meeting.targetDateTime){
    let targetDateTime = new Date(this.meeting.targetDateTime);
    this.meeting.targetDate = targetDateTime.getFullYear() + "-" + (targetDateTime.getMonth() + 1) + "-" + targetDateTime.getDate();
    this.meeting.targetTime = targetDateTime.getHours() + ":" + targetDateTime.getMinutes();

    let startDateTime = new Date(this.meeting.startDateTime);
    this.meeting.startDate = startDateTime.getFullYear() + "-" + (startDateTime.getMonth() + 1) + "-" + startDateTime.getDate();
    this.meeting.startTime = startDateTime.getHours() + ":" + startDateTime.getMinutes();
    // }
    this.meeting.listAddAssign = this.listAddAssign;
    this.meeting.listCancelAssign = this.listCancelAssign;
    console.log(this.listAddAssign);
    console.log(this.listCancelAssign);

    // this.assign.assignTo = this.trackEmployee;
    console.log("Assign Data 👉", this.meeting);
    // console.log(this.assign.deadLineTime);
    // console.log(data);
    // let deadLine  = new Date(this.assign.deadLine);
    // this.assign.deadLineDate = deadLine.getDate()+"-"+(deadLine.getMonth()+1)+"-"+deadLine.getFullYear();
    // this.assign.deadLineTime = 
    // console.log(deadLine);
    this.meetingService.editMeeting(this.meeting).subscribe((res) => {
      console.log(res);
      this.navCtrl.pop();
      this.navCtrl.push(MeetingPage);
    });

  }
  private selectEmployee(emp: AttendeeModel) {
    this.findEmployeeCode(emp).then((code) => {
      if (code) {
        this.trackEmployee.push(code);
        this.listCancelAssign.forEach((code, index) => {
          if (code == emp.employeeCode) {
            this.listCancelAssign.splice(index, 1);
          }
        });
        let existEmployeeInOrigin = this.meeting.listAssignResponsible.find(emp => emp.employeeCode == code);
        if (!existEmployeeInOrigin) {
          this.listAddAssign.push(code);
        }
        this.listEmployee = null;
        this.meeting.invite = null;
      }
    });
  }
  private removeTrack(index: number, employeeCode: string) {
    let checkExistEmployee;
    let findEmployeeCode = this.listCancelAssign.find(code => code == employeeCode);
    if (!findEmployeeCode) {
      this.listCancelAssign.push(employeeCode);
    }
    this.trackEmployee.splice(index, 1);
  }

  private findEmployeeCode(emp: AttendeeModel): Promise<any> {
    return new Promise((resovle, reject) => {
      let existEmployeeCodeInArray = this.trackEmployee.find(code => code == emp.employeeCode);
      if (!existEmployeeCodeInArray) {
        resovle(emp.employeeCode);
      }
    });
  }

}
