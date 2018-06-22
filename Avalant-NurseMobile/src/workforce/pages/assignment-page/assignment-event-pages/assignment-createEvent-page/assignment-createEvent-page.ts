import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

import { AppAlertService } from '../../../../service/appAlertService';
import { AppConstant } from '../../../../../constants/app-constant';
import { AppLoadingService } from '../../../../../services/app-loading-service/app-loading.service';
import { AssigneeModel, AssignmentModel } from '../../../../model/assignment.model';
import { AssignmentService } from '../../../../service/assignmentService';
import { CalendarDatePickerService } from '../../../../../services/calendar-date-picker-service/calendar-date-picker-service';
import { GoogleMap } from '../../../google-map/google-map';
import { MeetingAddMemberPage } from '../../../meeting-page/meeting-event-pages/meeting-createEvent-page/meeting-add-member-page';
import { StringUtil } from '../../../../../utilities/string.util';
import { WorkforceHttpService, HCMFileUploadM, HCMFileUploaType } from '../../../../service/workforceHttpService';
import { WorkforceService } from '../../../../service/workforceService';
import { AssignmentPage } from '../../assignment-page';
import { isDev, toRaw } from '../../../../../constants/environment';
import { AppServices } from '../../../../../services/app-services';
import { AnimateCss } from '../../../../../animations/animate-store';
import { ContsVariables } from '../../../../global/contsVariables';
import { HCMRestApi } from '../../../../../constants/hcm-rest-api';
import { AppState } from '../../../../../app/app.state';
import { PictureService } from '../../../../../services/picture-service/picture.service';

@Component({
  selector: 'assignment-createEvent-page',
  templateUrl: 'assignment-createEvent-page.html',
  animations: [
    AnimateCss.peek()
  ]
})
export class AssignmentCreateEventPage implements OnInit, OnDestroy {
  private _tmpAssignM: AssignmentModel = new AssignmentModel();
  private assign: AssignmentModel = new AssignmentModel();
  private listEmployee: AssigneeModel[] = [];
  private inputSearch: Subject<string> = new Subject();
  private maxYear: string;
  private minYear: string;
  private listFiles: any[] = [];
  private assignmentPriority: any[] = [
    { code: "U", description: "Urgent" },
    { code: "H", description: "High" },
    { code: "N", description: "Normal" },
  ];

  private calbackDataMember: any[] = [];
  private calbackAddMember = (_params): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.calbackDataMember = _params;
      resolve();
    });
  }
  private callbackSeletedPlaceData: any = this.workforceService.seletedPlace;
  private calbackSelectPlaceFn = (_params): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.callbackSeletedPlaceData = _params;
      resolve();
    });
  }

  private listOldAssignee: string[] = []; // storing old assignee before, editing

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private appService: AppServices,
    private workforceService: WorkforceService,
    private pictureService: PictureService,
    private assignmentService: AssignmentService,
    private appLoadingService: AppLoadingService,
    private calendarDatePickerService: CalendarDatePickerService,
    private appAlertService: AppAlertService,
    private wfHttpService: WorkforceHttpService,
    private alertCtrl: AlertController,
    private appState: AppState,
  ) {
  }
  public ngOnDestroy() {
    this.workforceService.seletedPlace = {};
  }
  public ngOnInit() {
    this.inputSearch.debounceTime(AppConstant.APP_DEBOUNCE_SEARCH_TIME).subscribe((messageInput) => {
      if (messageInput) {
        this.assignmentService.getAllEmployee(messageInput).subscribe((res) => {
          this.listEmployee = res;
        });
      } else {
        this.listEmployee = null;
      }
    });

    this.initView();
  }

  private initView() {
    const _editAssignData = this.navParams.get("editAssignData");
    const actionParams = this.navParams.get("actionParams");
    this._tmpAssignM = _editAssignData;
    console.log("_inputAssign:", _editAssignData);

    if (actionParams === "edit") {
      this.isEditAssign = true;
      this.assign = _editAssignData || this.assign;
      const toDateTime = (_date: string, _time: string): string => {
        if (_date && !StringUtil.isEmptyString(_date)) {
          if (_date && _time) {
            return new Date(_date + "T" + _time).toISOString();
          } else {
            return new Date(_date).toISOString();
          }
        } else {
          return _date;
        }
      };
      this.assign.targetDateTime = toDateTime(this.assign.targetDate, this.assign.targetTime);
      this.assign.startDateTime = toDateTime(this.assign.startDate, this.assign.startTime);

      const toEmpCodeList = (_responsibleList: any[]) => {
        let _empCode: string[] = [];
        (_responsibleList || []).forEach(itm => {
          if (itm && itm.employeeCode) {
            _empCode.push(itm.employeeCode);
          }
        });
        return _empCode;
      };
      this.calbackDataMember = toEmpCodeList(this.assign["listAssignResponsible"]);
      this.listOldAssignee = toEmpCodeList(this.assign["listAssignResponsible"]);

      this.workforceService.seletedPlace = null;
    }
  }

  private showDateTimePicker(_displayType: string, _fieldModel: string) {
    let assignEndDate = moment(this.assign[_fieldModel]).toDate();
    let currSelected: Date = assignEndDate || new Date();
    this.calendarDatePickerService.getDisplayDateTimePicker(currSelected, _displayType).subscribe((dateResult) => {
      this.assign[_fieldModel] = dateResult.toISOString();
    });
  }

  private displayStaticMap = {
    show: false,
    url: ""
  };

  private isEditAssign: boolean = false;
  private ionViewDidEnter() {
    // fromAddPage
    // fromViewPage
    // afterAddMember
    // afterPickLocation
    if (this.workforceService.seletedPlace) {
      this.assign["placeName"] = this.workforceService.seletedPlace.name;
      if (!this.workforceService.seletedPlace) {
        this.workforceService.seletedPlace = {};
      }
      if (!this.workforceService.seletedPlace.coords) {
        this.workforceService.seletedPlace.coords = {};
      }
      this.assign.latitude = this.workforceService.seletedPlace.coords.lat;
      this.assign.longitude = this.workforceService.seletedPlace.coords.lng;
      console.log("ionViewDidEnter :", this.workforceService.seletedPlace);
      if (this.assign.latitude != null && this.assign.longitude != null) {
        let latlng = this.assign.latitude + "," + this.assign.longitude;
        this.displayStaticMap.url = "https://maps.googleapis.com/maps/api/staticmap?language=th&center=" + latlng + "&zoom=16&size=600x300&maptype=roadmap&markers=color:red%7Clabel:A%7C" + latlng + "&key=";
        this.displayStaticMap.show = true;
      }
    }
  }

  private goToGoogleMap() {
    this.navCtrl.push(GoogleMap, {
      seletedPlace: this.workforceService.seletedPlace,
      formPage: "assignment",
      callback: this.calbackSelectPlaceFn
    });
  }

  private checkCreate() {
    let checkC = true;
    document.getElementById("topic").classList.remove('red');
    document.getElementById("description").classList.remove('red');
    document.getElementById("endDate").classList.remove('red');
    document.getElementById("member").classList.remove('red');
    console.log(this.calbackDataMember.length);
    if (this.assign.topicDesc == null || this.assign.topicDesc == '') {
      document.getElementById("topic").classList.add('red');
      checkC = false;
    }
    if (this.assign.assignDesc == null || this.assign.assignDesc == '') {
      document.getElementById("description").classList.add('red');
      checkC = false;
    }
    if (this.assign.targetDateTime == null) {
      document.getElementById("endDate").classList.add('red');
      checkC = false;
    }
    if (this.calbackDataMember.length <= 0) {
      document.getElementById("member").classList.add('red');
      checkC = false;
    }

    if (checkC == true) {
      this.createOrUpdateAssignment(true);
    } else {
      let alert = this.alertCtrl.create({
        title: 'Warning',
        subTitle: 'Please verify your input.',
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  private createOrUpdateAssignment(_isCreate: boolean): void {
    this.appLoadingService.showLoading();
    this.validateAssignmentDetail(() => {
      if (_isCreate) {
        this.createAssignment();
      } else {
        this.editAssignment();
      }
    }, () => {
      this.appLoadingService.hideLoading().then(() => {
        console.warn("Please input more infomation...");
        this.appAlertService.warningAlertPopup({ description: "Please input more infomation..." })
          .subscribe(() => {
          });
      });
    });
  }

  private validateAssignmentDetail(cb: () => void, error: () => void) {
    if (this.assign.topicDesc && this.assign.assignDesc && (this.calbackDataMember && this.calbackDataMember.length > 0)) {
      cb();
    } else {
      error();
    }
  }

  private editAssignment(): void {
    console.log("listAssignee :", this.listOldAssignee);

    /**
     * tmp = [A,B,C,D]
     * data = [A,B,E,F]
     * 
     * listNotChange = [A,B]
     * listCancelAssign = [C,D]
     * listAddAssign = [E,F]
     */

    const listNotChange = this.listOldAssignee.filter(itm => this.calbackDataMember.indexOf(itm) > -1);
    const listDeleted_EmpCode = this.listOldAssignee.filter(itm => this.calbackDataMember.indexOf(itm) == -1);
    const listAdded_EmpCode = this.calbackDataMember.filter(itm => (listNotChange).indexOf(itm) == -1);

    console.log("list      Not Change :", listNotChange);
    console.log("list Deleted_EmpCode :", listDeleted_EmpCode);
    console.log("list   Added_EmpCode :", listAdded_EmpCode);

    const _editParams = {
      "assignmentCode": this.assign.assignmentCode,
      "assignType": "ASSIGN",
      "organizeId": 0,
      "projectId": 1,
      "topicDesc": this.assign.topicDesc,
      "assignDesc": this.assign.assignDesc,
      "severityType": "H",
      "estimatehours": "",
      "placeDesc": this.assign.placeDesc,
      "latitude": this.assign.latitude,
      "longitude": this.assign.longitude,
      "startDate": this.assign.targetDate,
      "startTime": this.assign.targetTime,
      "targetDate": this.assign.targetDate,
      "targetTime": this.assign.targetTime,
      "updateBy": this.wfHttpService.employeeCode,

      "listCancelAssign": (listDeleted_EmpCode || []),
      "listAddAssign": (listAdded_EmpCode || []),
      "listAddAttachmentFile": (this.assign.listAddAttachmentFile || []),
      "listRemoveAttachmentFile": (this.assign.listRemoveAttachmentFile || []),
      "listImageURL": (this.assign.listImageURL || []),
    };

    console.log("Assignment Edit params Data 👉 :", _editParams);
    this.assignmentService.editAssignment(_editParams).subscribe((resp) => {
      console.log("editAssignment resp:", resp);
      this.appLoadingService.hideLoading().then(() => {
        this.appAlertService.successAlertPopup({ description: resp })
          .subscribe(() => {
            // this.navCtrl.pop();
            this.navCtrl.setRoot(AssignmentPage, {}, { animate: true, direction: "backward" });
            // this.navCtrl.
          });
      });
    }, (respErr) => {
      console.error("editAssignment respErr:", respErr);
      this.appLoadingService.hideLoading().then(() => {
        this.appAlertService.errorAlertPopup({ description: respErr })
          .subscribe(() => {
          });
      });
    });
  }

  private createAssignment() {
    let targetDateTime = new Date(this.assign.targetDateTime);
    let startDateTime = new Date(this.assign.startDateTime);
    console.log("Create Assignment assign :", this.assign);

    const _createParams = {
      "projectId": 1,
      "assignType": "ASSIGN",
      "topicDesc": this.assign.topicDesc,
      "assignDesc": this.assign.assignDesc,
      "assignBy": this.wfHttpService.employeeCode,
      "severityType": "H",
      "estimatehours": "",
      "placeName": this.assign["placeName"],
      "placeDesc": this.assign.placeDesc,
      "latitude": this.assign.latitude,
      "longitude": this.assign.longitude,
      "startDate": moment(targetDateTime).format("YYYY-MM-DD"),
      "startTime": moment(targetDateTime).format("HH:mm"),
      // "targetDate": moment(startDateTime).format("YYYY-MM-DD"),
      // "targetTime": moment(startDateTime).format("HH:mm"),
      "targetDate": moment(targetDateTime).format("YYYY-MM-DD"),
      "targetTime": moment(targetDateTime).format("HH:mm"),
      "organizeId": 0,
      "organizationId": 0,
      "createBy": this.wfHttpService.employeeCode,
      "listAssignTo": (this.calbackDataMember || []),
      "listImageURL": (this.assign.listImageURL || []),
      "listAttachmentFile": []
    };
    console.log("Assignment params Data 👉 :", _createParams);

    this.uploadAttachment(this.assign.files, (resp) => {
      console.log("uploadAttachment resp:", resp);
      _createParams.listAttachmentFile = resp;
      this.assignmentService.createAssignment(_createParams).subscribe((resp) => {
        console.log("createAssignment resp:", resp);
        this.appLoadingService.hideLoading().then(() => {
          this.appAlertService.successAlertPopup({ description: resp })
            .subscribe(() => {
              this.navCtrl.pop().then(() => {
                this.appService.publish(AppConstant.EVENTS_SUBSCRIBE.CALENDAR_TASK_CREATE);
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
    });
  }

  private uploadAttachment(attactment: any[], cb?: (resp) => void) {
    attactment = (attactment || []);
    this.assignmentService.hcmUploadFile(attactment, HCMFileUploaType.ASSIGNMENT).subscribe(resp => {
      console.log("postXMLHttpRequestFileUpload :", resp);
      cb && cb(resp);
    });
  }

  private attachFile() {
    if (this.appService.isServeChrome()) {
      let fileElem = document.getElementById('attachmentsInputId');
      console.log("fileElem :", fileElem);
      fileElem && fileElem.click();
    } else {
      // this.workforceService.requestPicture().then((resp) => {
      this.workforceService.openFile().subscribe((resp) => {
        console.log("requestPicture :", resp);
        const pathFile = this.workforceService.getFilePath(resp);
        isDev() && console.log("pathFile :", pathFile);
        this.pictureService.getFileDirectory(pathFile).subscribe((resp) => {
          console.log("getFileDirectory :", resp);
          this.assign.files.push(resp);
        });
      });
    }
  }

  private getAttachments() {
    let inputFileField = document.getElementById("attachmentsInputId");
    let filesList = [];
    if (inputFileField != null) {
      filesList = inputFileField['files'];
    }
    if (!this.assign.files) {
      this.assign.files = [];
    }
    for (let idx = 0; idx < filesList.length; idx++) {
      let fileObj = filesList[idx];
      this.assign.files.push(fileObj);
      console.warn('fileObj:', fileObj);
    }
  }

  private getFileExtension(filename: string): string {
    return ((/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined || '').toLowerCase();
  }

  private isFileType(fileItm: any, index: number): boolean {
    let fileIx = (fileItm.name || fileItm.fileName);
    if (index == 1 && "log txt text doc ppt xls docx pptx xlsx".indexOf(this.getFileExtension(fileIx)) > -1) {
      return true;
    } else if (index == 2 && "pdf".indexOf(this.getFileExtension(fileIx)) > -1) {
      return true;
    } else if (index == 3 && "png jpg jpeg gif bmp svg".indexOf(this.getFileExtension(fileIx)) > -1) {
      return true;
    } else {
      return false;
    }
  }

  private removeFile(index: number) {
    this.assign.files.splice(index, 1);
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