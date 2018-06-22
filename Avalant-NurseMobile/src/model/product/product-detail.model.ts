import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * Product detail Table
 * 
 * @author NorrapatN
 * @since Wed Jun 14 2017
 */
@Table('PRODUCT_DETAIL', {
  eafModuleId: 'MD117181413',
  entityId: 'EN_170405095846823_v001'
})
export class ProductDetailModel extends EAFModuleBase {

  @Field('PRODUCT_ID')
  public id: string;

  @Field('PRODUCT_DETAIL_ID')
  public detailId: string;

  @Field('V_TITLE')
  public title: string;

  @Field('V_MESSAGE')
  public message: string;

  public mediaList: any[];

}
