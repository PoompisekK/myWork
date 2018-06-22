import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('V_EMPLOYEE_LEAVE_APPROVE', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD1182140468',
})
export class EmployeeLeaveApproveViewModel extends EAFModuleBase {
    @Field("APPROVE_DATE") private approveDate: string;
    @Field("APPROVE_EMPLOYEE_CODE") private approveEmployeeCode: string;
    @Field("APPROVE_FLOW_NO") private approveFlowNo: string;
    @Field("DELEGATE_NAME") private delegateName: string;
    @Field("END_DATE") private endDate: string;
    @Field("LEAVE_DAYS") private leaveDays: string;
    @Field("LEAVE_HOURS") private leaveHours: string;
    @Field("LEAVE_NO") private leaveNo: string;
    @Field("LEAVE_TYPE_NAME") private leaveTypeName: string;
    @Field("ORDER_NO") private orderNo: string;
    @Field("REASON") private reason: string;
    @Field("REQUEST_DATE") private requestDate: string;
    @Field("REQUEST_NAME") private requestName: string;
    @Field("SHIFT_NAME_NAME") private shiftNameName: string;
    @Field("START_DATE") private startDate: string;
    @Field("STATUS") private status: string;
    @Field("TIME_FROM") private timeFrom: string;
    @Field("TIME_TO") private timeTo: string;
}
