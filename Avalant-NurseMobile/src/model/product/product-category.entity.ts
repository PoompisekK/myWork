import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { ProductItemModel } from './product-item.entity';
import { ProductModel } from './product';
import { CategoryModel } from './category.model';

/**
 * Product Category entity
 * 
 * @author NorrapatN
 * @since Wed Jun 07 2017
 */
@Table()
export class ProductCategoryModel extends EAFModuleBase {

  @Field('CATEGORY_ID')
  public id: string;

  @Field('CATEGORY_TYPE')
  public categoryType: string;

  @Field('PRODUCT_CATEGORY_CODE')
  public code: string;

  @Field('PRODUCT_CATEGORY_NAME')
  public name: string;

  @Field('V_STATUS')
  public statusText: string;

  public products: ProductModel[];
  public productItems: ProductItemModel[];

  public subCategoryList: CategoryModel[];

  /**
   * Mapped data of Products - Use for display on page only
   */
  public productsDisplay: any[];

}
