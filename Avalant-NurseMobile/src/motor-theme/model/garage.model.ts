import { Table, Id, FieldType, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../../model/eaf-rest/eaf-module-base';

/**
 * Garage that related to Product.
 * 
 * @author NorrapatN
 * @since Thu Nov 09 2017
 */
@Table('product_item_service', {
  entityId: 'EN_171107132755536_v001',
  eafModuleId: 'MD1171328641',
})
export class GarageModel extends EAFModuleBase {

  @Id('SERVICE_ITEM_ID', {
    fieldType: FieldType.NUMBER
  })
  public serviceItemId: number;

  @Field('NAME')
  public name: string;

  @Field('PRICE', {
    fieldType: FieldType.NUMBER
  })
  public price: number;

  @Field('FULL_PRICE', {
    fieldType: FieldType.NUMBER
  })
  public fullPrice: number;

  @Field('PRODUCT_ITEM_ID')
  public productItemId: string;

  @Field('PRODUCTCODE')
  public productCode: string;

  @Field('PRODUCT_ITEM_NAME')
  public productItemName: string;

  @Field('SERVICE_PRODUCT_ITEM_ID')
  public serviceProductItemId: string;

}
