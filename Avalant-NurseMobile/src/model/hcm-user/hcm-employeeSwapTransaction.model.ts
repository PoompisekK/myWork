import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('EMPLOYEE_SWAP_TRANSACTION', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD1181839233',
})
export class EmployeeSwapTransactionViewModel extends EAFModuleBase {
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("FULL_NAME") private fullName: string;
    @Field("FULL_NAME_SWAP") private fullNameSwap: string;
    @Field("JOB_LEVEL_NAME") private jobLeaveName: string;
    @Field("JOB_NAME") private jobName: string;
    @Field("KEY") private kev: any;
    @Field("MY_SCHEDULE") private mySchedule: string;
    @Field("NODE_NAME") private nodeName: string;
    @Field("POSITOIN_NAME") private positionName: string;
    @Field("REQUEST_DATE") private requestDate: string;
    @Field("SHIFT_NAME_CODE") private shiftNameCode: string;
    @Field("STATUS") private status: string;
    @Field("SWAP_EMPLOYEE_CODE") private swapEmployeeCode: string;
    @Field("SWAP_NO") private swapNo: string;
    @Field("SWAP_SCHEDULE") private swapSchedule: string;
    @Field("SWAP_TYPE") private swapType: string;
    @Field("TEAM_GROUPNAME") private teamGroupName: string;   

}
