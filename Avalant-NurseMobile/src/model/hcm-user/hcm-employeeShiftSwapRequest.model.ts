import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('EMPLOYEE_SWAP_TRANSACTION', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD1181137885',
})
export class EmployeeShiftSwapRequestViewModel extends EAFModuleBase {
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("JOB_LEVEL_NAME") private jobLeaveName: string;
    @Field("JOB_NAME") private jobName: string;
    @Field("KEY") private key: any;
    @Field("MY_SCHEDULE") private mySchedule: string;
    @Field("MY_SCHEDULE_DATE") private myScheduleDate: string;
    @Field("MY_SCHEDULE_SHIFT") private myScheduleShift: string;
    @Field("MY_SCHEDULE_SHIFT_NAME") private myScheduleShiftName: string;
    @Field("NODE_NAME") private nodeName: string;
    @Field("POSITION_NAME") private positionName: string;
    @Field("REASON") private season: string;
    @Field("REQUEST_DATE") private requestDate: string;
    @Field("STATUS") private status: string;
    @Field("SWAP_EMPLOYEE_CODE") private swapEmployeeCode: string;
    @Field("SWAP_EMPLOYEE_NAME") private swapEmployeeName: string;
    @Field("SWAP_NO") private swapNo: string;
    @Field("SWAP_SCHEDULE") private swapSchedule: string;
    @Field("SWAP_SCHEDULE_DATE") private swapScheduleDate: string;
    @Field("SWAP_SCHEDULE_SHIFT") private swapScheduleShift: string;
    @Field("SWAP_SCHEDULE_SHIFT_NAME") private swapScheduleShiftName: string;
    @Field("SWAP_TYPE") private swapType: string;
    @Field("TEAM_GROUPNAME") private teamGroupname: string;
    @Field("WITHDRAW_FLAG") private withdrawFlag: string;
}
