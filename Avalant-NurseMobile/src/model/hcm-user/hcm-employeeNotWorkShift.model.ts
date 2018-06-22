import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('V_EMPLOYEE_NOT_WORKING_SHIFT', {
    entityId: 'EN_1058812792_v001',
    eafModuleId: 'MD9269499998',
})
export class EmployeeNotWorkingShiftViewModel extends EAFModuleBase {
    @Field("AS_DATE") private asDate: string;
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("SHIFT_NAME_CODE") private shiftNameCode: string;
    @Field("SHIFT_NAME_NAME") private shiftNameName: string;
}
