import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HCMConstant } from '../../constants/hcm/hcm-constant';
import { ContsVariables } from '../global/contsVariables';
import { AttendeeModel, MeetingModel } from '../model/meeting.model.ts';
import { HttpRequestWFService } from './httpRequestWFService';
import { WorkforceHttpService } from './workforceHttpService';

@Injectable()
export class MeetingService {

    constructor(
        private wfHttpService: WorkforceHttpService,
        private httpReqWFService: HttpRequestWFService,
    ) {
    }

    private postService(contextService: string, addtionalParam?: { [key: string]: any }, isFormData?: boolean | false): Observable<any> {
        return this.httpReqWFService.postParamsService(contextService, addtionalParam, isFormData);
    }

    private getService(contextService: string, addtionalParam?: { [key: string]: any }): Observable<any[]> {
        return this.httpReqWFService.getParamsService(contextService, addtionalParam);
    }

    public getAllEmployee(messageInput: string): Observable<AttendeeModel[]> {
        return this.getService("/assign/getAllEmployee", { "q": messageInput });
    }
    public getMeeting(): Observable<any> {
        return this.getService("/assign/getAssignmenettask", { "assignType": "MEETING" });
    }
    public getResponsiblet() {
        return this.getService("/assign/getResponsibletask", { "assignType": "MEETING" });
    }
    public searchMeeting(keywordSearch: string): Observable<any> {
        return this.getService("/assign/getAssignmenettask", { "assignType": "MEETING", 'q': keywordSearch });
    }

    public createMeeting(meetingObj: any): Observable<string> {
        // return this.wfHttpService.httpJSONPost<any>(ContsVariables.HCMRestService + "/assign/create", meetingObj)
        return this.postService("/assign/create", meetingObj, true);
    }

    public getMeetingClassStatus(_taskStatus: string): string {
        if (HCMConstant.AssignmentStatus.OPEN.equals(_taskStatus)) {
            return 'open';
        } else if (HCMConstant.AssignmentStatus.ONPROCESS.equals(_taskStatus)) {
            return 'onprocess';
        } else if (HCMConstant.AssignmentStatus.ACCEPTED.equals(_taskStatus)) {
            return 'accepted';
        } else if (HCMConstant.AssignmentStatus.DENIED.equals(_taskStatus)) {
            return 'denied';
        } else if (HCMConstant.AssignmentStatus.CANCEL.equals(_taskStatus)) {
            return 'cancel';
        } else if (HCMConstant.AssignmentStatus.COMPLETE.equals(_taskStatus)) {
            return 'complete';
        } else {
            return null;
        }
    }

    public editMeeting(meeting: MeetingModel): Observable<string> {
        let body = {
            "assignmentCode": meeting.assignmentCode,
            "assignType": "MEETING",
            "organizeId": 0,
            "projectId": 1,
            "assignDesc": meeting.assignDesc,
            "topicDesc": meeting.topicDesc,
            "severityType": "H",
            "estimatehours": "",
            "placeDesc": meeting.placeDesc,
            "latitude": meeting.latitude,
            "longitude": meeting.longitude,
            "startDate": meeting.targetDate,
            "startTime": meeting.targetTime,
            "targetDate": meeting.targetDate,
            "targetTime": meeting.targetTime,
            "updateBy": "UserId",
            "listCancelAssign": meeting.listCancelAssign,
            "listAddAssign": meeting.listAddAssign,
            "listImageURL": meeting.listImageURL,
        };
        // this.assigns.push(assign);
        return this.wfHttpService.httpJSONPost<any>(ContsVariables.HCMRestService + "/assign/editAssignment", body);
    }

    public updateStatusResponsible(bodyParams: MeetingUpdateStatusModel): Observable<any> {
        return this.wfHttpService.httpJSONPost<any>(ContsVariables.HCMRestService + "/assign/updateStatusResponsible", bodyParams);
    }

}
export class MeetingUpdateStatusModel {
    public responsibleCode: string;
    public userId: string;
    public organizationId: string;
    public status: string;
}