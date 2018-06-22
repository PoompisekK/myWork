import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * @author Bundit.Ng
 * @since  Mon Aug 07 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@Table('PRODUCT_DETAIL_MEDIA', {
  eafModuleId: '',
  entityId: ''
})
export class ProductDetailMediaModel extends EAFModuleBase {
  @Field('PRODUCT_DETAIL_IMAGE_ID') public productDetailImageId: string;
  @Field('PRODUCT_DETAIL_ID') public productDetailId: string;
  @Field('PRODUCT_DETAIL_MEDIA_TYPE_ID') public productDetailMediaTypeId: string;
  @Field('NAME') public name: string;
  @Field('FILENAME') public filename: string;
  @Field('SEQ') public seq: string;
  @Field('MAIN_IMAGE') public mainImage: string;
  @Field('VIDEOLINK') public videolink: string;
  @Field('LATITUDE') public latitude: string;
  @Field('LONGTITUDE') public longtitude: string;
  @Field('IMAGE_KEY') public imageKey: string;

}
