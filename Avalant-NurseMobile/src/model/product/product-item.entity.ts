import { Table, Field, FieldType, Id, SubModel } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { EAFRestApi } from '../../constants/eaf-rest-api';
import { ProductAttributeModel } from './product-attribute.model';
/**
 * Product Item Entity model
 * @author NorrapatN
 * @since Wed Jun 07 2017
 */
@Table('PRODUCT_ITEM', {
  eafModuleId: 'MD1171917256',
  entityId: 'EN_170405095846823_v001',
})
export class ProductItemModel extends EAFModuleBase {

  // @Field('ID')
  @Id('PRODUCT_ITEM_ID')
  public id: number;

  @Field('CATEGORYTYPE')
  public categoryType: string;

  @Field('PRODUCT_ITEM_ID')
  public itemId: string;

  @Field('PRODUCT_ITEM_DESC')
  public description: string;

  @Field('PRODUCT_ITEM_NAME')
  public productItemName: string;

  @Field('PRODUCT_NAME')
  @Field('V_NAME')
  public name: string;

  @Field('IMAGE_KEY')
  public imageKey: string;

  public get imageUrl(): string {
    return EAFRestApi.getImageUrl(this.imageKey);
  }

  @Field('ANNOUNCEMENT_DATE', {
    fieldType: FieldType.DATE
  })
  public announcementDate: Date;

  @Field('ANNOUNCEMENT_EXP_DATE', {
    fieldType: FieldType.DATE
  })
  public announcementExpireDate: Date;

  @Field('REFER_PRODUCT_ID', {
    fieldType: FieldType.NUMBER
  })
  public referProductId: number;

  @Field('REFER_PRODUCT_ITEM_ID', {
    fieldType: FieldType.NUMBER
  })
  public referProductItemId: number;

  @Field('REFER_SHOP_TYPE_ID', {
    fieldType: FieldType.NUMBER
  })
  public referShopTypeId: number;

  @Field('V_DISCOUNT', {
    fieldType: FieldType.NUMBER,
  })
  public discountPrice: number;

  // @Field('V_NAME')
  // public vName: string;

  @Field('V_PRICE', {
    fieldType: FieldType.NUMBER
  })
  public price: number;

  @Field('V_STOCK')
  public stock: string;

  @Field('SHOP_ID')
  public shopID: string;

  @Field('SHOP_PATH')
  public shopPath: string;

  public reservedStartDate: Date;

  public reservedEndDate: Date;

  @SubModel(ProductAttributeModel)
  public productAttributeList: ProductAttributeModel[];

}
