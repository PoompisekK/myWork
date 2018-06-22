import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('V_EMPLOYEE_SHIFT_REQ_APPROVE', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD1181914166',
})
export class EmployeeShiftApproveViewModel extends EAFModuleBase {
    @Field("APPROVE_EMPLOYEE_CODE") private approveEmployeeCode: string;
    @Field("APPROVE_FLOW_NO") private approveFlowNo: string;
    @Field("FROM_GROUP_NAME") private fromGroupName: string;
    @Field("KEY") private key: any;
    @Field("ORDER_NO") private orderNo: string;
    @Field("REASON") private reason: string;
    @Field("REQUEST_DATE") private requestDate: string;
    @Field("REQUEST_NAME") private requestName: string;
    @Field("REQUEST_SHIFT_DATE") private requestShiftDate: string;
    @Field("SHIFT_NAME_NAME") private shiftNameName: string;
    @Field("SHIFT_REQ_NO") private shiftReqNo: string;
    @Field("SHIFT_REQ_TYPE") private shiftReqType: string;
    @Field("STATUS") private status: string;
    @Field("SUBMITTER_NAME") private submitterName: string;
    @Field("TO_GROUP_NAME") private toGroupName: string;
}
