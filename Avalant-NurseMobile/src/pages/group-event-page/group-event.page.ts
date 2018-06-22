import { Component, OnInit } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppState } from '../../app/app.state';
import { CategoryModel } from '../../model/product/category.model';
import { ProductCategoryModel } from '../../model/product/product-category.entity';
import { ProductService } from '../../services/product-service/product.service';

/**
 * Group Event page
 * @author NorrapatN
 * @since Wed Jun 21 2017
 */
@IonicPage({
  segment: 'group-event',
  priority: 'high',
  defaultHistory: ['OrganizationPage'],
})
@Component({
  selector: 'group-event-page',
  templateUrl: './group-event.page.html'
})
export class GroupEventPage implements OnInit {

  private groupOfGroupEvent: ProductCategoryModel[];
  private shopTypeId: string;

  constructor(
    private appCtrl: App,
    private navCtrl: NavController,
    private navParams: NavParams,
    private productService: ProductService,
    private appState: AppState
  ) { }

  public ngOnInit(): void {
    // console.debug('💭 params :', this.navParams);
    let shopId: string = this.navParams.get('shopId');
    this.shopTypeId = this.navParams.get('shopTypeId');

    this.productService.getCategoriesWithProductItemsByShop(shopId).subscribe((response) => {
      // console.debug('(GroupEventPage) Mapped Categories with products : ', response);
      this.groupOfGroupEvent = response;
    }, (error) => {
      console.warn('Error get store product by Organization :', error);
    });
  }

  private groupEventClick(e: any): void {
    // console.debug('courseClick :', e);
    this.appCtrl.getRootNav().push('ProductPage', {
      ...this.navParams.data,
      productId: e.product.id,
      productItemId: e.product.refProduct.itemId,
      shopTypeId: this.shopTypeId,
    });
  }

  private categoryClick(e: any, categoryID: string, categoryName: string) {
    // console.log('category click => ', e, ' category id => ', categoryID);
    this.appCtrl.getRootNav().push('SearchPage', { organizationId: this.appState.currentOrganizationId, categoryID: categoryID, categoryName: categoryName });
  }

  private subCategoryClick(e: CategoryModel) {
    // console.log('sub category click => ', e);
    this.appCtrl.getRootNav().push('SearchPage', { organizationId: this.appState.currentOrganizationId, subCategoryID: e.categoryID, categoryName: e.productCategoryName, productID: e.id, productName: e.name });
  }

}
