import { Component, Input, OnInit, forwardRef, Inject } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { UserProfileSpecifyInfoPage } from '../specification-info/user-profile-specify-info.page';
import { ProvinceMasterModel } from '../../../model/master-data/province.master.model';
import { YBatOccupationMasterModel } from '../../../model/master-data/ybat-occupation.master.model';
import { DistrictMasterModel } from '../../../model/master-data/district.master.model';
import { SubDistrictMasterModel } from '../../../model/master-data/sub-district.master.model';
import { UserModel } from '../../../model/user/user.model';
import { YBatUserContactInfoModel } from '../../../model/user/ybat.user-contact-info.model';
import { YBatUserInfoModel } from '../../../model/user/ybat.user-info.model';
import { UserAddressModel } from '../../../model/user/user-address.model';
import { AddressModel } from '../../../model/user/address.model';
import { AppConstant } from '../../../constants/app-constant';
import { PostCodeMasterModel } from '../../../model/master-data/postcode.master.model';
import { AvaCacheService } from '../../../services/cache/cache.service';
import { ObjectsUtil } from '../../../utilities/objects.util';
import { TranslationService } from "angular-l10n";
import { UserProfileService } from '../../../services/userprofile/userprofile.service';
import { YBatEducationLevelMasterModel } from '../../../model/master-data/ybat-educate-level.master.model';
import { CacheConstant } from '../../../constants/cache';
import { NgForm } from "@angular/forms/forms";
import { ValidationUtil } from '../../../utilities/validation.util';
import { DateUtil } from '../../../utilities/date.util';

@Component({
  selector: 'user-profile-general-info-page',
  templateUrl: 'user-profile-general-info.page.html',
  styleUrls: ['/user-profile-general-info.page.scss'],
  styles: ['ion-col{position:initial}']
})
export class UserProfileGeneralInfoPage {
  private businessUserM: UserModel = new UserModel();

  private userAddressOfficeM: UserAddressModel;
  private addressOfficeM: AddressModel;

  private ybatUserInfoM: YBatUserInfoModel = new YBatUserInfoModel();
  private ybatUserContactInfoList: Array<YBatUserContactInfoModel> = [];

  private contactParentInfo: YBatUserContactInfoModel;
  private contactEMGInfo: YBatUserContactInfoModel;

  private occupationList: Array<YBatOccupationMasterModel> = [];
  private educationList: Array<YBatEducationLevelMasterModel> = [];
  private provinceList: Array<ProvinceMasterModel> = [];
  private districtList: Array<DistrictMasterModel> = [];
  private subDistrictList: Array<SubDistrictMasterModel> = [];
  private postCodeList: Array<PostCodeMasterModel> = [];

  public ngModelOpt = { standalone: true };
  private isParentRequired: boolean = false;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public cacheService: AvaCacheService,
    public translationService: TranslationService,
    public validationUtil: ValidationUtil,
  ) {
    this.businessUserM = this.navParams.data;
    this.ybatUserInfoM = this.businessUserM && this.businessUserM.ybatUserInfoM;
    if (ObjectsUtil.isEmptyObject(this.ybatUserInfoM)) {
      this.ybatUserInfoM = new YBatUserInfoModel();
      this.ybatUserInfoM.businessUserId = this.businessUserM.id;
    }
    this.ybatUserContactInfoList = this.ybatUserInfoM.ybatUserContactInfoList;
    if (ObjectsUtil.isEmptyObject(this.ybatUserContactInfoList)) {
      this.ybatUserContactInfoList = new Array<YBatUserContactInfoModel>();
      this.ybatUserInfoM.ybatUserContactInfoList = this.ybatUserContactInfoList;
    }
    this.isParentRequired = this.businessUserM && DateUtil.calculateAgeFromBirthDate(this.businessUserM.birthDate, this.translationService.getLanguage()) < 20 ? true : false;// under 20 years require !!

    if (!ObjectsUtil.isEmptyObject(this.businessUserM)) {
      let adrsList = this.businessUserM.userAddressList;
      if (ObjectsUtil.isEmptyObject(adrsList)) {
        adrsList = new Array<UserAddressModel>();
        this.businessUserM.userAddressList = adrsList;
      }
      this.userAddressOfficeM = adrsList.find(item => item.addressTypeId === AppConstant.ADDRESS_TYPE.OFFICE);
      if (ObjectsUtil.isEmptyObject(this.userAddressOfficeM)) {
        this.userAddressOfficeM = new UserAddressModel();
        this.businessUserM.userAddressList.push(this.userAddressOfficeM);
      }
      this.userAddressOfficeM.status = 'A';
      this.userAddressOfficeM.businessUserId = this.businessUserM.id;
      this.userAddressOfficeM.addressTypeId = AppConstant.ADDRESS_TYPE.OFFICE;

      this.addressOfficeM = this.userAddressOfficeM.address;
      if (ObjectsUtil.isEmptyObject(this.addressOfficeM)) {
        this.addressOfficeM = new AddressModel();
      }
      this.addressOfficeM.status = 'A';
      this.addressOfficeM.businessUserId = this.businessUserM.id;
      this.userAddressOfficeM.address = this.addressOfficeM;
    }

    this.contactParentInfo = this.getContactUserType(AppConstant.YBATConst.CONTACTTYPE_PARENT);
    this.contactEMGInfo = this.getContactUserType(AppConstant.YBATConst.CONTACTTYPE_EMERGENCY);

    // console.log("this.contactParentInfo:", this.contactParentInfo);
    // console.log("this.contactEMGInfo:", this.contactEMGInfo);
    // console.log("this.ybatUserContactInfoList:", this.ybatUserContactInfoList);
    this.initData();
  }

  public getContactUserType(contactType: string): YBatUserContactInfoModel {
    if (ObjectsUtil.isEmptyObject(this.ybatUserContactInfoList) || this.ybatUserContactInfoList.length == 0) {
      this.ybatUserContactInfoList = [];
      let usrContact_P = new YBatUserContactInfoModel();
      usrContact_P.userInfoId = this.ybatUserInfoM.userInfoId;
      usrContact_P.contactType = AppConstant.YBATConst.CONTACTTYPE_PARENT;
      this.ybatUserContactInfoList.push(usrContact_P);

      let usrContact_E = new YBatUserContactInfoModel();
      usrContact_E.userInfoId = this.ybatUserInfoM.userInfoId;
      usrContact_E.contactType = AppConstant.YBATConst.CONTACTTYPE_EMERGENCY;
      this.ybatUserContactInfoList.push(usrContact_E);
    }
    this.ybatUserInfoM.ybatUserContactInfoList = this.ybatUserContactInfoList;
    return this.ybatUserContactInfoList && this.ybatUserContactInfoList.find(element => element.contactType == contactType);
  }

  public initData() {
    let indx = 0;
    this.cacheService.getCacheMaster(CacheConstant.ZYBAT_MS_OCCUPATION, YBatOccupationMasterModel, {}).subscribe(resp => {
      this.occupationList = resp;
      // console.log("occupationList step:", indx++);
      this.cacheService.getCacheMaster(CacheConstant.ZYBAT_MS_EDUCATION_LEVEL, YBatEducationLevelMasterModel, {}).subscribe(respEducate => {
        this.educationList = respEducate;
        // console.log("educationList step:", indx++);
        this.cacheService.getCacheMaster(CacheConstant.MS_PROVINCE, ProvinceMasterModel).subscribe(resp => {
          this.provinceList = resp;
          // console.log("provinceList :", indx++);
          if (!ObjectsUtil.isEmptyObject(this.addressOfficeM)) {
            this.addressOfficeM.province && this.cacheService.getCacheMaster(CacheConstant.MS_DISTRICT, DistrictMasterModel, {
              PROVINCE_ID: this.addressOfficeM.province,
            }).subscribe(respDist => {
              this.districtList = respDist;
              // console.log("districtList :", indx++);
              (this.addressOfficeM.province && this.addressOfficeM.district) && this.cacheService.getCacheMaster(CacheConstant.MS_SUBDISTRICT, SubDistrictMasterModel, {
                PROVINCE_ID: this.addressOfficeM.province,
                DISTRICT_ID: this.addressOfficeM.district,
              }).subscribe(respSubDist => {
                this.subDistrictList = respSubDist;
                // console.log("subDistrictList :", indx++);
                this.addressOfficeM.subDistrict && this.cacheService.getCacheMaster(CacheConstant.MS_POSTCODE, PostCodeMasterModel, {
                  SUBDISTRICT_CODE: this.addressOfficeM.subDistrict,
                }).subscribe(respPostcode => {
                  this.postCodeList = respPostcode;
                  // console.log("postCodeList :", indx++);
                  this.addressOfficeM.postcode = this.postCodeList && this.postCodeList.length == 1 && respPostcode[0] && respPostcode[0].postcode;
                }, error => {
                  console.warn('Error => ', error);
                });
              }, error => {
                console.warn('Error => ', error);
              });
            }, error => {
              console.warn('Error => ', error);
            });
          }
        }, error => {
          console.warn('Error => ', error);
        });
      }, error => {
        console.warn('Error => ', error);
      });

    }, error => {
      console.warn('Error => ', error);
    });
  }
  private getDistrict($event, provinceCode) {
    // console.log("▶️▶️ provinceCode", provinceCode);
    this.addressOfficeM.district = null;
    this.addressOfficeM.subDistrict = null;
    this.addressOfficeM.postcode = null;
    this.districtList = [];
    this.subDistrictList = [];
    this.postCodeList = [];
    this.cacheService.getCacheMaster(CacheConstant.MS_DISTRICT, DistrictMasterModel, {
      PROVINCE_ID: provinceCode,
    }).subscribe(respDist => {
      this.districtList = respDist;
    });
  }
  private getSubDistrict($event, provinceCode, districtCode) {
    // console.log("getSubDistrict:", districtCode);
    this.addressOfficeM.subDistrict = null;
    this.addressOfficeM.postcode = null;
    this.subDistrictList = [];
    this.postCodeList = [];
    this.cacheService.getCacheMaster(CacheConstant.MS_SUBDISTRICT, SubDistrictMasterModel, {
      PROVINCE_ID: provinceCode,
      DISTRICT_ID: districtCode,
    }).subscribe(respSubDist => {
      this.subDistrictList = respSubDist;
    });
  }
  private getPostCode($event, subDistrictCode) {
    // console.log("subDistrictCode:", subDistrictCode);
    this.cacheService.getCacheMaster(CacheConstant.MS_POSTCODE, PostCodeMasterModel, {
      SUBDISTRICT_CODE: subDistrictCode,
    }).subscribe(respPostcode => {
      this.postCodeList = respPostcode;
      this.addressOfficeM.postcode = this.postCodeList && this.postCodeList.length == 1 && respPostcode[0] && respPostcode[0].postcode;
    });
  }
  private backBtn() {
    this.navCtrl.canGoBack() && this.navCtrl.pop();
  }
  private nextToSpecifyInfo(userForm: NgForm) {
    if (userForm.form.valid == true) {
      this.navCtrl.push(UserProfileSpecifyInfoPage, this.businessUserM);
    } else {
      this.validationUtil.displayInvalidRequireField(userForm.form, "COMMON.USERPROFILE.");
    }
  }
}
