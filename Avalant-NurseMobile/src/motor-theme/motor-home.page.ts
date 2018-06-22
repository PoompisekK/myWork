import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { AnimateCss } from '../animations/animate-store';
import { AppState } from '../app/app.state';
import { FabButton } from '../layout-module/components/fabs/fab-button';
import { UearnFabsController } from '../layout-module/components/fabs/fabs.controller';
import { FabButtonRemover } from '../layout-module/components/fabs/fabs.type';
import { SlideMenuItem } from '../layout-module/components/slide-menu/model/slide-menu-item.model';
import { OrganizationModel } from '../model/organization/organization.model';
import { ShopTabModel } from '../model/organization/shop-tab.model';
import { ProductCategoryModel } from '../model/product/product-category.entity';
import { VehicleDataModel } from '../model/vehicle/vehicle.model';
import { OrganizationService } from '../services/organization/organization.service';
import { ProductService } from '../services/product-service/product.service';

/**
 * Motor Home page
 * 
 * @author NorrapatN
 * @since Mon Sep 25 2017
 */
@IonicPage({
  // segment: 'motor',
  segment: 'brand-motor/:organizationId',
  defaultHistory: ['TabPage'],
})
@Component({
  selector: 'motor-home-page',
  templateUrl: './motor-home.page.html',
  animations: [
    AnimateCss.peek('200ms ease-in-out'),
  ]
})
export class MotorHomePage implements OnInit, OnDestroy {

  private organizationId: string;
  private organizationData: OrganizationModel;

  private shopTab: ShopTabModel;

  private categories: SlideMenuItem[];

  /**
   * Product Categories from API.
   */
  private productCategories: ProductCategoryModel[];

  /**
   * Product list to show on screen.
   */
  private productListGrid: ProductCategoryModel[];

  private currentVehicle: VehicleDataModel;

  private fabButtonRemover: FabButtonRemover;

  private isTablet: boolean;

  constructor(
    private platform: Platform,
    private ngZone: NgZone,
    private appState: AppState,
    private navCtrl: NavController,
    private navParams: NavParams,
    private fabsCtrl: UearnFabsController,
    private orgniazationService: OrganizationService,
    private productService: ProductService,
  ) {

    this.isTablet = this.platform.is('tablet') || this.platform.is('phablet') || this.platform.is('ipad') || this.platform.is('core');

    this.organizationId = this.navParams.get('organizationId');
    // this.organizationData = this.loadMockedOrganizationData();
    // this.loadMockedCategories();
    // this.loadMockedProductList();
    // this.loadCurrentVehicle();
  }

  public ionViewDidEnter(): void {
    this.loadCurrentVehicle();
  }

  public ngOnInit(): void {

    this.loadOrganization();

    // Add Car button
    this.fabButtonRemover = this.fabsCtrl.addButton(FabButton.createFabButton({
      id: 'addCar',
      icon: 'car',
      color: 'secondary',
      callback: (navCtrl: NavController) => {
        if (this.currentVehicle) {
          navCtrl.push('SelectCarPage');
        } else {
          navCtrl.push('AddCarPage');
        }
      }
    }));

    // this.cartService.setCartPageName('MotorCartPage');
  }

  public ngOnDestroy(): void {
    this.fabButtonRemover();
    // this.cartService.setCartPageName();
  }

  private addVehicle(data: { e: MouseEvent, vehicle: VehicleDataModel }): void {
    data.e.stopPropagation();

    this.navCtrl.push('AddCarPage');
  }

  private onSearchClick(search: string): void {
    this.navCtrl.push('BetterSearchPage', {
      search,
    }, { animate: false, direction: 'up', duration: 200 });
  }

  private selectCar(): void {
    this.navCtrl.push('SelectCarPage');
  }

  private productCategorySelect(value: string): void {
    console.debug('💭 Product category select input :', value);

    this.productListGrid = this.productCategories.filter((category) => category.id == value);
  }

  private productClick(e: any): void {
    this.navCtrl.push('ProductV2Page', {
      ...this.navParams.data,
      productId: e.product.id,
      shopTypeId: this.shopTab.shopTypeId,
    });
  }

  private loadOrganization(): void {

    this.orgniazationService.getOrganization(this.organizationId).subscribe((response) => {
      this.organizationData = response;

      // TODO: Set brand please.. like a Organization Page
      this.appState.currentOrganizationId = this.organizationId;

      // continue load shoptypes.
      if (response.id) {
        // if loaded.
        this.loadShopTypes();
      } else {
        // TODO: Handle when error.
      }
    }, (error) => {
      console.warn('⚠️ Error while loading Organization Data', error);
    });

  }

  private loadShopTypes(): void {
    this.orgniazationService.getShopTabsByOrganization(this.organizationData.id, this.appState.language).subscribe((response) => {
      // Only get one shop tab.
      this.shopTab = response && response[0];

      if (this.shopTab) {
        // Then load products
        this.productService.getCategoriesWithProductsByShop(this.shopTab.shopId).subscribe((response) => {
          console.debug('💭 Product Categories data :', response);

          this.productCategories = this.productListGrid = response;
          this.categories = this.mapCategories(response);
        });
      }
    }, (error) => {
      console.warn('⚠️ Error while getShopTabsByOrganization', error);
    });
  }

  private loadMockedOrganizationData(): OrganizationModel {
    return <any>{
      name: 'Auto Parts',
      description: 'Top for your Cars',
    };
  }

  private mapCategories(productCategories: ProductCategoryModel[]): SlideMenuItem[] {
    /* this.categories = [
      new SlideMenuItem({
        id: 1,
        name: 'น้ำมันเครื่อง',
        iconUrl: 'assets/img/icon/category/oil.png',
      }),
      new SlideMenuItem({
        id: 2,
        name: 'ที่ปัดน้ำฝน',
        iconUrl: 'assets/img/icon/category/wiper.png',
      }),
      new SlideMenuItem({
        id: 3,
        name: 'โช๊ค',
        iconUrl: 'assets/img/icon/category/shoke.png',
      }),
      new SlideMenuItem({
        id: 4,
        name: 'เบรค',
        iconUrl: 'assets/img/icon/category/break.png',
      }),
      new SlideMenuItem({
        id: 5,
        name: 'สายพาน',
        iconUrl: 'assets/img/icon/category/belt.png',
      }),
    ]; */

    return productCategories.map((model) => {
      return new SlideMenuItem({
        id: model.id,
        name: model.name,
        // iconUrl: model.code,
        iconUrl: 'assets/img/icon/category/belt.png', // TODO: Change back to above, This line is for DEMO.
      });
    });
  }

  private loadProductList(): void {

  }

  private loadCurrentVehicle(): void {
    setTimeout(() => {
      this.ngZone.run(() => {
        /* this.currentVehicle = new VehicleDataModel({
          id: '1',
          displayName: 'Honda Accord Hybrid',
          brandName: 'Honda',
          model: '2.0 i-VETC',
          subModel: '2.0 E',
          year: 2016,
          imageUrl: '',
        }); */

        this.currentVehicle = this.appState.userSelectedVehicle;
      });
    }, 700);
  }

}
