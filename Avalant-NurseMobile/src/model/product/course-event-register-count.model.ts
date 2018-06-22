import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field, Id } from '../../services/eaf-rest/eaf-rest.decorators';

/**
 * Course Event Register Count response model
 * 
 * @author NorrapatN
 * @since Wed Jul 26 2017
 */
@Table(null, {
  entityId: 'EN_170713101632204_v001',
  eafModuleId: 'MD1171016610'
})
export class CourseEventRegisterCountModel extends EAFModuleBase {

  @Id('PRODUCT_ITEM_ID')
  public productItemId: string;

  @Field('REGISTRATION_NUMBER')
  public registrationNumber: string;

}
