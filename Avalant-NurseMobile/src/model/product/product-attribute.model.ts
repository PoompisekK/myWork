import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field, Id, FieldType } from '../../services/eaf-rest/eaf-rest.decorators';
/**
 * Product Attribute
 * 
 * @author NorrapatN
 * @since Mon Jun 26 2017
 */
@Table('product_attribute', {
  entityId: 'EN_170531163141370_v001',
})
export class ProductAttributeModel extends EAFModuleBase {

  /**
   * @field PRODUCT_ATTRIBUTE_ID
   */
  @Id('PRODUCT_ATTRIBUTE_ID')
  public id: number;

  @Field('ATTRIBUTE_TYPE_ID')
  public attributeTypeId: string;

  @Field('ATTRIBUTE_TYPE_VALUE_ID')
  public attributeTypeValueId: string;

  @Field('PRODUCT_ATTRIBUTE_DATE', {
    fieldType: FieldType.DATE,
  })
  public attributeDate: Date;

  @Field('PRODUCT_ATTRIBUTE_NUMBER', {
    fieldType: FieldType.NUMBER
  })
  public attributeNumber: number;

  @Field('PRODUCT_ATTRIBUTE_TEXT')
  public attributeText: string;

  @Field('PRODUCT_ITEM_ID')
  public productItemId: string;

}
