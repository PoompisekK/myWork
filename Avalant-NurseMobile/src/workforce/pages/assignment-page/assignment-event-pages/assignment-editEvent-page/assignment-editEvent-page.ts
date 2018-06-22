import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { Component, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';

import { AppConstant } from '../../../../../constants/app-constant';
import { ContsVariables } from '../../../../global/contsVariables';
import { AssigneeModel, AssignmentModel } from '../../../../model/assignment.model';
import { AssignmentService } from '../../../../service/assignmentService';
import { WorkforceService } from '../../../../service/workforceService';
import { GoogleMap } from '../../../google-map/google-map';
import { AssignmentPage } from '../../assignment-page';

@Component({
  selector: 'assignment-editEvent-page',
  templateUrl: 'assignment-editEvent-page.html'
})
export class AssignmentEditEventPage implements OnInit {
  private assign: AssignmentModel = new AssignmentModel();
  private listEmployee: AssigneeModel[] = new Array<AssigneeModel>();
  private trackEmployee: any[] = new Array<any>();
  private inputSearch: Subject<string> = new Subject();
  private listCancelAssign: any[] = [];
  private listAddAssign: any[] = [];
  private listFiles: any[] = new Array<any>();
  private listRemoveFiles: any[] = new Array<any>();
  constructor(
    public navCtrl: NavController,
    private workforceService: WorkforceService,
    private assignmentService: AssignmentService,
    public navParam: NavParams,
    private alertCtrl: AlertController
  ) {

  }
  public ngOnInit() {
    this.assign = this.navParam.get("assign");
    console.log("this.assign    :", this.assign);
    console.log("startDateTime  :", this.assign.startDateTime);

    if (this.assign.startDateTime) {
      this.assign.targetDateTime = new Date(this.assign.startDateTime).toISOString();
    }

    this.assign.listAssignResponsible.forEach((emp) => {
      this.trackEmployee.push(emp.employeeCode);
    });
    this.assign.listAttachmentFile.forEach((file) => {
      this.listFiles.push(file);
    });
    if (!this.workforceService.seletedPlace) {
      this.workforceService.seletedPlace = {};
    }
    this.workforceService.seletedPlace.name = this.assign.placeDesc;
    this.workforceService.seletedPlace.coords.lat = this.assign.latitude;
    this.workforceService.seletedPlace.coords.lng = this.assign.longitude;
    this.inputSearch.debounceTime(AppConstant.APP_DEBOUNCE_SEARCH_TIME).subscribe((messageInput) => {
      if (messageInput) {
        this.assignmentService.getEmployeeSubordinate(messageInput).subscribe((res) => {
          this.listEmployee = res;
        });
      } else {
        this.listEmployee = null;
      }
    });
  }

 public ionViewWillEnter() {
    if (this.workforceService.seletedPlace) {
      this.assign.placeDesc = this.workforceService.seletedPlace.name;
      this.assign.latitude = this.workforceService.seletedPlace.coords.lat;
      this.assign.longitude = this.workforceService.seletedPlace.coords.lng;
      console.log(this.workforceService.seletedPlace);
    }
  }
  private goToAssignment() {
    this.navCtrl.push(AssignmentPage);
  }
  private goToGoogleMap() {
    this.navCtrl.push(GoogleMap, {
      seletedPlace: this.workforceService.seletedPlace,
      formPage: "assignment"
    });
  }
  private editAssignment() {
    this.assign.listAddAssign = this.listAddAssign;
    this.assign.listCancelAssign = this.listCancelAssign;
    this.assign.listRemoveAttachmentFile = this.listRemoveFiles;
    let targetDateTime = new Date(this.assign.targetDateTime);
    this.assign.targetDate = targetDateTime.getFullYear() + "-" + (targetDateTime.getMonth() + 1) + "-" + targetDateTime.getDate();
    this.assign.startDateTime = targetDateTime.getFullYear() + "-" + (targetDateTime.getMonth() + 1) + "-" + targetDateTime.getDate();
    this.assign.targetTime = targetDateTime.getHours() + ":" + targetDateTime.getMinutes();
    this.assign.startTime = targetDateTime.getHours() + ":" + targetDateTime.getMinutes();

    console.log("Assign Data 👉", this.assign);
    if (this.listFiles.length > 0) {
      this.listFiles.forEach((element, index) => {
        if (!element.assignFileId) {
          this.workforceService.uploadFileTranfer(element.imagePath, element.documentName, ContsVariables.typeFileUpload.assignMent).then((attachFile) => {
            let file = JSON.parse(attachFile.response);
            if (file.messageCode == 0) {
              this.assign.listAddAttachmentFile.push(file.data.attachmentId);
            } else {
              alert("Operation fail,please try again.");
            }
            if (index == this.listFiles.length - 1) {

              this.assignmentService.editAssignment(this.assign).subscribe((res) => {
                this.navCtrl.pop();
                this.navCtrl.push(AssignmentPage);
              });
            }
          });
        }
      });
    } else {
      this.assignmentService.editAssignment(this.assign).subscribe((res) => {
        console.log(res);
        this.navCtrl.pop();
      });
    }
  }

  private selectEmployee(emp: AssigneeModel) {
    this.findEmployeeCode(emp).then((code) => {
      if (code) {
        this.trackEmployee.push(code);
        this.listCancelAssign.forEach((code, index) => {
          if (code == emp.employeeCode) {
            this.listCancelAssign.splice(index, 1);
          }
        });
        let existEmployeeInOrigin = this.assign.listAssignResponsible.find(emp => emp.employeeCode == code);
        if (!existEmployeeInOrigin) {
          this.listAddAssign.push(code);
        }
        this.listEmployee = null;
        this.assign.assignTo = null;
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

  private findEmployeeCode(emp: AssigneeModel): Promise<any> {
    return new Promise((resovle, reject) => {
      let existEmployeeCodeInArray = this.trackEmployee.find(code => code == emp.employeeCode);
      if (!existEmployeeCodeInArray) {
        resovle(emp.employeeCode);
      }
    });
  }
  private attachFile() {
    this.workforceService.requestPicture().then((datafile) => {
      let file = { assignFileId: null, assignmentCode: null, fileType: null, documentName: datafile.name, imagePath: datafile.path };
      this.listFiles.push(file);
      // console.log(imagePath);
      // console.log(res);
    });
  }
  private removeFile(index: number, file: any) {
    let alert = this.alertCtrl.create({
      title: 'Warning',
      message: 'Do you wat to remove this file',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: "Ok",
          handler: () => {
            if (file.assignFileId) {
              this.listRemoveFiles.push(file.assignFileId);
            }
            this.listFiles.splice(index, 1);
          }
        }
      ]
    });
    alert.present();
  }
}
