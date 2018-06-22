import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('PRODUCT_FAVERITE', {
  eafModuleId: 'MD1171717359',
  entityId: 'EN_170428171434145_v001'
})
export class ProductFavoriteModel extends EAFModuleBase {

  @Field('PRODUCT_FAVERITE_ID') public productFaveriteId: string;
  @Field('PRODUCT_ID') public productId: string;
  @Field('BUSINESS_USER_ID') public businessUserId: string;
  @Field('PRODUCT_ITEM_ID') public productItemId: string;
  @Field('FAVERITE_TYPE') public faveriteType: string;
}