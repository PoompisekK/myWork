import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * @author Bundit.Ng
 * @since  Tue May 30 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@Table('VW_SEARCH_LIKE_TAG_NAME', {
  eafModuleId: 'MD5052509721',
  entityId: 'EN_105313894037069'
})
export class SearchResultViewModel extends EAFModuleBase {

  @Field('ORG_ID') public orgId: string;
  @Field('Q_NAME') public qName: string;
  @Field('CATEGORYTYPE') public categoryType: string;
  @Field('SHOPID') public shopId: string;

  @Field('ORG_NAME') public orgName: string;//Fn
  @Field('SHOP_NAME') public shopName: string;//Fn
  @Field('CATEGORY_NAME') public categoryName: string;//Fn

  @Field('ID') public id: string;
  @Field('NAME') public name: string;
  @Field('PARENTID') public parentId: string;
  @Field('PRODUCTCODE') public productCode: string;
  @Field('THUMBIMAGE') public thumbImage: string;
  @Field('REALIMAGE') public realImage: string;
  @Field('PRODUCTSTATUS') public productStatus: string;
  @Field('PRODUCTVIEWCOUNT') public productViewCount: string;
  @Field('PRODUCTLIKECOUNT') public productLikeCount: string;
  @Field('PRODUCTCOMMENTCOUNT') public productCommentCount: string;
  @Field('PROPERTIESCATIGORY') public propertiesCatigory: string;
  @Field('PRODUCTQTY') public productQTY: string;
  @Field('BASEID') public baseId: string;
  @Field('POINTRULE') public pointRule: string;
  @Field('POINTREDEMPTION') public pointRedemption: string;
  @Field('RULEPERIODAMT') public rulePeriodAmt: string;
  @Field('RULEPERIODUNIT') public rulePeriodUnit: string;
  @Field('REDEMPTIONPERIODAMT') public redemptionPeriodAmt: string;
  @Field('REDEMPTIONPERIODUNIT') public redemptionPeriodUnit: string;
  @Field('POINTEFF') public pointEff: string;
  @Field('QUANTITYSTEP') public quantityStep: string;
  @Field('CURQUANTITY') public curQuantity: string;
  @Field('FULLPRICE') public fullPrice: string;
  @Field('PRODUCTDESC') public productDesc: string;
  @Field('PRODUCTPRICE') public productPrice: string;
  @Field('TAGRELATE') public tagRelate: string;
  @Field('WHOLESALEAMT') public wholeSaleAmt: string;
  @Field('WHOLESALEPRICE') public wholeSalePrice: string;
  @Field('WHOLESALEEXPDATE') public wholeSaleExpDate: string;
  @Field('PLUSAMT') public plusAmt: string;
  @Field('PLUSPRODUCTID') public plusProductId: string;
  @Field('PLUSEXPDATE') public plusExpDate: string;
  @Field('ACTIVATESTATUS') public activateStatus: string;
  @Field('DISCOUNTPRICE') public discountPrice: string;
  @Field('DISCOUNTPERCENT') public discountPercent: string;
  @Field('DISCOUNTTYPE') public discountType: string;
  @Field('SUBCATEGORYTYPE') public subCategoryType: string;
  @Field('STOCKKEEPINGUNIT') public stockKeepingUnit: string;
  @Field('PRODUCTSHORTDESC') public productShortDesc: string;
  @Field('DEFAULT_CURRENCY_ID') public defaultCurrencyId: string;
  @Field('DISPLAY_SEQ') public displaySeq: string;
  @Field('CATEGORY_ID') public categoryId: string;
  @Field('PRODUCT_ID') public productId: string;

}