import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('PAGE_LAYOUT_TEMPLATE', {
  eafModuleId: 'MD1171156748',
  entityId: 'EN_170520115608099_v001'
})
export class OrganizationTabEntityModel extends EAFModuleBase {

  @Field('COMPONENTNAME') public componentName: string;
  @Field('STATUS') public status: string;
  @Field('TABCOMPONENTNAME') public tabComponentName: string;
  @Field('TABNAME') public tabName: string;
  @Field('TABSEQ') public tabSeq: string;

  constructor() {
    super();
  }
}