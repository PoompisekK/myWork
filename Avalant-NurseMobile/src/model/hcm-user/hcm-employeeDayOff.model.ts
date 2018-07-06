import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table("V_EMPLOYEE_DAYOFF", {
    entityId: 'EN_180322161108642_v001',
    eafModuleId: 'MD1181611472',
})
export class EmployeeDayOffModel extends EAFModuleBase {
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("WORK_LOAD_DATE") private workLoadDate: string;   
}
