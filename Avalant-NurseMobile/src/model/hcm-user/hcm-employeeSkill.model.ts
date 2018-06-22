import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('EMPLOYEE_SKILL', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD1181151131',
})
export class EmployeeSkillModel extends EAFModuleBase {
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("EMPLOYEE_SKILL_NO") private employeeSkillNo: string;
    
    @Field("ORGANIZE_ID") private organizeId: string;
    @Field("SKILL_LEVEL") private skillLevel: string;
    @Field("SKILL_NO__DESC") private skillNoDesc: string;
    @Field("SKILL_NO") private skillNo: string;
}