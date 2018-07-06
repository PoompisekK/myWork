import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('EMPLOYEE_RESOURCE_TEAM', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD1181535624',
})
export class EmployeeResourceViewModel extends EAFModuleBase {
    @Field("EFFECTIVE_DATE") private effectiveDate: string;
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("JOB_LEVEL") private jobLevel: string;
    @Field("JOB_NAME") private jobName: string;
    @Field("KEY") private key: any;
    @Field("NEED_RESOURCE_FROM") private needResourceFrom: string;
    @Field("NODE_NAME") private nodeName: string;
    @Field("NOTE") private note: string;
    @Field("POSITION_NAME") private positionName: string;
    @Field("REQUESTER") private request: string;
    @Field("REQUEST_SHIFT_NAME_CODE") private requestShiftNameCode: string;
    @Field("RESOURCE_REQ_NO") private resourceReqNo: string;
    @Field("RESOURCE_TEAM_NO") private resourceTeamNo: string;
    @Field("RESOURCE_WORK_IN") private resourceWorkIn: string;
    @Field("SHIFT") private shift: string;
    @Field("STATUS") private status: string;
    @Field("SUBMITTED_DATE") private submitedDate: string; 
}
