import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('V_EMPLOYEE_WORKING_SHIFT', {
    entityId: 'EN_180322163650789_v001',
    eafModuleId: 'MD1181637510',
})
export class EmployeeWorkingShiftViewModel extends EAFModuleBase {
    @Field("TEAM_GROUP_NO") private teamGroupNo: string;
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("SHIFT_NAME_CODE") private shiftNameCode: string;
    @Field("WORK_LOAD_DATE") private workLoadDate: string;
    @Field("SHIFT_NAME_NAME") private shiftNameName: string;
    @Field("FULL_NAME") private fullName: string;

}
