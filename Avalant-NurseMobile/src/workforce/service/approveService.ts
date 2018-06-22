import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpRequestWFService } from './httpRequestWFService';

@Injectable()
export class ApproveService {
    private documentType_LEAVE = "DT00003";
    private documentType_EXPENSE = "DT00010";
    constructor(
        private httpReqWFService: HttpRequestWFService,
    ) { }

    private postApproveService(contextService: string, addtionalParam?: { [key: string]: any }, isFormData?: boolean | false): Observable<any> {
        return this.httpReqWFService.postParamsService("/approve/task/" + contextService, addtionalParam, isFormData);
    }

    private getApproveService(contextService: string, addtionalParam?: { [key: string]: any }): Observable<any[]> {
        return this.httpReqWFService.getParamsService("/approve/task/" + contextService, addtionalParam);
    }

    public getMyLeaveTaskList(): Observable<any[]> {
        return this.getApproveService("mytask", { documentType: this.documentType_LEAVE, });
    }
    public getMyExpenseTaskList(): Observable<any[]> {
        return this.getApproveService("mytask", { documentType: this.documentType_EXPENSE, });
    }

    public getDelegateLeaveTask(): Observable<any[]> {
        return this.getApproveService("delegatetask", { documentType: this.documentType_LEAVE, });
    }
    public getDelegateExpenseTask(): Observable<any[]> {
        return this.getApproveService("delegatetask", { documentType: this.documentType_EXPENSE, });
    }

}