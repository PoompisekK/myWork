import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('V_EMPLOYEE_SWAP_APPROVE', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD118173190',
})
export class EmployeeShiftSwapApproveViewModel extends EAFModuleBase {
    @Field("APPROVE_EMPLOYEE_CODE") private approveEmployeeCode: string;
    @Field("APPROVE_FLOW_NO") private approveFlowNo: string;
    @Field("KEY") private key: any;    
    @Field("ORDER_NO") private orderNo: string;
    @Field("REQUEST_DATE") private requestDate: string;
    @Field("REQUEST_NAME") private requestName: string;
    @Field("STATUS") private status: string;
    @Field("MY_SCHEDULE_DATE") private myScheduleDate: string;
    @Field("MY_SCHEDULE_SHIFT") private myScheduleShift: string;
    @Field("SWAP_NAME") private swapName: string;
    @Field("SWAP_NO") private swapNo: string;
    @Field("SWAP_SCHEDULE_DATE") private swapScheduleDate: string;
    @Field("SWAP_SCHEDULE_SHIFT") private swapScheduleShift: string;
    @Field("SWAP_TYPE") private swapType: string;

}
