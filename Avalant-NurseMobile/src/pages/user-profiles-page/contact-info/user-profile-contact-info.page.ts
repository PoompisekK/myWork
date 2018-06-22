import { Component, Input, OnInit, forwardRef, Inject } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, LoadingOptions, AlertController } from 'ionic-angular';
import { UserProfileGeneralInfoPage } from '../general-info/user-profile-general-info.page';
import { UserModel } from '../../../model/user/user.model';
import { UserProfileSpecifyInfoPage } from '../specification-info/user-profile-specify-info.page';
import { YBatUserInfoModel } from '../../../model/user/ybat.user-info.model';
import { ProvinceMasterModel } from '../../../model/master-data/province.master.model';
import { DistrictMasterModel } from '../../../model/master-data/district.master.model';
import { SubDistrictMasterModel } from '../../../model/master-data/sub-district.master.model';
import { PostCodeMasterModel } from '../../../model/master-data/postcode.master.model';
import { AvaCacheService } from '../../../services/cache/cache.service';
import { AddressModel } from '../../../model/user/address.model';
import { UserAddressModel } from '../../../model/user/user-address.model';
import { AppConstant } from '../../../constants/app-constant';
import { ObjectsUtil } from '../../../utilities/objects.util';
import { UserProfileService } from '../../../services/userprofile/userprofile.service';
import { message } from '../../../layout-module/components/form-control-base/validate';
import { CacheConstant } from '../../../constants/cache';
import { NgForm } from "@angular/forms";
import { ValidationUtil } from '../../../utilities/validation.util';
import { StringUtil } from '../../../utilities/string.util';

@Component({
  selector: 'user-profile-contact-info-page',
  templateUrl: 'user-profile-contact-info.page.html',
  styleUrls: ['/user-profile-contact-info.page.scss'],
  styles: ['ion-col{position:initial}']
})
export class UserProfileContactInfoPage implements OnInit {

  private businessUserM: UserModel;
  private ybatUserInfoM: YBatUserInfoModel = new YBatUserInfoModel();
  private userAddressHome: UserAddressModel = new UserAddressModel();
  private addressHome: AddressModel = new AddressModel();

  private provinceList: Array<ProvinceMasterModel> = [];
  private districtList: Array<DistrictMasterModel> = [];
  private subDistrictList: Array<SubDistrictMasterModel> = [];
  private postCodeList: Array<PostCodeMasterModel> = [];

  public ngModelOpt = { standalone: true };

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public cacheService: AvaCacheService,
    public validationUtil: ValidationUtil,
  ) {
    this.businessUserM = this.navParams.data;
    this.ybatUserInfoM = this.businessUserM && this.businessUserM.ybatUserInfoM;
    if (ObjectsUtil.isEmptyObject(this.ybatUserInfoM)) {
      this.ybatUserInfoM = new YBatUserInfoModel();
      this.ybatUserInfoM.businessUserId = this.businessUserM.id;
    }
  }

  public ngOnInit(): void {
    if (!ObjectsUtil.isEmptyObject(this.businessUserM)) {
      let userAddressList = this.businessUserM.userAddressList;
      if (ObjectsUtil.isEmptyObject(userAddressList)) {
        userAddressList = new Array<UserAddressModel>();
        this.businessUserM.userAddressList = userAddressList;
      }
      this.userAddressHome = userAddressList.find(item => item.addressTypeId == AppConstant.ADDRESS_TYPE.HOME);
      // console.log("this.userAddressHome:", this.userAddressHome);
      if (ObjectsUtil.isEmptyObject(this.userAddressHome)) {
        this.userAddressHome = new UserAddressModel();
        this.businessUserM.userAddressList.push(this.userAddressHome);
      }
      this.userAddressHome.businessUserId = this.businessUserM.id;
      this.userAddressHome.status = 'A';
      this.userAddressHome.addressTypeId = AppConstant.ADDRESS_TYPE.HOME;

      this.addressHome = this.userAddressHome.address;
      if (ObjectsUtil.isEmptyObject(this.addressHome)) {
        this.addressHome = new AddressModel();
      }
      this.addressHome.status = 'A';
      this.addressHome.receiveName = this.businessUserM.custFname;
      this.addressHome.receiveSurname = this.businessUserM.custLname;
      if (StringUtil.isEmptyString(this.addressHome.email)) {
        this.addressHome.email = this.businessUserM.memberEmail;
      }

      this.addressHome.businessUserId = this.businessUserM.id;
      this.userAddressHome.address = this.addressHome;
    }

    // console.log("this.addressHome:", this.addressHome);

    this.initData();
  }
  private initData() {
    let indx = 0;
    this.cacheService.getCacheMaster(CacheConstant.MS_PROVINCE, ProvinceMasterModel).subscribe(resp => {
      this.provinceList = resp;
      // console.log("provinceList :", indx++);
      if (!ObjectsUtil.isEmptyObject(this.addressHome)) {
        this.addressHome.province && this.cacheService.getCacheMaster(CacheConstant.MS_DISTRICT, DistrictMasterModel, {
          PROVINCE_ID: this.addressHome.province,
        }).subscribe(respDist => {
          this.districtList = respDist;
          // console.log("districtList :", indx++);
          (this.addressHome.province && this.addressHome.district) && this.cacheService.getCacheMaster(CacheConstant.MS_SUBDISTRICT, SubDistrictMasterModel, {
            PROVINCE_ID: this.addressHome.province,
            DISTRICT_ID: this.addressHome.district,
          }).subscribe(respSubDist => {
            this.subDistrictList = respSubDist;
            // console.log("subDistrictList :", indx++);
            this.addressHome.subDistrict && this.cacheService.getCacheMaster(CacheConstant.MS_POSTCODE, PostCodeMasterModel, {
              SUBDISTRICT_CODE: this.addressHome.subDistrict,
            }).subscribe(respPostcode => {
              this.postCodeList = respPostcode;
              // console.log("postCodeList :", indx++);
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
  }
  private getDistrict($event, provinceCode) {
    // console.log("▶️▶️ provinceCode", provinceCode);
    this.addressHome.district = null;
    this.addressHome.subDistrict = null;
    this.addressHome.postcode = null;
    this.districtList = [];
    this.subDistrictList = [];
    this.postCodeList = [];
    provinceCode && this.cacheService.getCacheMaster(CacheConstant.MS_DISTRICT, DistrictMasterModel, {
      PROVINCE_ID: provinceCode,
    }).subscribe(respDist => {
      this.districtList = respDist;
    }, error => {
      console.warn('Error => ', error);
    });

  }
  private getSubDistrict($event, provinceCode, districtCode) {
    // console.log("getSubDistrict:", districtCode);
    this.addressHome.subDistrict = null;
    this.addressHome.postcode = null;
    this.subDistrictList = [];
    this.postCodeList = [];
    provinceCode && districtCode && this.cacheService.getCacheMaster(CacheConstant.MS_SUBDISTRICT, SubDistrictMasterModel, {
      PROVINCE_ID: provinceCode,
      DISTRICT_ID: districtCode,
    }).subscribe(respSubDist => {
      this.subDistrictList = respSubDist;
    }, error => {
      console.warn('Error => ', error);
    });
  }
  private getPostCode($event, subDistrictCode) {
    // console.log("subDistrictCode:", subDistrictCode);
    subDistrictCode && this.cacheService.getCacheMaster(CacheConstant.MS_POSTCODE, PostCodeMasterModel, {
      SUBDISTRICT_CODE: subDistrictCode,
    }).subscribe(respPostcode => {
      this.postCodeList = respPostcode;
      this.addressHome.postcode = this.postCodeList && this.postCodeList.length == 1 && respPostcode[0] && respPostcode[0].postcode;
    }, error => {
      console.warn('Error => ', error);
    });
  }
  private backBtn() {
    this.navCtrl.canGoBack() && this.navCtrl.pop();
  }
  private nextToGeneralInfo(userForm: NgForm) {
    if (userForm.form.valid == true) {
      this.navCtrl.push(UserProfileGeneralInfoPage, this.businessUserM);
    } else {
      this.validationUtil.displayInvalidRequireField(userForm.form, "COMMON.USERPROFILE.");
    }
  }
}