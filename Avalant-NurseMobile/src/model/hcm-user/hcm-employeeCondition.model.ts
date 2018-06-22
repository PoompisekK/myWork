import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('EMPLOYEE_CONDITION', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD1181739143',
})
export class EmployeeConditionModel extends EAFModuleBase {
    @Field("CONDITION_NO") private conditionNo: string;
    @Field("CONDITION_NO__DESC") private conditionNoDesc: string;
    @Field("EFFECTIVE_DATE") private effectiveDate: string;
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("EMPLOYEE_CON_NO") private employeeConNo: string;
    @Field("END_DATE") private endDate: string;
    
    @Field("ORGANIZE_ID") private organizeId: string;
}
