import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { TranslationService } from 'angular-l10n';
import { App, DomController, IonicPage, LoadingController, NavParams, Searchbar, Slides, Spinner } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { AppConstant } from '../../constants/app-constant';
import { EAFRestApi } from '../../constants/eaf-rest-api';
import { OrganizationModel } from '../../model/organization/organization.model';
import { SearchResultViewModel } from '../../model/search-result/search-result.model';
import { AvaCacheService } from '../../services/cache/cache.service';
import { ProductService } from '../../services/product-service/product.service';
import { SearchService } from '../../services/search-services/search.service';
import { ObjectsUtil } from '../../utilities/objects.util';
import { StringUtil } from '../../utilities/string.util';

/**
 * @author Bundit.Ng
 * @since  Sat May 20 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@IonicPage({
  segment: 'search/:organizationId/:categoryID',
})
@Component({
  selector: 'search-page',
  templateUrl: 'search.page.html',
  styleUrls: ['/search.page.scss'],
})
export class SearchPage implements OnInit, AfterViewInit {

  public tabs: any = '0';
  @ViewChild('pageSlider') 
  private pageSlider: Slides;

  @ViewChild('searchbar')
  private ionSearchbar: Searchbar;

  @ViewChild('spinner')
  private spinner: Spinner;

  private isDisplayOnly_OrgResult: boolean = false;

  private organizationId;
  private categoryID;
  private categoryName;
  private subCategoryID;
  private searchInputModel: string = "";
  private productID;
  private productName;

  private searchSubscriber: Subscription;

  private dataResultAll: any[];
  private dataResultOrg: any[];

  private isLoading: boolean;
  private organizeList: OrganizationModel[] = [];

  private shopTypeList: any[] = [];
  private searchResult: any[] = [];
  constructor(
    private appCtrl: App,
    private dom: DomController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private translation: TranslationService,
    private cacheService: AvaCacheService,
    private searchService: SearchService,
    private productService: ProductService,
    private keyboard: Keyboard,
  ) { }

  public ngOnInit(): void {
    this.organizationId = this.navParams.get('organizationId');
    this.categoryID = this.navParams.get('categoryID');
    this.categoryName = this.navParams.get('categoryName');
    this.subCategoryID = this.navParams.get('subCategoryID');
    this.productID = this.navParams.get('productID');
    this.productName = this.navParams.get('productName');
    if (this.productID) {
      this.categoryName = this.productName;
      this.searchInputModel = this.productName;
      this.searchCategory();
    }
    if (this.categoryID || this.subCategoryID) {
      this.searchInputModel = this.categoryName;
      this.searchCategory();
    }
    if (!this.searchInputModel) {
      setTimeout(() => {
        this.ionSearchbar.setFocus();
      }, 500);
    }
    // if (isDev() && ObjectsUtil.isEmptyObject(this.organizationId)) this.organizationId = "1";
    this.isDisplayOnly_OrgResult = !StringUtil.isEmptyString(this.organizationId) && this.organizationId != AppConstant.ORGANIZE_CODE.ORG_DEFAULT.id;
    // console.log("%cisOnlyOrgFeature:", 'color:blue;font-weight:bolder;background-color:#f1f1f1', this.isDisplayOnly_OrgResult, (this.isDisplayOnly_OrgResult ? ' ค้นหาภายใน Organize' : 'ค้นหาทั้ง Platform'));
  }

  public ngAfterViewInit(): void {
    this.moveSpinnerIntoSearchbar();
  }

  public moveSpinnerIntoSearchbar(): void {
    // console.debug('Searchbar :', this.ionSearchbar);
    // console.debug('Spinner :', this.spinner);

    let searchbarElement: HTMLElement = this.ionSearchbar.getNativeElement();
    searchbarElement.appendChild(this.spinner.getNativeElement());
  }

  public changeWillSlide($event) {
    this.tabs = $event._snapIndex.toString();
  }

  public selectTab(index) {
    this.pageSlider.slideTo(index);
  }

  public displayOrganizeNameByOrgId(orgId: string): string {
    if (!ObjectsUtil.isEmptyObject(this.organizeList)) {
      let orgItem = this.organizeList && this.organizeList.find((itm) => itm.id == orgId);
      return orgItem.name;
    } else {
      return null;
    }
  }

  // resultProductClick(e: any): void {
  //   console.debug('resultProductClick:', e);
  //   this.appCtrl.getRootNav().push('ProductPage', {
  //     productId: e.product.id,
  //     title: e.product.productName
  //   });
  // }
  // onFocus(e:any):void{
  //   console.log("onFocus");
  //   //must setTimeout if no keyboard close not working
  //   setTimeout(() => {
  //     this.keyboard.close();
  //   },0);
  //   setTimeout(() => {
  //     this.keyboard.show();
  //   },1500);

  // }
  // onBlur(){
  //   console.log("onBlur");
  //   setTimeout(() => {
  //     this.keyboard.close();
  //   },0);
  // }

  private onInput(e: any): void {
    // this.keyboard.hideKeyboardAccessoryBar(true);
    // console.log("onInput:", this.searchInputModel);
    if (!StringUtil.isEmptyString(StringUtil.trim(this.searchInputModel))) {

      this.shopTypeList = [];
      this.searchResult = [];
      // this.isLoading = this.loadingCtrl.create({
      //   content: this.translationService.translate('MSG.LOADING') + '...'
      // });
      // this.isLoading.present();
      this.isLoading = true;

      // Cancel last request if it loading
      this.searchSubscriber && this.searchSubscriber.unsubscribe();

      if (this.searchInputModel && !StringUtil.isEmptyString(this.searchInputModel)) {
        this.searchSubscriber = this.searchingData(this.searchInputModel);
      }
    }

    if (StringUtil.isEmptyString(this.searchInputModel)) {
      this.onCancel(null);
    }
  }

  private onCancel(e: any): void {
    // this.dataResultAll = null;
    // this.dataResultOrg = null;
    this.shopTypeList = [];
    this.searchResult = [];
    this.isLoading = false;

    // Cancel last request if it loading
    this.searchSubscriber && this.searchSubscriber.unsubscribe();
  }

  private clickItem(itmDtl: any) {
    // console.log('item => ', itmDtl);
    this.productService.getProductInfoById(itmDtl.product_id).subscribe(resp => {
      // console.log('product model => ', resp);
      this.appCtrl.getRootNav().push('ProductPage', {
        productId: resp.id,
        productItemId: itmDtl.product_item_id,
        shopTypeId: resp.shopTypeId,
        shopId: resp.shopId,
      });
    });
  }

  private searchCategory() {
    return this.searchService.getSearchProductManualServlet('', this.organizationId, this.categoryID, this.subCategoryID, this.productID).subscribe(resp => {
      this.searchResult = resp;
      for (let itm of resp) {
        if (this.shopTypeList.indexOf(itm.shop_type_id) < 0) {
          this.shopTypeList.push(itm.shop_type_id);
        }
      }

      this.isLoading = false;
    }, error => {
      console.log('error => ', error);
    });
  }

  public searchSubCategory() {
    return this.searchService.getSearchProductManualServlet('', this.organizationId, '', this.subCategoryID).subscribe(resp => {
      this.searchResult = resp;
      for (let itm of resp) {
        if (this.shopTypeList.indexOf(itm.shop_type_id) < 0) {
          this.shopTypeList.push(itm.shop_type_id);
        }
      }
      this.isLoading = false;
    }, error => {
      console.log('error => ', error);
    });
  }

  public searchingData(searchParams: string) {
    return this.searchService.getSearchProductManualServlet(this.searchInputModel, this.organizationId).subscribe(resp => {
      this.searchResult = resp;
      for (let itm of resp) {
        if (this.shopTypeList.indexOf(itm.shop_type_id) < 0) {
          this.shopTypeList.push(itm.shop_type_id);
        }
      }
      // console.log(this.shopTypeList);
      this.isLoading = false;
    }, error => {
      console.log('error => ', error);
    });
  }

  /* ViewUtil */
  public isEmptyArray(arrObj: any[]): boolean {
    return ObjectsUtil.isEmptyObject(arrObj) || arrObj.length == 0;
  }
  public isSameObj(idx: number, sameProp: string, dataResultArr: any[]): boolean {
    return idx == 0 ||
      ((dataResultArr[idx - 1] == null || dataResultArr[idx] == null) || (dataResultArr[idx - 1])[sameProp] != (dataResultArr[idx])[sameProp]);
  }

  private getImg(imageKey: string) {
    return EAFRestApi.getImageUrl(imageKey);
  }

  private mapTabTitleName(shopTypeID: string): string {
    return this.translation.translate(AppConstant.mapShopTabTitleKeyByShopTypeId(shopTypeID));
  }

}

export class DisplayOrgResultModel {
  public orgId: string;
  public orgName?: string;
  public displayShopResultList?: DisplayShopResultModel[];
}
export class DisplayShopResultModel {
  public shopId: string;
  public shopName?: string;
  public displayCategoryResultList?: DisplayCategoryResultModel[];
}
export class DisplayCategoryResultModel {
  public categoryId: string;
  public categoryName?: string;
  public searchResultViewModel?: SearchResultViewModel[];
}