import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * Product Category entity
 * 
 * @author Kerdkaw
 * @since 02/08/2017
 */

@Table('', {
  eafModuleId: 'MD1171144869',
  entityId: 'EN_170523114415249_v001'
})
export class CategoryModel extends EAFModuleBase {
  @Field('CATEGORY_ID') public categoryID: string;
  @Field('ID') public id: string;
  @Field('PARENT_CATEGORY_ID') public parentCategoryID: string;
  @Field('PRODUCT_CATEGORY_NAME') public productCategoryName: string;
  @Field('SHOP_ID') public shopID: string;
  @Field('SHOP_TYPE_ID') public shopTypeID: string;
  @Field('SHOP_TYPE_NAME') public shopTypeName: string;

  public name: string;
}