import { forwardRef, Inject, Injectable } from '@angular/core';
import { TranslationService } from 'angular-l10n';
import { AlertController } from 'ionic-angular';
import { SessionStorage } from 'ngx-Webstorage/dist/decorators';
import { Observable } from 'rxjs';

import { AppState } from '../../app/app.state';
import { AppConstant } from '../../constants/app-constant';
import { EAFModelWithMethod } from '../../model/eaf-rest/eaf-model-with-method.model';
import { ResponseBaseModel } from '../../model/rest/response-base.model';
import { AddressModel } from '../../model/user/address.model';
import { UserAddressModel } from '../../model/user/user-address.model';
import { UserModel } from '../../model/user/user.model';
import { YBatMsMedicalChoiceModel } from '../../model/user/ybat.ms-medical-choice.model';
import { YBatMsMedicalQuestionModel } from '../../model/user/ybat.ms-medical-question.model';
import { YBatUserAttachmentModel } from '../../model/user/ybat.user-attachment.model';
import { YBatUserContactInfoModel } from '../../model/user/ybat.user-contact-info.model';
import { YBatUserInfoModel } from '../../model/user/ybat.user-info.model';
import { YBatUserMedicalAnswerInfoModel } from '../../model/user/ybat.user-medical-info.model';
import { YBatUserMedicalQuestionModel } from '../../model/user/ybat.user-medical-questions.model';
import { ObjectsUtil } from '../../utilities/objects.util';
import { RxJSUtil } from '../../utilities/rxjs.util';
import { StringUtil } from '../../utilities/string.util';
import { WorkforceHttpService } from '../../workforce/service/workforceHttpService';
import { WorkforceService } from '../../workforce/service/workforceService';
import { EAFRestService } from '../eaf-rest/eaf-rest.service';
import { EAFRestUtil } from '../eaf-rest/eaf-rest.util';
import { HttpService } from '../http-services/http.service';

@Injectable()
export class UserProfileService {
  private cfg = { page: '1', volumePerPage: '20' };

  @SessionStorage()
  private _businessUser: UserModel;

  public get businessUser() {
    return this._businessUser;
  }
  public set businessUser(businessUser) {
    this._businessUser = businessUser;
  }
  constructor(
    private appState: AppState,
    private httpService: HttpService,
    private alertCtrl: AlertController,
    private translationService: TranslationService,
    private workforceService: WorkforceService,
    private wfHttpService: WorkforceHttpService,
    @Inject(forwardRef(() => EAFRestService)) private eafRestService: EAFRestService,
  ) { }

  public updateUserProfile(userRegis: UserModel): Observable<ResponseBaseModel> {
    let ybatUserInfoM = userRegis.ybatUserInfoM;
    let waterfallObserve = RxJSUtil.waterfall([() => {
      ybatUserInfoM.businessUserId = userRegis.id;
      return this.updateBusinessUser(userRegis);
    }, (result1) => {
      // console.log("updateBusinessUser =>", result1);
      return this.updateYBatUserInfo(ybatUserInfoM, ybatUserInfoM.ybatUserContactInfoList, ybatUserInfoM.ybatUserMedicalAnswerInfoList, ybatUserInfoM["deletedItm_UserAnswerInfoList"]);

    }, (result3) => {
      let completeFlag = [];
      return Observable.create((observer) => {
        for (let idx = 0; idx < userRegis.userAddressList.length; idx++) {
          let userAddrItm = userRegis.userAddressList[idx];
          this.updateAddressList([userAddrItm.address]).subscribe((rsp) => {
            completeFlag.push(rsp);
            if (AppConstant.EAF_RESPONSE_CONST.isSuccess(rsp.status)) {
              userAddrItm.addressId = rsp['ADDRESS_ID'];
            }
            if (completeFlag.length == userRegis.userAddressList.length) {
              // console.log("completeFlag:", completeFlag);
              observer.next(userRegis.userAddressList);
              observer.complete();
            }
          }, (error) => {
            console.log("error:", error);
            observer.next(userRegis.userAddressList);
            observer.complete();
          });
        }
      });

    }, (userAddressList) => {
      // console.log("updateAddressList =>", userAddressList);
      // return this.updateUserAddressList(userAddressList);
      let completeFlag = [];
      return Observable.create((observer) => {
        for (let idx = 0; idx < userAddressList.length; idx++) {
          let userAddrItm = userAddressList[idx];
          this.updateUserAddressList([userAddrItm]).subscribe((rsp) => {
            completeFlag.push(rsp);
            if (AppConstant.EAF_RESPONSE_CONST.isSuccess(rsp.status)) {
              userAddrItm.addressId = rsp['USER_ADDRESS_ID'];
            }
            if (completeFlag.length == userRegis.userAddressList.length) {
              // console.log("completeFlag:", completeFlag);
              observer.next(completeFlag);
              observer.complete();
            }
          });
        }
      });

      // }, (result2) => {
      //   console.log("updateYBatUserInfo =>", result2);
      //   return this.updateUserAddressList(userRegis.userAddressList);
      // }, (result3) => {
      //   console.log("updateUserAddressList =>", result3);
      //   let addressList: AddressModel[] = [];
      //   userRegis.userAddressList.forEach((userAddrItm) => { addressList.push(userAddrItm.address); });
      //   return this.updateAddressList(addressList);

      // }, (result4) => {
      //   console.log("updateYBatUserInfo =>", result4);
      //   return this.xxxxxxxxx(userRegis);

    }, (finalRep) => {
      // console.log("updateUserAddressList =>", finalRep);
      return Observable.create((observer) => {
        setTimeout(() => {
          observer.next(finalRep);
          observer.complete();
        }, 100);
      });
    }]);
    return waterfallObserve;
  }

  /**
   * 
   */
  private getInsertUpdateByPrimaryKey(key: string): 'INSERT' | 'UPDATE' {
    return StringUtil.isEmptyString(key) ? 'INSERT' : 'UPDATE';
  }
  public updateBusinessUser(userRegis: UserModel): Observable<ResponseBaseModel> {
    let params = [];
    params.push(new EAFModelWithMethod(userRegis, this.getInsertUpdateByPrimaryKey(userRegis.id), 'MD1171819565'));

    let yBatUserM = userRegis.ybatUserInfoM;
    // params.push(new EAFModelWithMethod(yBatUserM, this.getInsertUpdateByPrimaryKey(yBatUserM.userInfoId), 'MD1171148160'));

    let attactMentList = yBatUserM.ybatUserAttachmentInfoList;
    attactMentList && attactMentList.forEach(attchItm => {
      params.push(new EAFModelWithMethod(attchItm, this.getInsertUpdateByPrimaryKey(attchItm.attachDocumentId), 'MD1171812849'));
    });
    return this.eafRestService.saveEntity(UserModel.ENTITY_ID, params, {});
  }

  private updateYBatUserAttachmentInfoList(attactMentList: YBatUserAttachmentModel[]): Observable<ResponseBaseModel> {
    let params = [];
    attactMentList && attactMentList.forEach((addressItem) => {
      params.push(new EAFModelWithMethod(addressItem, this.getInsertUpdateByPrimaryKey(addressItem.attachDocumentId)));
    });
    return this.eafRestService.saveEntity(YBatUserAttachmentModel.ENTITY_ID, params, {});
  }
  private updateAddressList(addressList: AddressModel[]): Observable<ResponseBaseModel> {
    let params = [];
    addressList && addressList.forEach((addressItem) => {
      params.push(new EAFModelWithMethod(addressItem, this.getInsertUpdateByPrimaryKey(addressItem.addressId), 'MD1172150798'));
    });
    // this.eafRestService.saveEntity(AddressModel.ENTITY_ID, params, {});
    return this.eafRestService.saveEntity("EN_170427214948756_v001", params, {});
  }

  private updateUserAddressList(userAddressList: UserAddressModel[]): Observable<ResponseBaseModel> {
    let params = [];
    userAddressList && userAddressList.forEach((userAddrItem) => {
      params.push(new EAFModelWithMethod(userAddrItem, this.getInsertUpdateByPrimaryKey(userAddrItem.userAddressId), 'MD9596983409'));
    });
    // this.eafRestService.saveEntity(UserAddressModel.ENTITY_ID, params, {});
    return this.eafRestService.saveEntity("EN_151464391839460", params, {});
  }

  public updateYBatUserInfoForCourseEvent(yBatUserInfo: YBatUserInfoModel, yBatUserContactInfoList?: YBatUserContactInfoModel[]) {
    return this.updateYBatUserInfo(yBatUserInfo, yBatUserContactInfoList);
  }

  private updateYBatUserInfo(yBatUserInfo: YBatUserInfoModel, yBatUserContactInfoList?: YBatUserContactInfoModel[], yBatUserAnswerInfoList?: YBatUserMedicalAnswerInfoModel[], deletedItm_UserAnswerInfoList?: YBatUserMedicalAnswerInfoModel[]): Observable<ResponseBaseModel> {
    let params = [];
    params.push(new EAFModelWithMethod(yBatUserInfo, this.getInsertUpdateByPrimaryKey(yBatUserInfo.userInfoId), "MD1171413983"));
    if (!ObjectsUtil.isEmptyObject(yBatUserContactInfoList)) {
      yBatUserContactInfoList.forEach((contactItm) => {
        params.push(new EAFModelWithMethod(contactItm, this.getInsertUpdateByPrimaryKey(contactItm.userContactId), "MD1171413663"));
      });
    }
    if (!ObjectsUtil.isEmptyObject(yBatUserAnswerInfoList)) {
      yBatUserAnswerInfoList.forEach((userMedicalAnswerItm) => {
        params.push(new EAFModelWithMethod(userMedicalAnswerItm, this.getInsertUpdateByPrimaryKey(userMedicalAnswerItm.userMedicalQuestionId), "MD1171318493"));
      });
    }
    if (!ObjectsUtil.isEmptyObject(deletedItm_UserAnswerInfoList)) {
      deletedItm_UserAnswerInfoList.forEach((deleteItemAnswer) => {
        params.push(new EAFModelWithMethod(deleteItemAnswer, "DELETE", "MD1171318493"));
      });
    }
    return this.eafRestService.saveEntity(YBatUserInfoModel.ENTITY_ID, params, {});
  }

  private queueLoadAddress(idx: number): void {
    // console.log("queueLoadAddress idx:", idx);
    let bizUser: UserModel = this.appState.businessUser;
    let addressItem = bizUser.userAddressList[idx];
    bizUser && bizUser.userAddressList[idx] && this.getAddress(addressItem.addressId, addressItem.businessUserId)
      .subscribe(respAddress => {
        bizUser.userAddressList[idx].address = respAddress;
        if ((idx + 1) < bizUser.userAddressList.length) {
          this.queueLoadAddress(idx + 1);
        } else {
          // console.log("bizUser.userAddressList Done !!!");
        }
      }, error => {
        console.warn('Error => ', error);
      });
  }
  //---------------------------------------------------------------------------------------------------------------
  private getBusinessUser(memberEmail: string): Observable<UserModel> {
    return this.eafRestService.searchEntity(UserModel, UserModel.ENTITY_ID, {
      MEMBEREMAIL: memberEmail
    }, this.cfg).map(resp => resp && resp.length && resp[0]);
  }

  private getUserAddressList(businessUserId: string): Observable<UserAddressModel[]> {
    return this.eafRestService.searchEntity(UserAddressModel, UserAddressModel.ENTITY_ID, {
      BUSINESS_USER_ID: businessUserId
    }, this.cfg);
  }

  private getAddress(addressId: string, businessUserId: string): Observable<AddressModel> {
    return this.eafRestService.searchEntity(AddressModel, AddressModel.ENTITY_ID, {
      ADDRESS_ID: addressId,
      BUSINESS_USER_ID: businessUserId,
    }, this.cfg).map(resp => resp && resp.length && resp[0]);
  }

  /**------------------------------New Logic Getting UserProfiles Data By Rest ManualServlet------------------------------------------------------- */
  /**
   * getLoginManualServlet
   */

  public postYBATManualBusinessUserDetail(_params: any): Observable<any> {
    return this.eafRestService.postManualServlet("BusinessUserAndYbatDetailREST", null, {
      params: {
        ..._params
        // businessUserId: bizzUserId,
        // language
      }
    });
  }

  public getLoginManualServlet(bizzUserId: string, language?: string): Observable<any> {
    language = (!StringUtil.isEmptyString(language) ? language : this.appState.language);
    return this.postYBATManualBusinessUserDetail({ businessUserId: bizzUserId, language }).map((respUserM: any) => {
      // console.log("getLoginManualServlet respUserM:", respUserM);
      let bizUserM = new UserModel();
      bizUserM = EAFRestUtil.mapEAFResponseModel(UserModel, (ObjectsUtil.isEmptyObject(respUserM.userProfile) ? {} : respUserM.userProfile));//Mapping With UPPER_CASE Properties
      bizUserM.ybatUserInfoM = EAFRestUtil.mapEAFResponseModel(YBatUserInfoModel, (ObjectsUtil.isEmptyObject(respUserM.zybatUserInfo) ? {} : respUserM.zybatUserInfo));//Mapping With CAMEL_CASE Properties
      respUserM.userAddressLists && respUserM.userAddressLists.forEach(userAddrElm => {
        let userAddrItm = ObjectsUtil.instantiate(UserAddressModel, userAddrElm);
        userAddrItm.address = EAFRestUtil.mapEAFResponseModel(AddressModel, userAddrElm.address);
        bizUserM.userAddressList.push(userAddrItm);
      });

      /** UserAttachmentInfoList Map */
      respUserM.zybatUserAttachDocumentInfos && respUserM.zybatUserAttachDocumentInfos.forEach(elmAttachDoc => {
        let userAttachDoclist = ObjectsUtil.instantiate(YBatUserAttachmentModel, elmAttachDoc);
        let userAttachDoclistEaf = EAFRestUtil.mapEAFResponseModel(YBatUserAttachmentModel, userAttachDoclist);
        // console.log("userAttachDoclist:", userAttachDoclist);
        // console.log("userAttachDoclistEaf:", userAttachDoclistEaf);
        bizUserM.ybatUserInfoM.ybatUserAttachmentInfoList.push(userAttachDoclistEaf);
      });

      /** Usercontat Map */
      respUserM.zybatUserContactInfos && respUserM.zybatUserContactInfos.forEach(elmCntact => {
        let userContactInfoItm = EAFRestUtil.mapEAFResponseModel(YBatUserContactInfoModel, elmCntact);
        bizUserM.ybatUserInfoM.ybatUserContactInfoList.push(userContactInfoItm);
      });

      /** Question Map */
      respUserM.zybatMedicalQuestions && respUserM.zybatMedicalQuestions.forEach(elmQuestion => {
        let medecialQuestionItem = ObjectsUtil.instantiate(YBatUserMedicalQuestionModel, elmQuestion);
        medecialQuestionItem.ybatMsMedicalQuestion = ObjectsUtil.instantiate(YBatMsMedicalQuestionModel, elmQuestion.zybatMsMedicalQuestion);
        elmQuestion.zybatMsMedicalChoices && elmQuestion.zybatMsMedicalChoices.forEach(elmChoices => {
          let medecialChoiceItem = ObjectsUtil.instantiate(YBatMsMedicalChoiceModel, elmChoices);
          medecialQuestionItem.ybatMsMedicalChoices.push(medecialChoiceItem);
          delete medecialQuestionItem['zybatMsMedicalChoices'];
          delete medecialQuestionItem['zybatMsMedicalQuestion'];
        });
        bizUserM.ybatUserInfoM.ybatUserMedicalQuestionListModel.push(medecialQuestionItem);
      });

      /** UserAnswer Question Map */
      respUserM.zybatUserMedicalInfos && respUserM.zybatUserMedicalInfos.forEach(elmMedicAnswer => {
        // let userMedicAnswerItm = ObjectsUtil.instantiate(YBatUserMedicalAnswerInfoModel, elmMedicAnswer);
        let userMedicAnswerItm = EAFRestUtil.mapEAFResponseModel(YBatUserMedicalAnswerInfoModel, elmMedicAnswer);
        bizUserM.ybatUserInfoM.ybatUserMedicalAnswerInfoList.push(userMedicAnswerItm);
      });
      return bizUserM;
    }).do((bizuserM) => {
      return Observable.create((observer) => {
        observer.next(bizuserM);
      });
    });
  }

  public retrieveUserProfilesInfo(): void {
    if (!ObjectsUtil.isEmptyObject(this.appState.businessUser)) {
      // console.debug("%c------------Getting Userprofiles Information------------", 'background:yellow');
      this.getLoginManualServlet(this.appState.businessUser.id, this.appState.businessUser.languages).subscribe(resp => {
        this.appState.businessUser = resp;
        this.wfHttpService.employeeCode = this.appState.businessUser.employeeCode || this.appState.businessUser.userCode;
        this.wfHttpService.businessUser = this.appState.businessUser;
        this.appState.employeeCode = this.wfHttpService.employeeCode;
        console.log("retrieveUserProfilesInfo employeeCode :", this.wfHttpService.employeeCode);
        // console.log("getUserprofilesManualServlet businessUser:", this.appState.businessUser);
      }, error => {
        console.warn('Error => ', error);
      });
    }
  }

}
