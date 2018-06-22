import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('V_EMPLOYEE_WORKING_HOURS', {
    entityId: 'EN_180321120511785_v001',
    eafModuleId: 'MD118125107',
})
export class EmployeeWorkingHoursModel extends EAFModuleBase {
    @Field("ADM") private adm: string;
    @Field("BUSINESS_YEAR") private businessYear: string;
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("MONTH_NO") private monthNo: string;
    @Field("OT") private ot: string;
    @Field("RLV") private rlv: string;
    @Field("WORKING_HOURS") private workingHours: string;
}
