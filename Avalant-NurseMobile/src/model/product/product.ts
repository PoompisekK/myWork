import { Table, Field, SubModel, Id, FieldType } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { ProductItemModel } from './product-item.entity';
import { ProductDetailModel } from './product-detail.model';
import { ProductImageModel } from './product-image.model';

/**
 * Product Module model
 * @author NorrapatN
 * @since Sat Jun 10 2017
 */
@Table('PRODUCT', {
  eafModuleId: 'MD117100184',
  entityId: 'EN_170405095846823_v001',
})
export class ProductModel extends EAFModuleBase {

  @Id()
  @Field('ID')
  public id: string;

  @Field('NAME')
  @Field('PRODUCT_NAME')
  public name: string;

  @Field('PRODUCTCODE')
  public code: string;

  @Field('PRODUCTDESC')
  public description: string;

  @Field('PRODUCTPRICE', {
    fieldType: FieldType.NUMBER
  })
  public price: number;

  @Field('FULLPRICE', {
    fieldType: FieldType.NUMBER
  })
  public fullPrice: number;

  @Field('PRODUCTSTATUS')
  public status: string;

  @Field('IMAGE_KEY')
  public image: string;

  @Field('THUMBIMAGE')
  public thumbImage: string;

  @Field('CATEGORYTYPE')
  public categoryType: string;

  @Field('SUBCATEGORYTYPE')
  public subCategoryType: string;

  @Field('DISCOUNTPERCENT')
  public discountPercent: string;

  @Field('DISCOUNTPRICE', {
    fieldType: FieldType.NUMBER,
  })
  public discountPrice: number;

  @Field('DISCOUNTTYPE')
  public discountType: string;

  @Field('SHOPID')
  public shopId: string;

  @Field('SHOP_TYPE_ID')
  public shopTypeId: string;

  @SubModel(ProductItemModel)
  public productItemList: ProductItemModel[];

  @SubModel(ProductDetailModel)
  public productDetailList: ProductDetailModel[];

  @SubModel(ProductImageModel)
  public productImageList: ProductImageModel[];

  public productRelatedList: any[];

}
