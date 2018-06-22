import { Component, OnInit } from '@angular/core';
import { App, IonicPage, NavParams, Platform } from 'ionic-angular';

import { ShopTabModel } from '../../model/organization/shop-tab.model';
import { ProductItemModel } from '../../model/product/product-item.entity';
import { ProductService, ShopTypeProductLevel } from '../../services/product-service/product.service';
import { OrganizationPage } from '../organization-page/organization.page';

/**
 * Organization Home page
 * @author NorrapatN
 * @since Mon Jun 19 2017
 */
@IonicPage({
  segment: 'brands/:organizationId/home',
  priority: 'high',
  defaultHistory: ['OrganizationPage'],
})
@Component({
  selector: 'organization-home-page',
  templateUrl: './organization-home.page.html',
})
export class OrganizationHomePage implements OnInit {

  private shopGroup: any[];

  private shopTabList: ShopTabModel[];
  private orgPageInstance: OrganizationPage;

  constructor(
    private appCtrl: App,
    private navParams: NavParams,
    private productService: ProductService,
    private plt: Platform
  ) {
    this.shopTabList = navParams.get('shopTabs');
    // console.debug('💭 Shop tab models :', this.shopTabList);

    this.shopGroup = [];

    this.orgPageInstance = navParams.get('orgPageInstance');
  }

  public ngOnInit(): void {
    if (this.shopTabList && this.shopTabList.length) {
      for (let shopTab of this.shopTabList) {
        let productLevel = this.productService.getShopTypeProductLevel(shopTab.shopTypeId);
        let shopProductList = {
          groupName: shopTab.displayName,
          productList: null,
          productsDisplay: null,
          shopId: shopTab.shopId,
          shopTypeId: shopTab.shopTypeId,
        };

        this.shopGroup.push(shopProductList);

        if (productLevel == ShopTypeProductLevel.PRODUCT) {
          let volumePerPage: number = 4;
          if (this.plt.platforms().indexOf('ipad') > -1) {
            volumePerPage = 8;
          }
          else if (this.plt.platforms().indexOf('tablet') > -1 || this.plt.platforms().indexOf('phablet') > -1) {
            volumePerPage = 6;
          }
          this.productService.getPopularProducts(shopTab.shopId, {
            volumePerPage: volumePerPage
          }).subscribe((productModelList) => {
            shopProductList.productList = productModelList;
            // shopProductList.productsDisplay = ProductMapper.productToProductGrid(productModelList);
          });
        } else if (productLevel == ShopTypeProductLevel.PRODUCTITEM) {
          let volumePerPage: number = 4;
          if (this.plt.platforms().indexOf('ipad') > -1) {
            volumePerPage = 8;
          }
          else if (this.plt.platforms().indexOf('tablet') > -1 || this.plt.platforms().indexOf('phablet') > -1) {
            volumePerPage = 6;
          }
          this.productService.getPopularProductItems(shopTab.shopId, {
            volumePerPage: volumePerPage,
          }).subscribe((productModelList) => {
            shopProductList.productList = productModelList;
            // shopProductList.productsDisplay = ProductMapper.productItemToProductGrid(productModelList);
          });
        } else {
          console.warn(`Product Level : ${productLevel} / is invalid`);
          return;
        }
      }

      // console.debug('💭 Shop group: ', this.shopGroup);

    }
  }

  private productClick(e: any, shopTypeId: string, shopId: string): void {
    // console.debug('our product :', e);

    this.appCtrl.getRootNav().push('ProductPage', {
      ...this.navParams.data,
      productId: e.product.id,
      productItemId: e.product.refProduct instanceof ProductItemModel ? e.product.id : undefined,
      shopTypeId,
      shopId,
    });
  }

  private categoryClick(e: MouseEvent, shopTypeId: string): void {
    // console.debug('Category Click :', shopTypeId);
    this.orgPageInstance.gotoShopTab(shopTypeId);
  }

}
