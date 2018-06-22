import { ValidationUtil } from '../../../utilities/validation.util';
import { Component, Input, ViewEncapsulation, OnInit, forwardRef, Inject } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController, PopoverOptions, Popover, AlertController } from 'ionic-angular';
import { SelectOptionsPopoverModel } from '../../../layout-module/components/select-popover/select-option.popover';
import { UserProfileContactInfoPage } from '../contact-info/user-profile-contact-info.page';
import { UserProfileService } from '../../../services/userprofile/userprofile.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ObjectsUtil } from '../../../utilities/objects.util';
import { UserModel } from '../../../model/user/user.model';
import { YBatNationalityMasterModel } from '../../../model/master-data/ybat-nationality.master.model';
import { YBatRaceMasterModel } from '../../../model/master-data/ybat-race.master.model';
import { YBatReligionMasterModel } from '../../../model/master-data/ybat-religion.master.model';
import { YBatUserInfoModel } from '../../../model/user/ybat.user-info.model';
import { AppState } from '../../../app/app.state';
import { AvaCacheService } from '../../../services/cache/cache.service';
import { StringUtil } from '../../../utilities/string.util';
import { CacheConstant } from '../../../constants/cache';
import { DateUtil } from '../../../utilities/date.util';
import { TitleNameMasterModel } from '../../../model/master-data/title-name.master.model';
import { TranslationService } from "angular-l10n";
import { NgForm, FormGroup } from "@angular/forms";
import { ValidateInputDirective } from '../../../layout-module/directives/validate-input.directive';
import { RxJSUtil } from '../../../utilities/rxjs.util';
import { Observable } from "rxjs/Observable";
import { AppConstant } from '../../../constants/app-constant';

/**
 * @author Bundit.Ng
 * @since  Mon May 22 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@Component({
  selector: 'user-profile-person-info-page',
  templateUrl: 'user-profile-person-info.page.html',
  styleUrls: ['/user-profile-person-info.page.scss'],
  styles: ['ion-col{position:initial}']
})
export class UserProfilePersonInfoPage implements OnInit {
  private businessUser: UserModel = new UserModel();
  private ybatUserInfoM: YBatUserInfoModel = new YBatUserInfoModel();
  private _monthNames: any[] = [];
  private _monthShortNames: any[] = [];
  private _monthValues: any[] = [];
  private _yearValues: any[] = [];
  //Select-Popover Data
  private titleList: TitleNameMasterModel[] = [];
  private genderList: SelectOptionsPopoverModel[] = [];

  private nationalityList: YBatNationalityMasterModel[] = [];
  private raceList: YBatRaceMasterModel[] = [];
  private religionList: YBatReligionMasterModel[] = [];

  private ngModelOpt = { standalone: true };

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public appState: AppState,
    public authenService: AuthenticationService,
    public cacheService: AvaCacheService,
    private translationService: TranslationService,
    private validationUtil: ValidationUtil,
  ) {
    this.genderList = [
      new SelectOptionsPopoverModel('M', this.translationService.translate('COMMON.USERPROFILE.GENDERS_MALE')),
      new SelectOptionsPopoverModel('F', this.translationService.translate('COMMON.USERPROFILE.GENDERS_FEMALE'))
    ];

    this.businessUser = this.appState.businessUser;
    this.businessUser && this.calculateAge(this.businessUser.birthDate);

    this._monthNames = (this.translationService.translate("COMMON.USERPROFILE.MONTHS_LONG") || " ").split(" ");
    this._monthShortNames = (this.translationService.translate("COMMON.USERPROFILE.MONTHS_SHORT") || " ").split(" ");
    this._monthValues = "01 02 03 04 05 06 07 08 09 10 11 12".split(" ");

    this._yearValues = this.genYears(this.translationService.getLanguage());
  }

  private genYears(lang: string): any[] {
    if (!StringUtil.isEmptyString(lang)) {
      let currYears = new Date().getFullYear();
      let years = [];
      if (lang.toLocaleLowerCase() == 'th') {
        currYears = currYears + 543;
        // } else if (lang == 'en') {
      }
      for (let y = currYears; y > (currYears - 100); y--) {
        years.push(y);
      }
      return years;
    } else {
      return [];
    }
  }

  public ngOnInit(): void {
    let organizeId = this.navParams.get('organizationId');
    // organizeId && this.buService.getBusinessUserInfoByOrg(organizeId);
    this.ybatUserInfoM = this.businessUser && this.businessUser.ybatUserInfoM;
    if (ObjectsUtil.isEmptyObject(this.ybatUserInfoM)) {
      this.ybatUserInfoM = new YBatUserInfoModel();
      this.ybatUserInfoM.businessUserId = this.businessUser.id;
    }
    this.loadMasterCacheData();
  }

  private loadMasterCacheData() {
    // this.cacheService.getCacheMaster(CacheConstant.MS_TITLE, TitleNameMasterModel).subscribe(resp => {
    this.cacheService.getTitleMaster(AppConstant.CUSTOMER_TYPE.Individual).subscribe(resp => {
      this.titleList = resp;
      // console.log("titleList:", resp);
    }, error => {
      console.warn('Error => ', error);
    });
    this.cacheService.getCacheMaster(CacheConstant.ZYBAT_MS_NATIONALITY, YBatNationalityMasterModel).subscribe(resp => {
      this.nationalityList = resp;
      // console.log("nationalityList:", resp);
    }, error => {
      console.warn('Error => ', error);
    });
    this.cacheService.getCacheMaster(CacheConstant.ZYBAT_MS_RACE, YBatRaceMasterModel).subscribe(resp => {
      this.raceList = resp;
      // console.log("raceList:", resp);
    }, error => {
      console.warn('Error => ', error);
    });
    this.cacheService.getCacheMaster(CacheConstant.ZYBAT_MS_RELIGION, YBatReligionMasterModel).subscribe(resp => {
      this.religionList = resp;
      // console.log("religionList:", resp);
    }, error => {
      console.warn('Error => ', error);
    });
  }

  private nationalityChange(): void {
    // console.log("nationalityChange nationality:", this.ybatUserInfoM.nationality);
    if (!StringUtil.isEmptyString(this.ybatUserInfoM.nationality)) {
      if (this.ybatUserInfoM.nationality == 'TH') {
        this.ybatUserInfoM.passportNo = '';
        // console.log("nationalityChange ybatUserInfoM.passportNo:", this.ybatUserInfoM.passportNo);
      } else {
        this.businessUser.cardId = '';
        // console.log("nationalityChange businessUser.cardId:", this.businessUser.cardId);
      }
    }
  }

  private cancelBtn() {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot(AppConstant.DEFAULT_PAGE);
    }
  }

  private getMinMaxLengthIdCard(nationality): string {
    return nationality == 'TH' ? '13' : '0';
  }

  private calculateAge(birthDateInput) {
    // console.log(birthDateInput);
    if (!StringUtil.isEmptyString(birthDateInput)) {
      let age = DateUtil.calculateAgeFromBirthDate(birthDateInput, this.translationService.getLanguage());
      this.businessUser['age'] = age + ' ' + this.translationService.translate("COMMON.USERPROFILE.YEARS");
    }
  }

  private nextToContactInfo(userForm: NgForm) {
    if (userForm.form.valid == true) {
      this.navCtrl.push(UserProfileContactInfoPage, this.businessUser);
    } else {
      this.validationUtil.displayInvalidRequireField(userForm.form, "COMMON.USERPROFILE.");
    }
  }

}