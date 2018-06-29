import { forwardRef, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from '../../app/app.state';
import { EmployeeDelegateLeaveApproveViewModel } from '../../model/hcm-user/hcm-employeeDelegateLeaveApprove.model';
import { EmployeeLeaveApproveMyTaskViewModel } from '../../model/hcm-user/hcm-employeeLeaveApproveMyTask.model';
import { EmployeeShiftApproveViewModel } from '../../model/hcm-user/hcm-employeeShiftApprove.model';
import { EmployeeShiftSwapApproveViewModel } from '../../model/hcm-user/hcm-employeeShiftSwapApprove.model';
import { EmployeeSwapTransactionViewModel } from '../../model/hcm-user/hcm-employeeSwapTransaction.model';
import { HCMEAFRestService } from '../eaf-rest/hcm-eaf-rest.service';
import { EmployeeApproveStepViewModel } from '../../model/hcm-user/hcm-employeeApproveStep.model';
import { HttpRequestWFService } from '../../workforce/service/httpRequestWFService';
import { WorkforceHttpService } from '../../workforce/service/workforceHttpService';
import { URLSearchParams } from '@angular/http';
import { HCMRestApi } from '../../constants/hcm-rest-api';

@Injectable()
export class HCMApprovalRestService {
    private cfg = { page: '1', volumePerPage: '200' };

    private hcmUserProfileData: any;

    constructor(
        private appState: AppState,
        @Inject(forwardRef(() => HCMEAFRestService)) private hcmEAFRestService: HCMEAFRestService,
        private httpReqWFService: HttpRequestWFService,
        private wfHttpService: WorkforceHttpService
    ) { }

    public getLeaveApprove(doRefresh?: boolean): Observable<any> {
        return this.hcmEAFRestService.getModule(EmployeeLeaveApproveMyTaskViewModel);
    }

    public getDelegateLeaveApprove(doRefresh?: boolean): Observable<any> {
        return this.hcmEAFRestService.getModule(EmployeeDelegateLeaveApproveViewModel);
    }

    public getSwapTransactionApprove(doRefresh?: boolean): Observable<any> {
        return this.hcmEAFRestService.getModule(EmployeeSwapTransactionViewModel);
    }

    public getShiftApprove(doRefresh?: boolean): Observable<any> {
        return this.hcmEAFRestService.getModule(EmployeeShiftApproveViewModel);
    }

    public getShiftSwapApprove(doRefresh?: boolean): Observable<any> {
        return this.hcmEAFRestService.getModule(EmployeeShiftSwapApproveViewModel);
    }

    public getApproveStep(data?: { [key: string]: any }): Observable<any> {
        data = data ? data : {};        
        data["ORGANIZE_ID"] = this.appState.businessUser.orgId;
        return this.hcmEAFRestService.searchEntity(EmployeeApproveStepViewModel, EmployeeApproveStepViewModel.ENTITY_ID, data || {}, HCMEAFRestService.cfgSearch);
    }

    public updateApproveShiftSwapAcceptant(params, data?: { [key: string]: any }): Observable<any> {
        data = data ? data : {};
        params["ORGANIZE_ID"] = this.appState.businessUser.orgId;
        return this.hcmEAFRestService.saveEntityApprove('EN_180410095822891_v001', params, data || {}, HCMEAFRestService.cfgSearch);
    }
    
    public saveApproveShiftSwap(contextService: string, addtionalParam?: { [key: string]: any }): Observable<any[]> {
        let reqBody = new URLSearchParams();
        const importantParams = addtionalParam;
        Object.keys(importantParams).forEach(paramKey => {
            reqBody.set(paramKey, importantParams[paramKey]);
        });
        
        return Observable.create((observer) => {
            this.wfHttpService.httpGet<any>(HCMRestApi.URL + contextService, reqBody)
                // .timeout(this.httpTimeOut)
                .map((res) => this.mapResult(res))
                .subscribe((resp) => {
                    observer.next(resp);
                    observer.complete();
                }, (errMsg) => {
                    observer.error(errMsg);
                    observer.complete();
                });
        });
    }
    public saveRejectShift(contextService: string, addtionalParam?: { [key: string]: any }): Observable<any[]> {
        let reqBody = addtionalParam;
        
        return Observable.create((observer) => {
            this.wfHttpService.httpFormDataPost<any>(HCMRestApi.URL + contextService, reqBody)
                // .timeout(this.httpTimeOut)
                .map((res) => this.mapResult(res))
                .subscribe((resp) => {
                    observer.next(resp);
                    observer.complete();
                }, (errMsg) => {
                    observer.error(errMsg);
                    observer.complete();
                });
        });
    }
    private mapResult(res: any): any {
        if (res.messageCode == 0) {
            if (res.data != null) {
                return res.data.data || res.data;
            } else if (res.message != null) {
                return res.message || "success";
            } else {
                return "success";
            }
        } else {
            console.error("res.message :", res);
            if (res.message != null) {
                // throw new Error(res.message);
                return res.message || "error";
            } else {
                return null;
            }
        }
    }

}
