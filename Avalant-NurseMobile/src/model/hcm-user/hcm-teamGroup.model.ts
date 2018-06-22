import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table("EMPLOYEE_PROFILE", {
    entityId: 'EN_180404090545467_v001',
    eafModuleId: 'MD1181148788',
})
export class EmployeeTeamGroupModel extends EAFModuleBase {
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("ORGANIZE_ID") private organizeId: string;
    @Field("TEAM_GROUP_NO") private teamGroupNo: string;
    @Field("TEAM_GROUPNAME") private teamGroupname: string;
}
