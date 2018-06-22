import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('V_LEAVE_SUMMARY_YEAR', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD1181659665',
})
export class EmployeeLeaveSummaryModel extends EAFModuleBase {
    @Field("BALANCE") private balance: string;
    @Field("BUSINESS_YEAR") private businessYear: string;
    @Field("DESCRIPTION") private description: string;
    @Field("ELIGIBLE") private eligible: string;
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("LEAVE_TYPE_NO") private leaveTypeNo: string;
    @Field("PENDING") private pending: string;
    @Field("USED") private used: string;
}
