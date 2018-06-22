import { AfterViewInit, Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { App, PopoverController, Content, NavController, LoadingController, AlertController, Slides } from 'ionic-angular';
import { AppConstant } from '../../../constants/app-constant';
import { AppState } from '../../../app/app.state';
import { DMPSocialService } from '../../../services/dmp-social/dmp-social.service';
import { OrganizationModel } from '../../../model/organization/organization.model';
import { OrganizationService } from '../../../services/organization/organization.service';
import { SelectOptionsListPopoverPage } from '../../../layout-module/components/select-popover/select-option.popover';
import { TranslationService, LocaleService } from 'angular-l10n';
import { UserModel } from '../../../model/user/user.model';
import { UserProfilePersonInfoPage } from '../../user-profiles-page/personal-info/user-profile-person-info.page';
import { ObjectsUtil } from '../../../utilities/objects.util';
import { OrganizationFollowerModel } from '../../../model/organization/organization-follower.model';
import { UserProfileService } from '../../../services/userprofile/userprofile.service';
import { LocalizationService } from '../../../services/localization/localization-service';

/**
 * Generated class for the OrganizationHeader component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'organization-header',
  templateUrl: 'organization-header.html',
  styleUrls: ["/organization-header.scss"]
})
export class OrganizationHeader implements OnInit, AfterViewInit {

  // isLoading: boolean = true;
  get isLoading(): boolean {
    return !this.organizationData;
  }

  private isFollowed: boolean = false;
  private isFollowBtnLoading: boolean = false;
  private businessUserM: UserModel;
  private organizationId: any;
  private organizeFollowerM: OrganizationFollowerModel = new OrganizationFollowerModel();

  @Input('organization')
  private organizationData: OrganizationModel;

  @ViewChild('orgHeader') private orgHeader: ElementRef;
  @ViewChild('slides') private slides: Slides;
  public get orgHeaderHeight(): number {
    return this.orgHeader && this.orgHeader.nativeElement.offsetHeight;
  }
  private slideOptions;
  constructor(
    private dmpSocialService: DMPSocialService,
    private popoverCtrl: PopoverController,
    private translationService: TranslationService,
    private appCtrl: App,
    private appState: AppState,
    private organizationService: OrganizationService,
    private localeService: LocaleService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private userProfileService: UserProfileService,
    private localizationService: LocalizationService
  ) {

  }

  public ngOnInit() {
    this.businessUserM = this.appState.businessUser;
    this.organizationId = this.appState.currentOrganizationId;

  }

  public ngAfterViewInit() {
    this.getFollowingStatus();

    // console.debug('  💭 orgHeader :', this.orgHeader);
  }
  private slideChanged() {
    if (!this.slides) {
      return;
    }

    let currentIndex = this.slides.getActiveIndex();
    this.slides.startAutoplay();
    // console.log('Current index is', currentIndex);
  }
  public getFollowingStatus() {
    this.organizationId && this.businessUserM && this.organizationService.getFollowStatusByOrganization(this.organizationId, this.businessUserM.id).subscribe(resp => {
      // console.log("getFollowStatusByOrganization resp:", resp);

      if (!ObjectsUtil.isEmptyObject(resp)) {
        this.organizeFollowerM = resp;
        this.isFollowed = this.organizeFollowerM.status == 'Y';
      }

    });
  }

  private loadingUserProfileOnEnter(alertLoading): void {
    let bizUser = this.appState.businessUser;
    this.userProfileService.getLoginManualServlet(bizUser.id).subscribe((respBizUser) => {
      this.appState.businessUser = respBizUser;
      // console.log("getUserprofilesManualServlet businessUser:", this.appState.businessUser);
      // this.appCtrl.getRootNav().push(UserProfilePersonInfoPage);
      setTimeout(() => {
        this.navCtrl.setRoot(UserProfilePersonInfoPage);
        alertLoading && alertLoading.dismiss();
      }, 750);
    }, (error => {
      alert('Error:' + error);
      alertLoading && alertLoading.dismiss();
    }));
  }

  private settingBtn(): void {
    let settingOpt = [
      { code: '1', name: this.translationService.translate('COMMON.MENU.MY_PROFILE') },
      { code: '2', name: this.translationService.translate('COMMON.SETTINGS.CHANGE_LANGUAGE') },
    ];
    let popover = this.popoverCtrl.create(SelectOptionsListPopoverPage, settingOpt);
    popover.present();
    popover.onWillDismiss(resp => {
      switch (resp) {
        case '1':
          let paramObjt = {};
          paramObjt[AppConstant.NavParamsKey.ORGANIZATION_ID] = this.appState.currentOrganizationId;
          console.warn("paramObjt:", paramObjt);
          let alertLoading = this.alertCtrl.create({
            message: this.translationService.translate('COMMON.ALERT.LOADING'),
          });
          alertLoading.present();
          this.loadingUserProfileOnEnter(alertLoading);
          break;
        case '2':
          let currentLang = this.appState.language;
          let loading = this.loadingCtrl.create({
            content: 'Please wait...'
          });

          loading.present();

          this.localizationService.setLanguage(currentLang == 'EN' ? 'th' : 'en').then(() => {
            this.localizationService.manualChangeWithOutLogin = true;
            if (this.appState.businessUser) {
              this.appState.businessUser.languages = this.localeService.getCurrentLanguage().toUpperCase();
              this.userProfileService.updateUserProfile(this.appState.businessUser).subscribe(resp => {
                // console.log('Finish update language');

                loading.dismiss();
              }, error => {
                console.warn('An error occuried while update user profile... (゜д゜)！');
                loading.dismiss();
              });
            } else {

              loading.dismiss();
            }
          });

        default:
          console.warn("no anything to do");
          break;
      }
    });
  }

  private followBtn(): void {
    // console.log("followBtn !!!!!!!!!111");
    this.isFollowBtnLoading = true;

    this.organizeFollowerM.businessUserId = this.businessUserM.id;
    this.organizeFollowerM.orgId = this.appState.currentOrganizationId;
    this.organizeFollowerM.status = (!this.isFollowed) ? 'Y' : 'N';
    this.organizationService.toggleFollowOrganization(this.organizeFollowerM).subscribe((response) => {
      let isSucces = AppConstant.EAF_RESPONSE_CONST.isSuccess(response.STATUS);
      if (response && isSucces) {

        // console.log('toggleFollowOrganization response :', response);
        this.organizeFollowerM.orgFollowerId = response.ORG_FOLLOWER_ID;
        // this.getFollowingStatus();
        this.isFollowed = !this.isFollowed;
      } else {
        console.error('toggleFollowOrganization response :', response);
      }
    }, (error) => {
      console.warn('Follow ORG error :', error);
    }).add(() => {
      //Finally
      this.isFollowBtnLoading = false;
    });
  }
}
