import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';

@Table('MS_LIST_BOX_MASTER', {
  eafModuleId: 'MD366432217', entityId: 'EN_272726090400444'
})
export class MasterListBoxModel extends EAFModuleBase {

  @Field('CODE') public code: string;
  @Field('DISPLAY_TEXT') public displayText: string;
  @Field('DESCRIPTION') public desc: string;

  constructor() {
    super();
  }
}