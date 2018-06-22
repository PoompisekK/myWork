import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestLeaveModel } from '../model/leave.model';
import { HttpRequestWFService } from './httpRequestWFService';
import { WorkforceHttpService } from './workforceHttpService';

@Injectable()
export class LeaveService {

    constructor(
        private wfHttpService: WorkforceHttpService,
        private httpReqWFService: HttpRequestWFService,
    ) {
    }

    public postApproveLeave(reqBody: { approveNo: string, approveOrderNo: string }): Observable<any[]> {
        return this.postLeaveService("/leave/approved", reqBody, true);
    }

    public postRejectLeave(reqBody: { approveNo: string, approveOrderNo: string, reason: string }): Observable<any[]> {
        return this.postLeaveService("/leave/rejected", reqBody, true);
    }

    public getLeaveType(): Observable<any[]> {
        return this.getLeaveService("/ta/getLeavetype");
    }

    public postCreateLeave(reqLeaveBody: any | RequestLeaveModel): Observable<any[]> {
        reqLeaveBody.employeeCodeRequest = reqLeaveBody.employeeCodeRequest || this.wfHttpService.employeeCode;
        return this.postLeaveService("/leave/create", reqLeaveBody, true);
    }

    public getLeaveSummaryYear(): Observable<any[]> {
        return this.getLeaveService("/ta/getLeaveSummaryYear");
    }

    public getLeaveShiftPeriod(_date: string): Observable<any[]> {
        return this.getLeaveService("/ta/shift", { date: _date });
    }

    public getDelegateEmployee(): Observable<any[]> {
        return this.getLeaveService("/leave/delegate-employee");
    }

    public getHistoryRequest(additional?: { [key: string]: any }): Observable<any[]> {
        return this.getLeaveService("/leave/history/request", additional);
    }

    public getHistoryDelegate(): Observable<any[]> {
        return this.getLeaveService("/leave/history/delegate");
    }

    public getHistoryAcknowledge(): Observable<any[]> {
        return this.getLeaveService("/leave/history/acknowledge");
    }

    public getCalendarHistoryMy(): Observable<any[]> {
        return this.getLeaveService("/leave/calendarHistory/my");
    }

    public getCalendarHistorySubordinate(): Observable<any[]> {
        return this.getLeaveService("/leave/calendarHistory/subordinate");
    }

    public getLeaveInfo(leaveTypeCode: string): Observable<any> {
        return this.getLeaveService("/leave/getLeaveInfo", { leaveTypeCode: leaveTypeCode });
    }
    public getCalLeaveDay(reqLeaveBody: any | RequestLeaveModel, fromDateHalf: string, toDateHalf: string): Observable<any> {
        reqLeaveBody.leaveType = reqLeaveBody.leaveCode;
        reqLeaveBody.fromDateHalf = fromDateHalf;
        reqLeaveBody.toDateHalf = toDateHalf;
        return this.postLeaveService("/leave/calLeaveDay", reqLeaveBody, true);
    }

    private postLeaveService(contextService: string, addtionalParam?: { [key: string]: any }, isFormData?: boolean | false): Observable<any> {
        return this.httpReqWFService.postParamsService(contextService, addtionalParam, isFormData);
    }

    private getLeaveService(contextService: string, addtionalParam?: { [key: string]: any }): Observable<any[]> {
        return this.httpReqWFService.getParamsService(contextService, addtionalParam);
    }
}