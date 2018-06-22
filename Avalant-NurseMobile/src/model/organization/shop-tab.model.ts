import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
/**
 * Shop Tab model for Organization
 * @author NorrapatN
 * @since Sat May 20 2017
 */
@Table('', {
  entityId: 'EN_170425175049164_v001',
})
export class ShopTabModel extends EAFModuleBase {

  // public static ENTITY_ID: string = 'EN_170425175049164_v001';

  /**
   * Organization ID
   */
  @Field('ID')
  public organizationId: string;

  /**
   * Shop ID
   */
  @Field('SHOP_ID')
  public shopId: string;

  /**
   * Shop type ID
   */
  @Field('SHOP_TYPE_ID')
  public shopTypeId: string;

  /**
   * Shop type name
   */
  @Field('SHOP_TYPE_NAME')
  public shopTypeName: string;

  /**
   * Localized display name
   */
  @Field('DISPLAYNAME')
  public displayName: string;

  /**
   * URL use to map with Page component 
   * @see getPageByPath() at app.declarations.ts
   */
  @Field('PATH_URL')
  public pathUrl: string;

}
