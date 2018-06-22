import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CheckInOutModel, HistoryModel } from '../model/checkInOut.model';
import { HttpRequestWFService } from './httpRequestWFService';
import { WorkforceHttpService } from './workforceHttpService';

@Injectable()
export class CheckInOutService {
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

    public getStatusCheckInOut(): Observable<any> {
        return this.getService("/ta/getStatusCheckInOut");
    }

    public getCheckInOutHistory(): Observable<HistoryModel[]> {
        return this.getService("/ta/getCheckInOutHistory");
    }

    public saveCheckInOut(checkInOut: CheckInOutModel): Observable<string> {
        let bodyParams = {
            "employeeCode": this.wfHttpService.employeeCode,
            "timeTypeCode": checkInOut.status,
            "latitude": checkInOut.position.lat,
            "longitude": checkInOut.position.long,
            "altitude": ""
        };
        console.log("saveCheckInOut [" + bodyParams.timeTypeCode + "] bodyParams :", bodyParams);
        return this.postService("/ta/checkInOut", bodyParams, true);
    }
}