import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('EMPLOYEE_SHIFT_REQUEST', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD118197545',
})
export class EmployeeShiftRequestModel extends EAFModuleBase {
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("FROM_GROUP_NAME") private fromGroupName: string;
    @Field("FULL_NAME") private fullName: string;
    @Field("JOB_LEVEL_NAME") private jobLeaveName: string;
    @Field("JOB_NAME") private jobName: string;
    @Field("NODE_NAME") private nodeName: string;
    @Field("POSITION_NAME") private positionName: string;
    @Field("REASON") private reason: string;
    @Field("REQUEST_DATE") private requestDate: string;
    @Field("REQUEST_SHIFT_DATE") private requestShiftDate: string;
    @Field("SHIFT_NAME_NAME") private shiftNameName: string;
    @Field("SHIFT_REQ_NO") private shiftReqNo: string;
    @Field("STATUS") private status: string;
    @Field("TO_GROUP_NAME") private toGroupName: string;
    @Field("WITHDRAW_FLAG") private withdrawFlag: string;
    
}
