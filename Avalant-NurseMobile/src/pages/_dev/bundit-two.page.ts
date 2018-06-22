import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { AppServices } from '../../services/app-services';
import { HttpRequestWFService } from '../../workforce/service/httpRequestWFService';
import { PictureService } from '../../services/picture-service/picture.service';
import { SecurityUtil } from '../../utilities/security.util';
import { WorkforceHttpService, HCMFileUploadM, HCMFileUploaType } from '../../workforce/service/workforceHttpService';
import { AssignmentService } from '../../workforce/service/assignmentService';
import { HttpService } from '../../services/http-services/http.service';
import { ObjectsUtil } from '../../utilities/objects.util';
import { WorkforceService } from '../../workforce/service/workforceService';
import { FileUploadOptions, FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { AppState } from '../../app/app.state';

@IonicPage({
  segment: 'dev/bundit2',
}) @Component({
  selector: 'bundit-two-page',
  templateUrl: 'bundit-two.page.html',
  styleUrls: ['/bundit-two.page.scss']
})

export class BunditTwoPage {

  constructor(
    private httpRequestWFService: HttpRequestWFService,
    private httpService: HttpService,
    private wfHttpService: WorkforceHttpService,
    private workforceService: WorkforceService,
    private assignmentService: AssignmentService,
    private pictureService: PictureService,
    private transfer: FileTransfer,
    private appService: AppServices,
    private appState: AppState,
  ) {

  }
  public ionViewDidEnter() {
    this.rentingHCM();
  }
  private rentingHCM() {
    const HCMUserAuthModel = {
      "username": this.wfHttpService.HCMUserAuth.scm_username,
      "password": this.wfHttpService.HCMUserAuth.scm_pwd,
      "clientId": new Date().getTime().toString()
    };
    this.httpService.httpPost<any>("https://av.alworks.io/HCMRestService/auth/login", {}, { ...HCMUserAuthModel })
      .subscribe((resp: any) => {
        if (!ObjectsUtil.isEmptyObject(resp)) {
          this.wfHttpService.HCMAccessToken = resp && resp.token || resp;
        } else {
          this.wfHttpService.HCMAccessToken = null;
          console.warn("RequestAccessToken resp:", resp);
        }
      }, (errMsg) => {
        this.wfHttpService.HCMAccessToken = null;
      });
  }

  private genUserPwd(_user, _pwd) {
    let encodedPassword = SecurityUtil.encodePassword(_user, _pwd);
    console.log("username :" + _user + ", md5Pwd :" + encodedPassword);
  }

  private leaveAttachFile: any[] = [];
  private getAttachments() {
    let inputFileField = document.getElementById("attachmentsInputId");
    let filesList = [];
    if (inputFileField != null) {
      filesList = inputFileField['files'];
    }
    for (let idx = 0; idx < filesList.length; idx++) {
      let fileObj = filesList[idx];
      console.warn('fileObj:', fileObj);
      this.leaveAttachFile.push(fileObj);
    }
  }

  private isUseOpenFile: boolean = false;

  private getFilePath(resp: any): string {
    let respFile = resp.path || resp.name && resp.name instanceof Array && resp.name.length > 0 && resp.name[0] || resp.name || resp;
    return respFile;
  }

  private attachFile(leave: any) {
    if (this.appService.isServeChrome()) {
      let fileElem = document.getElementById('attachmentsInputId');
      console.log("fileElem :", fileElem);
      fileElem && fileElem.click();
    } else {
      if (this.isUseOpenFile) {
        this.workforceService.openFile().subscribe(resp => {
          console.log("openFileChooser resp :", resp);
          const pathFile = this.getFilePath(resp);
          console.log("pathFile :", pathFile);
          this.pictureService.getFileDirectory(pathFile).subscribe((resp) => {
            console.log("getFileDirectory :", resp);
            this.leaveAttachFile.push(resp);
          });
        });
      } else {
        this.workforceService.requestPicture().then((file) => {
          console.log("requestPicture :", file);
          const pathFile = this.getFilePath(file);
          console.log("pathFile :", pathFile);

          this.pictureService.getFileDirectory(pathFile).subscribe((resp) => {
            console.log("getFileDirectory :", resp);
            this.leaveAttachFile.push(resp);
          });
        });
      }
    }
  }

  private removeItm(itm, index) {
    this.leaveAttachFile.splice(index, 1);
  }

  private UploadFile(obj) {
    this.assignmentService.hcmUploadFile(this.leaveAttachFile || [], "assignment").subscribe(resp => {
      console.log("assignmentService.hcmUploadFile :", resp);
    });
  }
}