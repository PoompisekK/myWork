import { forwardRef, Inject, Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs';

import { AppConstant } from '../../constants/app-constant';
import { EAFModelWithMethod } from '../../model/eaf-rest/eaf-model-with-method.model';
import { IEAFRestHeader } from '../../model/eaf-rest/eaf-rest-header';
import { CategoryModel } from '../../model/product/category.model';
import { CourseEventRegisterCountModel } from '../../model/product/course-event-register-count.model';
import { ProductModel } from '../../model/product/product';
import { ProductAttributeModel } from '../../model/product/product-attribute.model';
import { ProductCategoryModel } from '../../model/product/product-category.entity';
import { ProductFavoriteModel } from '../../model/product/product-favorite.model';
import { ProductItemModel } from '../../model/product/product-item.entity';
import { ProductManualModel } from '../../model/product/product-manual.model';
import { ProductReviewModel } from '../../model/product/product-review.model';
import { UserModel } from '../../model/user/user.model';
import { EAFRestService } from '../eaf-rest/eaf-rest.service';

/**
 * @author Bundit.Ng
 * @since  Mon May 22 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@Injectable()
export class ProductService {
  constructor(
    @Inject(forwardRef(() => EAFRestService)) private eafRestSerivce: EAFRestService,
    private plt: Platform
  ) { }

  public static getShopTypeProductLevel(shopTypeId: string): ShopTypeProductLevel {
    switch (shopTypeId) {
      case '1':
      case '6':
        return ShopTypeProductLevel.PRODUCT;

      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        return ShopTypeProductLevel.PRODUCTITEM;

      default:
        return null;
    }
  }

  // public findGetProductFunction(shopTypeId: string): Function {
  //   switch (shopTypeId) {
  //     case '1':
  //     case '6':
  //       return this.

  //     case '2':
  //     case '3':
  //     case '4':
  //     case '5':
  //     case '6':
  //       return ShopTypeProductLevel.PRODUCTITEM
  //     default:
  //       return null
  //   }
  // }

  public getShopTypeProductLevel(shopTypeId: string): ShopTypeProductLevel {
    return ProductService.getShopTypeProductLevel(shopTypeId);
  }

  /**
   * Get Product data (Product Level) with Product Items & Product detail & others.
   * 
   * @param productId Product Id
   */
  public getProductInfoById(productId: string): Observable<ProductModel> {
    return this.eafRestSerivce.getEntity('EN_170405095846823_v001', ProductModel, {
      ID: productId,
    });
    // .map((response) => {
    //   // TODO: Map with automation
    //   // this is manual map
    //   let productModel: ProductModel = <ProductModel>response.MD117100184[0];
    //   productModel.productDetailList = <ProductDetailModel[]>response.MD117181413;
    //   productModel.productImageList = <ProductImageModel[]>response.MD1171827432;
    //   productModel.productItemList = <ProductItemModel[]>response.MD1171917256;

    //   return productModel;
    // });
  }

  public getProductMediaInfoById(productId: string): Observable<ProductModel> {
    return this.eafRestSerivce.getManualServlet('getProductByProductId', ProductManualModel, {
      productId,
    }).map((response) => Object.assign(new ProductModel, response));
  }

  public getProductItemInfoById(productItemId: string): Observable<any> {
    // Not tested.
    return this.eafRestSerivce.getEntityMapByModules('EN_170502115908037_v001', null, {
      ID: productItemId,
    });
  }

  public getProductItemInfoManualById(productItemId: string, orgId?: string): Observable<ProductModel> {
    // TODO: 
    // DMPManualServlet?key=getDonationDetailByProductItemId&productItemId=961
    return this.eafRestSerivce.getManualServlet('getDonationDetailByProductItemId', ProductManualModel, {
      productItemId,
      orgId,
    }).map((response) => Object.assign(new ProductModel, response));
  }

  public getProductCategoriesByShop(SHOP_ID: string): Observable<ProductCategoryModel[]> {
    return this.eafRestSerivce.searchEntity(ProductCategoryModel, 'EN_5920181179976', {
      SHOP_ID
    });
  }

  public getProductCategoriesByShopฺBaseOnProduct(SHOP_ID: string): Observable<ProductCategoryModel[]> {
    return this.eafRestSerivce.searchEntity(ProductCategoryModel, 'EN_5331777379597', {
      SHOP_ID
    });
  }

  public getProductFavoriteStatus(productItm: ProductModel, userModel: UserModel): Observable<any> {
    let params = {};
    // console.log("productItm:", productItm);
    params['BUSINESS_USER_ID'] = userModel.id;
    params['PRODUCT_ID'] = productItm.id;
    return this.eafRestSerivce.searchEntity(ProductFavoriteModel, ProductFavoriteModel.ENTITY_ID, params, EAFRestService.cfgSearch).map((response) => response && response[0]);
  }

  public getToggleProductFavorite(productFavoriteItm: ProductFavoriteModel): Observable<any> {
    return this.eafRestSerivce.saveEntity(ProductFavoriteModel.ENTITY_ID,
      [new EAFModelWithMethod(productFavoriteItm, EAFRestService.getInsertUpdateByPrimaryKey(productFavoriteItm.productFaveriteId))], {});
  }

  public getProductItemsByCategory(CATEGORYTYPE: string, searchOptions?: IEAFRestHeader): Observable<ProductItemModel[]> {
    return this.eafRestSerivce.searchEntity(ProductItemModel, 'EN_170509161637683_v001', {
      CATEGORYTYPE
    }, searchOptions);
  }

  /**
   * Getting Categories with Product items (Product Item Level). Filtered by Shop ID
   * 
   * @description Use in case of Categories with Product Item level.
   * 
   * @param SHOP_ID Shop ID
   * @return {Observable<ProductCategoryModel[]>} Result as Categories list and Product items are asynchronous.
   */
  public getCategoriesWithProductItemsByShop(SHOP_ID: string): Observable<ProductCategoryModel[]> {
    return this.getProductCategoriesByShop(SHOP_ID).do((categoriesResponse) => {
      // console.debug('Product categories : ', categoriesResponse)
      let tmpShopCategoryList;
      this.getAllCategoryByShopIDManualServlet(SHOP_ID).subscribe(resp => {
        // console.log('category list ' + 'shop id ' + SHOP_ID + ' => ', resp);
        tmpShopCategoryList = resp;
      });
      if (Array.isArray(categoriesResponse) && categoriesResponse.length) {
        let volumePerPage: number = 4;
        if (this.plt.platforms().indexOf('ipad') > -1) {
          volumePerPage = 8;
        }
        else if (this.plt.platforms().indexOf('tablet') > -1 || this.plt.platforms().indexOf('phablet') > -1) {
          volumePerPage = 6;
        }
        categoriesResponse.forEach((category) => {
          let searchOptions: IEAFRestHeader = {
            volumePerPage: volumePerPage
          };
          this.getProductItemsByCategory(category.id, searchOptions).subscribe((products) => {
            category.productItems = products;
            // category.productsDisplay = ProductMapper.productItemToProductGrid(products);
            category.subCategoryList = [];
            if (tmpShopCategoryList && tmpShopCategoryList.length > 0) {
              for (let i of tmpShopCategoryList) {
                if (i.category_id == category.id) {
                  category.subCategoryList = i.sub_category;
                }
              }
            }
          }, (error) => {
            console.warn('⚠️ Error loading ProductItems :', error);
          });
        });
      }
    });
  }

  /**
   * Get Products by Shop and Category type
   * 
   * @param SHOP_ID Shop ID
   * @param CATEGORYTYPE Category Type ID
   */
  public getProductsByShop(SHOPID: string, CATEGORYTYPE: string): Observable<ProductModel[]> {
    let volumePerPage: number = 4;
    if (this.plt.platforms().indexOf('ipad') > -1) {
      volumePerPage = 8;
    }
    else if (this.plt.platforms().indexOf('tablet') > -1 || this.plt.platforms().indexOf('phablet') > -1) {
      volumePerPage = 6;
    }
    return this.eafRestSerivce.searchEntity(ProductModel, 'EN_80516452993861' /*'EN_170405095846823_v001'*/, {
      SHOPID,
      CATEGORYTYPE,
      PRODUCTSTATUS: '1'
    }, {
        page: 1,
        volumePerPage: volumePerPage
      });
  }

  /**
   * Get Categories with Products (Product Level) by specified Shop ID
   * 
   * @param SHOP_ID Shop ID
   */
  public getCategoriesWithProductsByShop(SHOP_ID: string): Observable<ProductCategoryModel[]> {
    return this.getProductCategoriesByShopฺBaseOnProduct(SHOP_ID).do((categoriesResponse) => {
      console.debug('💭 Product categories : ', categoriesResponse);
      if (Array.isArray(categoriesResponse) && categoriesResponse.length) {
        categoriesResponse.forEach((category) => {
          this.getProductsByShop(SHOP_ID, category.id).subscribe((products) => {
            category.products = products;
            category.subCategoryList = [];
            // category.productsDisplay = ProductMapper.productToProductGrid(products);
            this.getSubCategoryByParentCategoryID(category.id).subscribe(resp => {
              category.subCategoryList = resp;
            });
          }, (error) => {
            console.warn('⚠️ Error loading Products', error);
          });
        });
      }
    });
  }

  public getPopularProducts(SHOPID: string, searchOptions?: IEAFRestHeader): Observable<ProductModel[]> {
    return this.eafRestSerivce.searchEntity(ProductModel, 'EN_24757464559961', {
      SHOPID,
    }, searchOptions);
  }

  public getPopularProductItems(SHOPID: string, searchOptions?: IEAFRestHeader): Observable<ProductItemModel[]> {
    return this.eafRestSerivce.searchEntity(ProductItemModel, 'EN_99335307466369', {
      SHOPID,
    }, searchOptions);
  }

  public getProductReview(productID: string): Observable<ProductReviewModel[]> {
    return this.eafRestSerivce.searchEntity(ProductReviewModel, ProductReviewModel.ENTITY_ID, {
      'PRODUCTID': productID
    });
  }

  public addProductReview(productID: string, memberID: string, reviewDesc: string): Observable<any> {
    let tmpReview: ProductReviewModel = new ProductReviewModel();
    tmpReview.memberID = memberID;
    tmpReview.productID = productID;
    tmpReview.reviewDesc = reviewDesc;
    tmpReview.reviewStatus = '1';

    return this.eafRestSerivce.saveEntity(ProductReviewModel.ENTITY_ID, [new EAFModelWithMethod(tmpReview, 'INSERT')], {});
  }

  public getProductAttributes(PRODUCT_ITEM_ID: string, ATTRIBUTE_TYPE_ID: string): Observable<ProductAttributeModel[]> {
    return this.eafRestSerivce.searchEntity(ProductAttributeModel, 'EN_170531163141370_v001', {
      PRODUCT_ITEM_ID,
      ATTRIBUTE_TYPE_ID,
    });
  }

  /**
   * Get Course Event Register count
   * 
   * @param PRODUCT_ITEM_ID Product Item ID
   */
  public getCourseEventRegisterCount(PRODUCT_ITEM_ID: string): Observable<string> {
    return this.eafRestSerivce.searchEntity(CourseEventRegisterCountModel, CourseEventRegisterCountModel.ENTITY_ID, {
      PRODUCT_ITEM_ID,
    }, { volumePerPage: 1 }).map((response) => response && response[0].registrationNumber);
  }

  public getGroupEventRegisterCount(productItemId: string): Observable<string> {
    return this.getProductAttributes(productItemId, AppConstant.PRODUCT_ATTRIBUTE_TYPES.RESERVED_PERSON_LIMIT)
      .map((response) => response && response[0].attributeNumber + '');
  }

  /**
   * Get all category from shopID
   * 
   * @param SHOP_ID Shop ID
   */
  public getAllCategoryByShopID(shopID: string): Observable<CategoryModel[]> {
    return this.eafRestSerivce.searchEntity(CategoryModel, CategoryModel.ENTITY_ID, {
      SHOP_ID: shopID
    });
  }

  /**
   * Get sub category from parent category ID
   * 
   * @param PARENT_CATEGORY_ID Parent category ID
   */
  public getSubCategoryByParentCategoryID(categoryID: string): Observable<CategoryModel[]> {
    return this.eafRestSerivce.searchEntity(CategoryModel, CategoryModel.ENTITY_ID, {
      PARENT_CATEGORY_ID: categoryID
    });
  }

  public getAllCategoryByShopIDManualServlet(shopId: string): Observable<any> {
    return this.eafRestSerivce.getManualServlet('CategoryListFilterREST', null, { shopId });
  }
}

/**
 * Shop type Product level Enum
 */
export enum ShopTypeProductLevel {
  PRODUCT = <any>"product",
  PRODUCTITEM = <any>"productItem",
}
