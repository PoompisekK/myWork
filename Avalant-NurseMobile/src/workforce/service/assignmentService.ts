import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../app/app.state';
import { isChromeDev } from '../../constants/environment';
import { HCMRestApi } from '../../constants/hcm-rest-api';
import { HCMConstant } from '../../constants/hcm/hcm-constant';
import { AppServices } from '../../services/app-services';
import { AssigneeModel, AssignmentModel } from '../model/assignment.model';
import { HttpRequestWFService } from './httpRequestWFService';
import { HCMFileUploadM, HCMFileUploaType, WorkforceHttpService } from './workforceHttpService';

@Injectable()
export class AssignmentService {

    public assigns: AssignmentModel[] = new Array<AssignmentModel>();
    constructor(
        private appServices: AppServices,
        private appState: AppState,
        private httpReqWFService: HttpRequestWFService,
        private transfer: FileTransfer,
        private wfHttpService: WorkforceHttpService,
    ) {

    }

    public hcmUploadProfileImage(files: any[], attachmentType: string): Observable<string[]> {
        const urlTarget = HCMRestApi.URL + "/file/profileimage/upload";
        return this.HCMAttachmentFile(files, attachmentType, urlTarget);
    }

    public hcmUploadFile(files: any[], attachmentType: string): Observable<string[]> {
        const urlTarget = HCMRestApi.URL + "/file/upload";
        return this.HCMAttachmentFile(files, attachmentType, urlTarget);
    }

    public HCMAttachmentFile(files: any[], attachmentType: string, targetPath: string): Observable<string[]> {
        let responseFiles: string[] = [];
        return Observable.create((observe) => {
            if ((files || []).length == 0) {
                observe.next(responseFiles);
            } else {
                if (this.appServices.isServeChrome()) {
                    for (let i = 0; i < (files || []).length; i++) {
                        let fileObj = files[i];
                        const xmlHttpModel: HCMFileUploadM = new HCMFileUploadM();
                        xmlHttpModel.fileObject = fileObj;
                        xmlHttpModel.organizationId = this.appState.currentOrganizationId;
                        xmlHttpModel.employeeCode = this.wfHttpService.employeeCode;
                        xmlHttpModel.type = attachmentType || HCMFileUploaType.ASSIGNMENT;
                        this.wfHttpService.postXMLHttpRequestFileUpload(xmlHttpModel, targetPath).subscribe((resp: any) => {
                            isChromeDev() && console.log("postXMLHttpRequestFileUpload :", resp);
                            responseFiles.push(resp.attachmentId);
                            if (responseFiles.length == files.length) {
                                observe.next(responseFiles);
                            }
                        });
                    }
                } else {
                    for (let i = 0; i < (files || []).length; i++) {
                        let fileObj = files[i];
                        let options: FileUploadOptions = {
                            fileKey: 'file',
                            fileName: fileObj.name,
                            chunkedMode: false,
                            params: {
                                organizationId: this.appState.currentOrganizationId,
                                employeeCode: this.wfHttpService.employeeCode,
                                type: attachmentType || HCMFileUploaType.ASSIGNMENT
                            },
                            headers: {
                                ...this.wfHttpService.getRequestHeader()
                            }
                        };
                        console.log("options:", options);
                        const fileTransfer: FileTransferObject = this.transfer.create();
                        fileTransfer.upload(fileObj.path || fileObj.localURL, targetPath, options)
                            .then((data) => { // success
                                console.log("success :", data && data.response);
                                if (data.responseCode == HttpStatus.OK && data.response) {
                                    let resp = JSON.parse(data.response);
                                    let attachmentId = resp.data.attachmentId;
                                    responseFiles.push(attachmentId);
                                    if (responseFiles.length == files.length) {
                                        observe.next(responseFiles);
                                    }
                                } else {
                                    responseFiles.push(data.responseCode + ":" + data.response);
                                    if (responseFiles.length == files.length) {
                                        observe.next(responseFiles);
                                    }
                                }
                                if (i == (files || []).length - 1) {
                                    observe.next(responseFiles);
                                }
                            }, (err) => {// error
                                console.error("err :", err);
                                responseFiles.push(err);
                                if (i == (files || []).length - 1) {
                                    observe.error(err);
                                }
                            });
                    }
                }
            }
        });
    }

    private postService(contextService: string, addtionalParam?: { [key: string]: any }, isFormData?: boolean | false): Observable<any> {
        return this.httpReqWFService.postParamsService("/assign/" + contextService, addtionalParam, isFormData);
    }

    private getService(contextService: string, addtionalParam?: { [key: string]: any }): Observable<any[]> {
        return this.httpReqWFService.getParamsService("/assign/" + contextService, addtionalParam);
    }

    //outbox
    public getAssignmenetTask(): Observable<any> {
        return this.getService("getAssignmenettask", { "assignType": "ASSIGN" });
    }

    //inbox
    public getResponsibletTask(): Observable<any> {
        return this.getService("getResponsibletask", { "assignType": "ASSIGN" });
    }

    public getAssignmenet(assignCode: string): Observable<AssignmentModel[]> {
        return this.getService("getAssignmenet", { "assignmentCode": assignCode });
    }
    public getResponsiblet(responCode: string): Observable<AssignmentModel[]> {
        return this.getService("getAssignmenet", { "responsibleCode": responCode });
    }

    public getAllEmployee(messageInput: string): Observable<AssigneeModel[]> {
        return this.getService("getAllEmployee", { "q": messageInput });
    }

    public getEmployeeSubordinate(messageInput: string): Observable<AssigneeModel[]> {
        return this.getService("getEmployeeSubordinate", { "q": messageInput });
    }

    public createAssignment(bodyParams: any): Observable<string> {
        return this.postService("create", bodyParams, true);
    }

    public editAssignment(bodyParams: any): Observable<string> {
        return this.postService("editAssignment", bodyParams, true);
    }

    public searchAssignment(keywordSearch: string): Observable<any> {
        return this.getService("getAssignmenettask", { "assignType": "ASSIGN", "q": keywordSearch });
    }

    public updateStatusResponsible(status: string, assign: AssignmentModel): Observable<any> {
        let bodyParams = {
            "responsibleCode": assign.responsibleCode,
            "assignmentCode": assign.assignmentCode,
            "userId": this.wfHttpService.employeeCode,
            "status": status
        };
        console.log("updateStatusResponsible bodyParams:", bodyParams);
        return this.postService("updateStatusResponsible", bodyParams, true);
    }

    public updateStatusAssignment(status: string, assign: AssignmentModel): Observable<any> {
        let bodyParams = {
            "responsibleCode": assign.responsibleCode,
            "assignmentCode": assign.assignmentCode,
            "userId": this.wfHttpService.employeeCode,
            "status": status
        };
        console.log("updateStatusAssignment bodyParams:", bodyParams);
        return this.postService("updateStatusAssignment", bodyParams, true);
    }
    public getTaskStatus(_taskStatus: string): string {
        if (HCMConstant.AssignmentStatus.OPEN.equals(_taskStatus)) {
            return 'open';
        } else if (HCMConstant.AssignmentStatus.ONPROCESS.equals(_taskStatus)) {
            return 'onprocess';
        } else if (HCMConstant.AssignmentStatus.DONE.equals(_taskStatus)) {
            return 'done';
        } else if (HCMConstant.AssignmentStatus.CANCEL.equals(_taskStatus)) {
            return 'cancel';
        } else if (HCMConstant.AssignmentStatus.COMPLETE.equals(_taskStatus)) {
            return 'complete';
        } else if (HCMConstant.AssignmentStatus.ACCEPTED.equals(_taskStatus)) {
            return 'accepted';
        } else if (HCMConstant.AssignmentStatus.DENIED.equals(_taskStatus)) {
            return 'denied';
        } else {
            return null;
        }
    }

    public getFirstCalendarText() {
        return moment().calendar().split(" ")[0];
    }

    public collapsedToGroup(_assign: any[]): any[] {
        const currDateString: string = moment().format("D MMMM YYYY");
        let outputResp = [];
        (_assign || []).forEach(_assignItm => {
            let dateTime = moment(_assignItm.targetDate).format("D MMMM YYYY");
            _assignItm.targetDateTime = moment(_assignItm.targetDate + ' ' + _assignItm.targetTime).format("LT");
            let toDayObj: ObjectGroupDataM = outputResp.find(itm => itm.date == dateTime);
            if (!toDayObj) {
                toDayObj = {
                    "date": dateTime,
                    "dateId": moment(_assignItm.targetDate).format("YYYYMMDD"),//20181231
                    "task": [],
                };
                if (currDateString == dateTime) {
                    toDayObj.dateString = this.getFirstCalendarText();
                }
                toDayObj.task.push(_assignItm);
                outputResp.push(toDayObj);
            } else {
                toDayObj.task.push(_assignItm);
            }
        });

        outputResp.sort((a, b) => {
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

        return outputResp;
    }

    public getMyTaskStatus(responsibleList: any[]): string {
        responsibleList = responsibleList || [];
        let taskPerEmpCode = responsibleList.find((responsber) => responsber.employeeCode == this.appState.employeeCode);
        const status = taskPerEmpCode && (taskPerEmpCode.status || taskPerEmpCode.responsibleStatus);
        isChromeDev() && console.log("getMyStatus :", status, status && this.getTaskStatus(status));
        return status;
    }

    public getMyTaskStatusEqualsWith(responsibleList: any[], constAssignStatus: string): boolean {
        const taskPerEmpCode = this.getMyTaskStatus(responsibleList);
        return taskPerEmpCode && constAssignStatus.equals(taskPerEmpCode);
    }
}
export class ObjectGroupDataM {
    public date: string;
    public dateId: string;
    public dateString?: string;
    public task: any[];
}