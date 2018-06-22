import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('ORGANIZATION_FOLLOWER', {
  eafModuleId: 'MD1171636281',
  entityId: 'EN_170625163517432_v001'
})
export class OrganizationFollowerModel extends EAFModuleBase {

  @Field('ORG_FOLLOWER_ID') public orgFollowerId: string;
  @Field('ORG_ID') public orgId: string;
  @Field('BUSINESS_USER_ID') public businessUserId: string;
  @Field('STATUS') public status: string;

}