import { forwardRef, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppState } from '../../app/app.state';
import { EAFContext } from '../../eaf/eaf-context';
import { EmployeeConditionModel } from '../../model/hcm-user/hcm-employeeCondition.model';
import { EmployeeDelegateLeaveApproveViewModel } from '../../model/hcm-user/hcm-employeeDelegateLeaveApprove.model';
import { EmployeeDelegateLeaveApproveView2Model } from '../../model/hcm-user/hcm-employeeDelegateLeaveApprove2.model';
import { EmployeeInformationViewModel } from '../../model/hcm-user/hcm-employeeInformation.model';
import { EmployeeLeaveApproveViewModel } from '../../model/hcm-user/hcm-employeeLeaveApproveViewModel.model';
import { EmployeeLeaveTransactionModel } from '../../model/hcm-user/hcm-employees-leave.model';
import { EmployeeSkillModel } from '../../model/hcm-user/hcm-employeeSkill.model';
import { EmployeeProfileModel } from '../../model/hcm-user/hcm-userprofile.model';
import { HCMEAFRestService } from '../eaf-rest/hcm-eaf-rest.service';

@Injectable()
export class HCMUserProfileRestService {
    private cfg = { page: '1', volumePerPage: '200' };

    public HCMUserProfileData: any;

    constructor(
        private appState: AppState,
        @Inject(forwardRef(() => HCMEAFRestService)) private hcmEAFRestService: HCMEAFRestService,
    ) { }

    public getHCMUser(doRefresh?: boolean): Observable<any> {
        const activateEAFClazzList: any[] = [EmployeeSkillModel, EmployeeProfileModel, EmployeeConditionModel, EmployeeDelegateLeaveApproveViewModel,
            EmployeeDelegateLeaveApproveView2Model, EmployeeInformationViewModel, EmployeeLeaveTransactionModel, EmployeeLeaveApproveViewModel,];

        return Observable.create((observer) => {
            if ((doRefresh == false || !doRefresh) && this.HCMUserProfileData) {
                observer.next(this.HCMUserProfileData);
            } else {
                this.hcmEAFRestService.getEntities(EmployeeProfileModel.ENTITY_ID, activateEAFClazzList, {
                    EMPLOYEE_CODE: this.appState.businessUser && this.appState.businessUser.employeeCode,
                    ORGANIZE_ID: this.appState.currentOrganizationId
                }, this.cfg)
                    .map(resp => {
                        let resObj: any = {};
                        console.log("resp:", resp);
                        Object.keys(resp).forEach((moduleId => {
                            let eafModuleClass: any = (EAFContext.findEAFModuleClass(moduleId) || {});
                            let attrKeys: string = this.hcmEAFRestService.getEAFClassName(eafModuleClass);
                            if (attrKeys) {
                                attrKeys = this.hcmEAFRestService.toAttributeClassKey(attrKeys);
                                resObj[attrKeys] = resp[moduleId];
                            }
                        }));
                        return resObj;
                    })
                    .do(userObj => {
                        this.HCMUserProfileData = userObj;
                    })
                    .subscribe(resp => {
                        observer.next(resp);
                    });
            }
        });
    }
}
