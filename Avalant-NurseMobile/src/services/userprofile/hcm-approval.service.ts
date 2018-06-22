import { forwardRef, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from '../../app/app.state';
import { EmployeeDelegateLeaveApproveViewModel } from '../../model/hcm-user/hcm-employeeDelegateLeaveApprove.model';
import { EmployeeLeaveApproveViewModel } from '../../model/hcm-user/hcm-employeeLeaveApproveViewModel.model';
import { EmployeeSwapTransactionViewModel } from '../../model/hcm-user/hcm-employeeSwapTransaction.model';
import { HCMEAFRestService } from '../eaf-rest/hcm-eaf-rest.service';
import { EmployeeShiftApproveViewModel } from '../../model/hcm-user/hcm-employeeShiftApprove.model';
import { EmployeeShiftSwapApproveViewModel } from '../../model/hcm-user/hcm-employeeShiftSwapApprove.model';

@Injectable()
export class HCMApprovalRestService {
    private cfg = { page: '1', volumePerPage: '200' };

    private hcmUserProfileData: any;

    constructor(
        private appState: AppState,
        @Inject(forwardRef(() => HCMEAFRestService)) private hcmEAFRestService: HCMEAFRestService,
    ) { }

    public getLeaveApprove(doRefresh?: boolean): Observable<any> {
        return this.hcmEAFRestService.getModule(EmployeeLeaveApproveViewModel);
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


}