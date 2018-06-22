import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('EMPLOYEE_LEAVE_TRANSACTION', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD1181422464',
})
export class EmployeeLeaveTransactionModel extends EAFModuleBase {
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("FROM_DATE") private fromDate: string;
    @Field("LEAVE_DAYS") private leaveDays: string;
    @Field("LEAVE_HOURS") private leaveHours: string;
    @Field("LEAVE_NO") private leaveNo: string;
    @Field("LEAVE_TYPE_NO__DESC") private leaveTypeNoDesc: string;
    @Field("REASON") private reason: string;
    @Field("REQUEST_DATE") private requestDate: string;
    @Field("SHIFT_NAME_CODE__DESC") private shiftNameCodeDesc: string;
    @Field("STATUS") private status: string;
    @Field("T_TIME_FROM") private tTimeFrom: string;
    @Field("T_TIME_TO") private tTimeTo: string;
    @Field("TO_DATE") private toDate: string;
}
