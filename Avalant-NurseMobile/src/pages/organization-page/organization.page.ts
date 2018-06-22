import { Component, OnInit, OnDestroy, Host, ElementRef, Inject, forwardRef, ViewChild, Renderer } from '@angular/core';
import { NavController, NavParams, Refresher, Platform, Content, IonicPage, AlertController, DomController, Events } from 'ionic-angular';
import { PageTab } from './organization-tab/page-tabs';
import { SuperTabsConfig, SuperTabs } from 'ionic2-super-tabs';
import { OrganizationService } from '../../services/organization/organization.service';
import { OrganizationModel } from '../../model/organization/organization.model';
import { getPageByPath } from '../../app/app.declarations';
import { ShopTabModel } from '../../model/organization/shop-tab.model';
import { AppState } from '../../app/app.state';
import { UserProfileService } from '../../services/userprofile/userprofile.service';
import { UserModel } from '../../model/user/user.model';
import { OrganizationImage } from '../../model/organization/organization-image.model';
import { TranslationService, LocaleService } from 'angular-l10n';
import { AppConstant } from '../../constants/app-constant';
import { SuperTabsController } from 'ionic2-super-tabs/dist';
import { OrganizationHeader } from './organization-header/organization-header';
import { LocalizationService } from '../../services/localization/localization-service';
import { BrandService } from '../../services/brand-service/brand.service';

/**
 * Generated class for the OrganizePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  segment: 'brands/:organizationId',
  defaultHistory: ['TabPage'],
  priority: 'high',
})
@Component({
  selector: 'organization-page',
  templateUrl: 'organization.page.html',
})
export class OrganizationPage implements OnInit, OnDestroy {

  private superTabsElement: HTMLElement;
  private _pageTabs: PageTab[] = null;

  @ViewChild(SuperTabs) private superTabs: SuperTabs;
  @ViewChild(Content) public content: Content;
  @ViewChild(OrganizationHeader) private orgHeader: OrganizationHeader;

  get pageTabs(): PageTab[] {
    return this._pageTabs;
  }

  set pageTabs(data: PageTab[]) {
    this._pageTabs = null;

    // Do it next tick.
    // setTimeout(function () {
    this._pageTabs = data;
    // }.bind(this), 0);
  }

  // [
  //   { component: StorePage, title: 'Store', },
  //   { component: DonationPage, title: 'Donation', },
  //   { component: CoursePage, title: 'Course', },
  // ];

  private superTabConfig: SuperTabsConfig = {
    sideMenu: 'left', // Tell super tab that we have Left side menu
  };

  private organizationData: OrganizationModel;
  public organizationImage: OrganizationImage;
  private organizationId: string;

  public selectedPageTabIndex: number = 0;

  private needReload: boolean;

  private get brandTheme(): string {
    return this.brandService.currentClass;
  }

  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private navParams: NavParams,
    private events: Events,
    private appState: AppState,
    @Inject(forwardRef(() => OrganizationService)) private organizationService: OrganizationService,
    private buService: UserProfileService,
    private renderer: Renderer,
    private dom: DomController,
    private el: ElementRef,
    private alertController: AlertController,
    private translation: TranslationService,
    private localeService: LocaleService,
    private superTabsCtrl: SuperTabsController,
    private alertCtrl: AlertController,
    private localizationService: LocalizationService,
    private brandService: BrandService,
  ) { }

  public ngOnInit(): void {
    this.organizationId = this.navParams.get('organizationId');

    // Load default
    if (!this.organizationId) {
      this.alertController.create({
        message: "System can't find selected organization id, Currently display by default organizaion"
      }).present();
      this.organizationId = AppConstant.DEFAULT_ORG_PARAMS.ORG_AVA.organizationId;
    }

    this.appState.currentOrganizationId = this.organizationId;
    this.loadOrganization(this.organizationId);

    // Reload Organization data when translation changed.
    this.events.subscribe('translation:changed', () => {
      this.needReload = true;
    });
  }

  public ngOnDestroy(): void {
    // NorrapatN: Can't clear this organization id at this time.
    // this.appState.currentOrganizationId = null;
    // console.debug('Destroying Organization page');
    // console.debug('Clearing current organization id.');

    // Remove Brand class
    this.brandService.clearBrand();
  }

  public ionViewDidLoad(): void {
    // this.platform.registORG_PAGESerListener(this.el.nativeElement, 'touchmove', (e) => {
    //   console.debug('Touchmove :', e);
    // }, {});
    this.superTabsElement = this.superTabsElement || <HTMLElement>document.getElementById('supertabs');

  }

  /**
   * Ionic View Did enter - Execute anytime when view did enter
   */
  public ionViewDidEnter(): void {

    // NorrapatN: Use this to reload page when needed. (eg. Translation changed)
    if (this.needReload) {
      // Clear the faking Super Tabs bugged by clear Page tab items. Then re-load ORG data & map Page tabs again.
      this._pageTabs = null;
      setTimeout(() => {
        this.loadOrganization(this.organizationId, () => {

          // Then don't reload it again until it needed.
          this.needReload = false;
        });
      });
    }
  }

  /**
   * Refresh by pull down page
   * @param refresher 
   */
  // Maybe deprecate or re-use. I don't know now.
  public refreshOrganizationPage(refresher: Refresher): void {
    setTimeout((() => {
      // console.log('Async operation has ended');
      this.loadOrganization(this.organizationId, () => {
        this.superTabsElement = null;
        refresher.complete();
      });

    }), 1000);
  }

  /**
   * Page scrolling event.
   * 
   * @param e Scroll Event
   */
  private pageScroll(e): void {
    // console.debug('⚠️⚠️ Scroll event :', e);

    if (!e) {
      return;
    }
    let scrollElement: HTMLDivElement = e.scrollElement;
    this.superTabsElement = <HTMLElement>scrollElement.children.namedItem('supertabs');
    // this.superTabsElement = <HTMLElement>document.getElementsByClassName('supertabs')[0];

    // Use DOM write fn to improve performance.
    // domWrite - Fn from ionScroll event.
    e.domWrite(() => {
      let orgHeaderHeight: number = this.orgHeader.orgHeaderHeight;

      // console.debug('e.scrollTop : ' + e.scrollTop + ' orgHeaderHeight >' + orgHeaderHeight);

      if (e.scrollTop >= orgHeaderHeight) {
        this.superTabsElement.classList.remove('disable-page-scroll');
        // this.renderer.setElementClass(this.superTabsElement, 'disable-page-scroll', false); // false is remove
        // superTabToolbarElem.style.top = scrollElement.style.marginTop; // Override top
      } else {
        this.superTabsElement.classList.add('disable-page-scroll');
        this.renderer.setElementClass(this.superTabsElement, 'disable-page-scroll', true); // true is add
        // superTabToolbarElem.style.top = '';
      }
    });

  }

  public gotoShopTab(shopTypeId: string): void {
    // console.debug('Goto shop tab by shop type id :', shopTypeId);
    let pageTabIndex: number = this.pageTabs.findIndex(pageTab => pageTab.shopTypeId == shopTypeId);
    if (pageTabIndex > -1) {
      // this.selectedPageTabIndex = pageTabIndex;
      this.superTabs.slideTo(pageTabIndex); // This will slide to specified tab. !! But not activate tab !!
      this.superTabs.onTabChange(pageTabIndex);

      this.dom.write(() => {
        let yOffset = document.getElementById('supertabs').offsetTop;
        this.content.scrollTo(0, yOffset, 400);

        // Check for avoid undefined superTabsElement
        if (this.superTabsElement) {
          // Use renderer instead
          this.renderer.setElementClass(this.superTabsElement, 'disable-page-scroll', false); // false is remove
          // this.superTabsElement.classList.remove('disable-page-scroll');
        }
      });
    }
  }

  /**
   * Load Organization data by Organization ID / CODE
   * 
   * @param organizationId string of Organization ID or Code
   * @param callback Callback fire when success loading data
   */
  private loadOrganization(organizationId: string, callback?: (response: OrganizationModel) => void): void {
    this.organizationService.getOrganization(organizationId).subscribe((response) => {
      this.organizationData = response;
      // console.log(this.organizationData);
      // console.log("%corganizationData:", 'background-color:red', this.organizationData);
      if (!this.appState.businessUser) {
        this.localizationService.setLanguage((this.organizationData.defaultLanguage || '').toLowerCase());
      }

      // Set brand CSS
      this.setBrandCss(response.theme);

      // Read Organization config for angular.
      /* let mobileConfig = response.mobileConfig;
      if (!!mobileConfig) {
        console.debug('💭 Mobile organization configuration :', mobileConfig);
        this.navCtrl.push(mobileConfig.homepageCmp, {}, {
          animate: false,
        });
        return;
      } */// Move to Brand page

      this.loadOrganizationShopPage(organizationId);
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    }, (error) => {
      console.warn('Error loading orgniazation :', error);
      this.alertCtrl.create({
        title: 'Can not connect to server right now.',
        message: `${JSON.stringify(error)}`,
        buttons: [
          'OK'
        ]
      }).present();
      if (callback && typeof callback === 'function') {
        callback(error);
      }
    });
  }

  // private loadOrganizationUserInfo(): void {
  //   let bizUser: UserModel = this.appState.businessUser;
  //   bizUser && this.buService.getBusinessUserInfoByOrg(this.organizationId);
  // };

  private loadOrganizationShopPage(organizationId: string): void {
    this.organizationService.getShopTabsByOrganization(organizationId, this.appState.language).subscribe((response) => {
      // console.log("response:", response);

      // Map Shop tabs
      let mappedPageTabs = this.mapShopTabs(response);

      // Create home page tab
      let homePageTab = new PageTab();
      homePageTab.component = 'OrganizationHomePage';
      homePageTab.params = {
        ...this.navParams.data,
        shopTabs: response,
        orgPageInstance: this,
      };
      // homePageTab.title = 'COMMON.SUBHEADER.HOME'; // Use translate key

      // NorrapatN: Just pre translate for it. So annoyed, sometime translate pipe is not working.
      homePageTab.title = this.translation.translate('COMMON.SUBHEADER.HOME');

      // Insert home page into first element
      mappedPageTabs.unshift(homePageTab);

      this.pageTabs = mappedPageTabs;
    }, error => {
      console.warn('Error => ', error);
    });
  }

  private mapShopTabs(shopTabs: ShopTabModel[]): PageTab[] {
    if (!shopTabs) {
      return null;
    }

    let _pageTabs: PageTab[] = [];

    // Loop each Shop tabs
    for (let shopTab of shopTabs) {
      // Mapping Shop tab to Page tab
      let component = getPageByPath(shopTab.pathUrl);
      // console.log("component:", component);
      if (!component) {
        continue;
      }

      let pageTab: PageTab = new PageTab();
      pageTab.component = component;
      // pageTab.title = shopTab.displayName;
      pageTab.title = shopTab.displayName; //this.mapTabTitleName(shopTab);
      pageTab.params = {
        ...this.navParams.data,
        ...shopTab.toJSON(),
        orgPageInstance: this,
      }; // Pass current navParams to each tab

      pageTab.shopId = shopTab.shopId;
      pageTab.shopTypeId = shopTab.shopTypeId;

      _pageTabs.push(pageTab);
    }
    // console.debug('Mapped Page tabs :', pageTabs);
    return _pageTabs;
  }

  private onTabSelect(e: any) {
    let yOffset = document.getElementById('supertabs').offsetTop;
    this.content.scrollTo(0, yOffset, 400);
  }

  private mapTabTitleName(shopTab: ShopTabModel): string {
    let titleMap = {
      'shop': this.translation.translate('COMMON.HOME.PRODUCT'),
      'donation': this.translation.translate('COMMON.HOME.DONATION'),
      'group-event': this.translation.translate('COMMON.HOME.GROUP'),
      'course': this.translation.translate('COMMON.HOME.COURSE'),
      'privilege': this.translation.translate('COMMON.HOME.PRIVILEGE'),
      'funding': this.translation.translate('COMMON.HOME.FUNDING'),
    };
    return titleMap[shopTab.pathUrl];
  }

  private setBrandCss(brandCss: string): void {
    if (brandCss) {
      this.brandService.setBrand(brandCss);
      (<HTMLElement>this.el.nativeElement).classList.add(brandCss);
    }
  }

}
