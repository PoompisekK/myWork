import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
@Table('ORDERLINE', {
  eafModuleId: 'MD1171637788', entityId: 'EN_170428162525819_v001'
})
export class OrderLineDetailModel extends EAFModuleBase {
  @Field("WAIT_SEQ") public waitSeq:number;
  @Field("BRANCH") public branch:string;
  @Field("BUILDING") public building:string;
  @Field("EVENT_STATUS_DESC") public eventStatusDesc:string;
 constructor() {
    super();
  }
}