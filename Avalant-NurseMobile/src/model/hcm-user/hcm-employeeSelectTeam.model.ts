import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('EMPLOYEE_TEAM', {
    entityId: 'EN_180323020011687_v001',
    eafModuleId: 'MD1181320212',
})
export class EmployeeSelectTeamModel extends EAFModuleBase {
    @Field("TEAM_GROUP_TYPE") private teamGroupType: string;
    @Field("TEAM_GROUPNAME") private teamGroupName: string;
    @Field("TEAM_GROUP_NO") private teamGroupNo: string;
    @Field("ORGANIZE_ID") private organizeId: string;    
}