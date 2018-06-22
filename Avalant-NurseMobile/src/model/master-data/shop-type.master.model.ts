import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';

/**
 * Shop type Master model
 * 
 * @author NorrapatN
 * @since Mon Jun 05 2017
 */
@Table('MS_SHOP_TYPE', {
  entityId: 'EN_170421145309770_v001'
})
export class ShopTypeMasterModel extends EAFModuleBase {

  @Field('SHOP_TYPE_ID')
  public shopTypeId: string;

  @Field('SHOP_TYPE_NAME')
  public shopTypeName: string;

}
