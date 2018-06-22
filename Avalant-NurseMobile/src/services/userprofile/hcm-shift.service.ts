import { forwardRef, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppState } from '../../app/app.state';
import { EmployeeShiftRequestModel } from '../../model/hcm-user/hcm-employeeShiftRequest.model';
import { HCMEAFRestService } from '../eaf-rest/hcm-eaf-rest.service';
import { EmployeeShiftSwapRequestViewModel } from '../../model/hcm-user/hcm-employeeShiftSwapRequest.model';
import { EmployeeTeamGroupModel } from '../../model/hcm-user/hcm-teamGroup.model';
import { EmployeeSelectTeamModel } from '../../model/hcm-user/hcm-employeeSelectTeam.model';
import { EmployeeNotWorkingShiftViewModel } from '../../model/hcm-user/hcm-employeeNotWorkShift.model';

@Injectable()
export class HCMShiftRestService {
    constructor(
        private appState: AppState,
        @Inject(forwardRef(() => HCMEAFRestService)) private hcmEAFRestService: HCMEAFRestService,
    ) { }

    public getShift(doRefresh?: boolean): Observable<any> {
        return this.hcmEAFRestService.getModule(EmployeeShiftRequestModel);
    }

    public getShiftSwap(doRefresh?: boolean): Observable<any> {
        return this.hcmEAFRestService.getModule(EmployeeShiftSwapRequestViewModel);
    }

    public getTeamGroup(data?: { [key: string]: any }): Observable<any> {
        data = data ? data : {};
        data["EMPLOYEE_CODE"] = this.appState.businessUser.employeeCode;
        data["ORGANIZE_ID"] = this.appState.businessUser.orgId;
        return this.hcmEAFRestService.searchEntity(EmployeeTeamGroupModel, EmployeeTeamGroupModel.ENTITY_ID, data || {}, HCMEAFRestService.cfgSearch);
    }

    public getSelectTeam(data?: { [key: string]: any }): Observable<any> {
        data = data ? data : {};
        data["EMPLOYEE_CODE"] = this.appState.businessUser.employeeCode;
        data["ORGANIZE_ID"] = this.appState.businessUser.orgId;
        return this.hcmEAFRestService.searchEntity(EmployeeSelectTeamModel, EmployeeSelectTeamModel.ENTITY_ID, data || {}, HCMEAFRestService.cfgSearch);
    }

    public getNotWorkShift(data?: { [key: string]: any }): Observable<any> {
        data = data ? data : {};
        data["EMPLOYEE_CODE"] = this.appState.businessUser.employeeCode;
        data["ORGANIZE_ID"] = this.appState.businessUser.orgId;
        return this.hcmEAFRestService.searchEntity(EmployeeNotWorkingShiftViewModel, EmployeeNotWorkingShiftViewModel.ENTITY_ID, data || {}, HCMEAFRestService.cfgSearch);
    }

}
