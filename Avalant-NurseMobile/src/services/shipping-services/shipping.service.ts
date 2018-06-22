import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../app/app.state';
import { AppConstant } from '../../constants/app-constant';
import { EAFModelWithMethod } from '../../model/eaf-rest/eaf-model-with-method.model';
import { ResponseBaseModel } from '../../model/rest/response-base.model';
import { AddressModel } from '../../model/user/address.model';
import { PersonalInfo } from '../../model/user/personal-info.model';
import { ShippingModel } from '../../model/user/shipping.model';
import { UserAddressModel } from '../../model/user/user-address.model';
import { UserModel } from '../../model/user/user.model';
import { YBatMsMedicalChoiceModel } from '../../model/user/ybat.ms-medical-choice.model';
import { YBatMsMedicalQuestionModel } from '../../model/user/ybat.ms-medical-question.model';
import { YBatUserContactInfoModel } from '../../model/user/ybat.user-contact-info.model';
import { YBatUserInfoModel } from '../../model/user/ybat.user-info.model';
import { YBatUserMedicalAnswerInfoModel } from '../../model/user/ybat.user-medical-info.model';
import { YBatUserMedicalQuestionModel } from '../../model/user/ybat.user-medical-questions.model';
import { ZybatCoursePrerequisiteModel } from '../../model/zybat/zybat-course-prerequisite.model';
import { ObjectsUtil } from '../../utilities/objects.util';
import { StringUtil } from '../../utilities/string.util';
import { EAFRestService } from '../eaf-rest/eaf-rest.service';
import { EAFRestUtil } from '../eaf-rest/eaf-rest.util';
import { UserProfileService } from '../userprofile/userprofile.service';

@Injectable()
export class ShippingService {

    constructor(

        private eafRestService: EAFRestService,
        private appState: AppState,
        private alertCtrl: AlertController,
        private userProfileService: UserProfileService,
    ) { }
    //cartService:any={};
    private _selectAddress: ShippingModel;
    private _attendees: PersonalInfo[] = [];
    private _personalInfo: PersonalInfo;
    private _zybatCoursePrerequisites: ZybatCoursePrerequisiteModel[];
    private _coupon: string;
    set couponCode(data) {
        this._coupon = data;
    }
    get couponCode() {
        return this._coupon;
    }
    get selectAddress() {
        return this._selectAddress;
    }
    set selectAddress(data) {
        this._selectAddress = data;
    }

    get attendeeUsers() {
        return this._attendees;
    }

    set attendeeUsers(data) {
        this._attendees = data;
    }

    get personalInfo() {
        return this._personalInfo;
    }

    set personalInfo(data) {
        this._personalInfo = data;
    }

    get zybatCoursePrerequisites() {
        return this._zybatCoursePrerequisites;
    }

    set zybatCoursePrerequisites(data) {
        this._zybatCoursePrerequisites = data;
    }

    public clearAllData(): void {
        this.selectAddress = this.personalInfo = this.zybatCoursePrerequisites = null;
    }

    public getAddressForShipping(): Observable<any> {
        let shippingList = [];
        return Observable.create((observer) => {
            this.getAddressByAddressTypeId(AppConstant.ADDRESS_TYPE.HOME).subscribe((respHome) => {
                shippingList = shippingList.concat(respHome);
                this.getShippingAddress().subscribe((respShip) => {
                    observer.next(shippingList.concat(respShip));
                    observer.complete();
                });
            });
        });
    }

    public getAddressByAddressTypeId(addrShipType: string): Observable<any> {
        return this.getShippingAddress(addrShipType);
    }

    public getShippingAddress(addrShipType?: string): Observable<any> {
        let addrType = (!StringUtil.isEmptyString(addrShipType) ? addrShipType : AppConstant.ADDRESS_TYPE.SHIPPING);
        let params = {
            'BUSINESS_USER_ID': this.appState.businessUser.id,
            'STATUS': 'A',
            "ADDRESS_TYPE_ID": addrType
        };
        return this.eafRestService.searchEntity(ShippingModel, ShippingModel.ENTITY_ID, params)
            .map((respData) => {
                // console.log("respData:", respData);
                respData && respData.forEach(elm => {
                    elm.addressTypeId = addrType;
                });
                return respData;
            });
    }

    public insertShippingAddress(shippingAddress: ShippingModel): Observable<ResponseBaseModel> {
        let tmpAddresID;
        return Observable.create((observ) => {
            this.eafRestService.saveEntity(ShippingModel.ENTITY_ID, [new EAFModelWithMethod(shippingAddress, 'INSERT')], {})
                .subscribe(resp1 => {
                    if (AppConstant.EAF_RESPONSE_CONST.isSuccess(resp1.status)) {
                        tmpAddresID = resp1['ADDRESS_ID'];
                        let tmpUserAddress = new UserAddressModel();
                        tmpUserAddress.addressId = tmpAddresID;
                        tmpUserAddress.addressTypeId = AppConstant.ADDRESS_TYPE.SHIPPING;
                        tmpUserAddress.businessUserId = this.appState.businessUser.id;
                        tmpUserAddress.status = 'A';
                        this.eafRestService.saveEntity(UserAddressModel.ENTITY_ID, [new EAFModelWithMethod(tmpUserAddress, 'INSERT')], {})
                            .subscribe((resp2) => {
                                observ.next(resp2);
                                observ.complete();
                            }, (err2) => {
                                observ.error(err2);
                            });
                    } else {
                        observ.error(resp1.message);
                    }
                }, (err1) => {
                    observ.error(err1);
                });
        });
    }

    public updateShippingAddress(shippingAddress: ShippingModel): Observable<any> {
        return this.eafRestService.saveEntity(ShippingModel.ENTITY_ID, [new EAFModelWithMethod(shippingAddress, 'UPDATE')], {});
    }

    public deleteShippingAddress(shippingAddress: ShippingModel): Observable<any> {
        shippingAddress.status = 'I';
        return this.eafRestService.saveEntity(ShippingModel.ENTITY_ID, [new EAFModelWithMethod(shippingAddress, 'UPDATE')], {});
    }

    public loadAttendees(callback: (res: any) => void = (res => { })) {

        if (!this.appState.businessUser) {
            this.loadAttendeesNotLogIn(res => {
                callback(res);
            });
            return;
        }

        //this.loadingLoadAttendees = true;

        this._attendees = [];
        this._personalInfo = new PersonalInfo();

        let userProfileData = this.appState.businessUser;
        // let selectCartDetail = this.cartService.selectedCartDetail;
        let selectCart = null;// this.cartService.selectCart;

        this._personalInfo.userProfile = userProfileData;

        this._personalInfo.attendeeType = 'O';

        let id = userProfileData.id;
        let productItemId;
        let shopType;
        let uRLSearchParams = new URLSearchParams();
        let searchParams = {

        };

        if (selectCart) {
            // productItemId = selectCartDetail.productItemId;
            shopType = selectCart.shopTypeId;
            // course || group
            if (AppConstant.SHOP_TYPE_MS.COURSE_EVENT == shopType || AppConstant.SHOP_TYPE_MS.GROUP_EVENT == shopType) {
                productItemId = selectCart.cartDetails[0].productItemId;
                uRLSearchParams.append("productItemId", productItemId);
                searchParams['productItemId'] = productItemId;
            }
        }
        // let serviceRequest: any = {};
        // serviceRequest = {
        //     businessUserId: id,
        //     productItemId: productItemId,
        //     shopType: shopType
        // };

        uRLSearchParams.append("businessUserId", id);
        uRLSearchParams.append("shopType", shopType);
        searchParams['businessUserId'] = id;
        searchParams['shopType'] = shopType;
        searchParams['language'] = this.appState.language;

        // let tmpResp = this.setPersonalInfo(searchParams, selectCart, id);
        // setTimeout(() => {
        //     callback(tmpResp);
        // }, 2500)
        this.getUserProfileManualServlet(searchParams, response => {
            // console.log(response);
            let zybatUserInfo = response.zybatUserInfo;
            //console.log("zybatUserInfo",zybatUserInfo)
            // console.log(this._personalInfo);
            if (zybatUserInfo) {
                // zybatUserInfo = ObjectsUtil.assign(response.zybatUserInfo, YBatUserInfoModel);
                zybatUserInfo = EAFRestUtil.mapEAFResponseModel(YBatUserInfoModel, response.zybatUserInfo);

                // let contactInfos = ObjectsUtil.assign(response.zybatUserContactInfos, YBatUserContactInfoModel);
                let contactInfos = [];
                for (let ybatUserContact of response.zybatUserContactInfos) {
                    contactInfos.push(EAFRestUtil.mapEAFResponseModel(YBatUserContactInfoModel, ybatUserContact));
                }
                //this.zybatUserInfoService.getZybatUserInfo(zybatUserInfo.userInfoId
                // , (info, contactInfos) => {
                this._personalInfo.zybatUserInfo = zybatUserInfo;
                this._personalInfo.zybatUserContactInfos = contactInfos;

                this._personalInfo.zybatUserContactInfoParent = this._personalInfo.zybatUserContactInfos.find(zybatContact => {
                    return (zybatContact.contactType == 'P');
                });

                this._personalInfo.zybatUserContactInfoEmergency = this._personalInfo.zybatUserContactInfos.find(zybatContact => {
                    return (zybatContact.contactType == 'E');
                });

                if (!this._personalInfo.zybatUserContactInfoParent) {
                    let zybatUserContactInfo = new YBatUserContactInfoModel();

                    zybatUserContactInfo.userInfoId = zybatUserInfo.userInfoId;
                    zybatUserContactInfo.contactType = 'P';

                    this._personalInfo.zybatUserContactInfoParent = zybatUserContactInfo;
                    this._personalInfo.zybatUserContactInfos.push(this._personalInfo.zybatUserContactInfoParent);
                }
                if (!this._personalInfo.zybatUserContactInfoEmergency) {
                    let zybatUserContactInfo = new YBatUserContactInfoModel();

                    zybatUserContactInfo.userInfoId = zybatUserInfo.userInfoId;
                    zybatUserContactInfo.contactType = 'E';

                    this._personalInfo.zybatUserContactInfoEmergency = zybatUserContactInfo;
                    this._personalInfo.zybatUserContactInfos.push(this._personalInfo.zybatUserContactInfoEmergency);
                }
                // console.log(this._personalInfo);
                //});
            }
            else {
                this._personalInfo.zybatUserInfo = new YBatUserInfoModel();
                this._personalInfo.zybatUserContactInfos = [];

                if (!this._personalInfo.zybatUserContactInfoParent) {
                    let zybatUserContactInfo = new YBatUserContactInfoModel();

                    //zybatUserContactInfo.userInfoId=info.userInfoId;
                    zybatUserContactInfo.contactType = 'P';

                    this._personalInfo.zybatUserContactInfoParent = zybatUserContactInfo;
                    this._personalInfo.zybatUserContactInfos.push(this._personalInfo.zybatUserContactInfoParent);
                }
                if (!this._personalInfo.zybatUserContactInfoEmergency) {
                    let zybatUserContactInfo = new YBatUserContactInfoModel();

                    //zybatUserContactInfo.userInfoId=info.userInfoId;
                    zybatUserContactInfo.contactType = 'E';

                    this._personalInfo.zybatUserContactInfoEmergency = zybatUserContactInfo;
                    this._personalInfo.zybatUserContactInfos.push(this._personalInfo.zybatUserContactInfoEmergency);
                }
            }
            this._personalInfo.homeAddress = EAFRestUtil.mapEAFResponseModel(AddressModel, response.homeAddress);
            this._personalInfo.documentAddress = EAFRestUtil.mapEAFResponseModel(AddressModel, response.documentAddress);
            this._personalInfo.officeAddress = EAFRestUtil.mapEAFResponseModel(AddressModel, response.officeAddress);

            if (!this._personalInfo.documentAddress || !this._personalInfo.documentAddress.addressId) {
                let docAddress = ObjectsUtil.clone(this._personalInfo.homeAddress);
                if (docAddress) {
                    docAddress.addressTypeId = '6';
                    docAddress.businessUserId = id;
                    this._personalInfo.documentAddress = docAddress;
                    // console.log(this._personalInfo.documentAddress);
                }
            }

            this._personalInfo.zybatUserMedicalInfos = [];
            // console.log(this._personalInfo);
            if (response.zybatUserMedicalInfos) {
                this._personalInfo.zybatUserMedicalInfos = ObjectsUtil.assign(response.zybatUserMedicalInfos, YBatUserMedicalAnswerInfoModel);
                // console.log(this._personalInfo);
            }
            this._personalInfo.zybatMedicalQuestions = [];
            if (response.zybatMedicalQuestions) {
                this._personalInfo.zybatMedicalQuestions = ObjectsUtil.assign(response.zybatMedicalQuestions, YBatUserMedicalQuestionModel);
                this._personalInfo.zybatMedicalQuestions.forEach(zybatMedicalQuestion => {
                    zybatMedicalQuestion.ybatMsMedicalQuestion = ObjectsUtil.assign(zybatMedicalQuestion.ybatMsMedicalQuestion, YBatMsMedicalQuestionModel);
                    zybatMedicalQuestion.ybatMsMedicalChoices = ObjectsUtil.assign(zybatMedicalQuestion.ybatMsMedicalChoices, YBatMsMedicalChoiceModel);
                });
            }

            this.zybatCoursePrerequisites = ObjectsUtil.assign(response.zybatCoursePrerequisites, ZybatCoursePrerequisiteModel);

            this._attendees.push(this._personalInfo);

            let cartDetail = selectCart.cartDetails[0];

            if (cartDetail) {
                // console.log("+++++++++++++++++++++++++++++++++++cartDetail++++++++++++++++++++++++++++++");
                let quantity = cartDetail.itemQuantity;
                for (let i = 1; i < quantity; i++) {
                    let personalInfo = new PersonalInfo();
                    let userProfileModel = new UserModel();
                    let zybatUserInfoModel = new YBatUserInfoModel();
                    let docAddress = new AddressModel();
                    let officeAddress = new AddressModel();
                    let zybatUserContactInfoParent = new YBatUserContactInfoModel();
                    let zybatUserContactInfoEmergency = new YBatUserContactInfoModel();
                    let zybatUserContactInfos = [];

                    zybatUserContactInfos.push(zybatUserContactInfoParent);
                    zybatUserContactInfos.push(zybatUserContactInfoEmergency);
                    zybatUserContactInfoParent.contactType = 'P';
                    zybatUserContactInfoEmergency.contactType = 'E';
                    docAddress.addressTypeId = '6';
                    officeAddress.addressTypeId = '5';

                    personalInfo.userProfile = userProfileModel;
                    personalInfo.zybatUserInfo = zybatUserInfoModel;
                    personalInfo.documentAddress = docAddress;
                    personalInfo.officeAddress = officeAddress;
                    personalInfo.zybatUserContactInfos = zybatUserContactInfos;
                    personalInfo.zybatUserContactInfoParent = zybatUserContactInfoParent;
                    personalInfo.zybatUserContactInfoEmergency = zybatUserContactInfoEmergency;
                    personalInfo.attendeeType = 'P';
                    personalInfo.zybatMedicalQuestions = ObjectsUtil.clone(this._personalInfo.zybatMedicalQuestions);
                    personalInfo.zybatUserMedicalInfos = [];
                    this._attendees.push(personalInfo);
                }
            }

            callback(response);
            //this.loadingLoadAttendees = false;
        });

    }
    private loadAttendeesNotLogIn(callback: (res: any) => void = (res => { })) {

        //this.loadingLoadAttendees=true;

        //let cartDetail = this.cartService.selectCartDetail;

        let productItemId;
        //if(cartDetail){
        //  productItemId=cartDetail.PRODUCT_ITEM_ID;
        //}

        let quantity = 1;
        //if (cartDetail) {
        //  quantity = cartDetail.ITEM_QUANTITY;
        //}
        // let serviceRequest: any = {};
        // serviceRequest = {
        //     productItemId: productItemId
        // };

        let uRLSearchParams = new URLSearchParams();

        uRLSearchParams.append("productItemId", productItemId);
        let searchParams = {
            productItemId: productItemId
        };

        this.getUserProfileManualServlet(searchParams, response => {
            for (let i = 0; i < quantity; i++) {
                let personalInfo = new PersonalInfo();
                let userProfileModel = new UserModel();
                let zybatUserInfoModel = new YBatUserInfoModel();
                let homeAddress = new AddressModel();
                let docAddress = new AddressModel();
                let officeAddress = new AddressModel();
                let zybatUserContactInfoParent = new YBatUserContactInfoModel();
                let zybatUserContactInfoEmergency = new YBatUserContactInfoModel();
                let zybatUserContactInfos = [];

                zybatUserContactInfos.push(zybatUserContactInfoParent);
                zybatUserContactInfos.push(zybatUserContactInfoEmergency);
                zybatUserContactInfoParent.contactType = 'P';
                zybatUserContactInfoEmergency.contactType = 'E';
                docAddress.addressTypeId = '6';
                officeAddress.addressTypeId = '5';

                personalInfo.userProfile = userProfileModel;
                personalInfo.zybatUserInfo = zybatUserInfoModel;
                personalInfo.homeAddress = homeAddress;
                personalInfo.documentAddress = docAddress;
                personalInfo.officeAddress = officeAddress;
                personalInfo.zybatUserContactInfos = zybatUserContactInfos;
                personalInfo.zybatUserContactInfoParent = zybatUserContactInfoParent;
                personalInfo.zybatUserContactInfoEmergency = zybatUserContactInfoEmergency;
                personalInfo.attendeeType = ((i == 0) ? 'O' : 'P');
                //personalInfo.zybatMedicalQuestions=Util.clone(this._personalInfo.zybatMedicalQuestions);
                personalInfo.zybatUserMedicalInfos = [];

                let zybatMedicalQuestions = [];
                if (response.zybatMedicalQuestions) {
                    zybatMedicalQuestions = ObjectsUtil.assign(response.zybatMedicalQuestions, YBatUserMedicalQuestionModel);
                    zybatMedicalQuestions.forEach(zybatMedicalQuestion => {
                        zybatMedicalQuestion.zybatMsMedicalQuestion = ObjectsUtil.assign(zybatMedicalQuestion.zybatMsMedicalQuestion, YBatMsMedicalQuestionModel);
                        zybatMedicalQuestion.zybatMsMedicalChoices = ObjectsUtil.assign(zybatMedicalQuestion.zybatMsMedicalChoices, YBatMsMedicalChoiceModel);
                    });
                }
                personalInfo.zybatMedicalQuestions = zybatMedicalQuestions;

                // WARNING FOR NO EMAIL
                if (!personalInfo.userProfile) {
                    console.warn('   [personalInfo] :', personalInfo);
                    console.trace(' NO USER PROFILE SHIT !!!');
                } else if (!personalInfo.userProfile.memberEmail) {
                    console.warn(' NO MEMBER EMAIL SHIT !!!', personalInfo.userProfile);
                    console.trace(' Trace .');
                }

                if (!this._attendees) {
                    this._attendees = [];
                }
                this._attendees.push(personalInfo);

                if (i == 0) this._personalInfo = personalInfo;
            }
            callback(this._attendees);
            //this.loadingLoadAttendees=false;
        });

    }

    public shippingProduct(orderStatus: string = '1', callback: (data: any) => void, errorCallback?: (data: any) => void) {
        // console.log("shippingProduct");
        //this.loadingShippingProduct=true;

        let cart = null;//this.cartService.selectCart;
        let oriCart = null;//this.cartService.selectCart;
        if (cart) {

        }
        // else {
        //     let selectCartDetail = this.checkOutService.selectCartDetail;
        //     let carts = this.cartService.cart;
        //     carts.forEach(cartcc => {
        //         let cartDetail = cartcc.cartDetails.find(cartDetail => cartDetail.PRODUCT_ITEM_ID == selectCartDetail.PRODUCT_ITEM_ID);
        //         if (cartDetail) {
        //             cart = ObjectsUtil.clone(cartcc);
        //             oriCart = cartcc;
        //             cart.cartDetails = []
        //             cart.cartDetails.push(selectCartDetail);
        //         }
        //     })
        // }

        // let coupon=this.checkOutService.getCouponDiscounts().find(cd=>cd.shopId==cart.shopId);

        let orderRequestModel: any = {};

        orderRequestModel.orderStatus = orderStatus;
        orderRequestModel.address = this.selectAddress;
        orderRequestModel.personalInfos = this.attendeeUsers;
        // console.log(cart);
        orderRequestModel.couponCode = this.couponCode;

        if (orderRequestModel.personalInfos == null) {
            orderRequestModel.personalInfos = [];
        }
        orderRequestModel.cart = cart;

        // for (let i = 0; i < orderRequestModel.personalInfos.length; i++) {
        //     if (!orderRequestModel.personalInfos[i].id) {
        //         orderRequestModel.personalInfos.splice(i, 1);
        //     }
        // }

        // if(coupon){
        //      orderRequestModel.couponCode=coupon.couponCode;
        // }  

        let email = "";
        if (this.appState.businessUser) {
            orderRequestModel.businessUserId = this.appState.businessUser.id;
            email = this.appState.businessUser.memberEmail;
        }
        // else if (this.selectAddress) {
        //     email = this.selectAddress.email;
        // } else if (this.attendeeUsers && this.attendeeUsers.length > 0) {
        //     email = this.attendeeUsers[0].userProfile.memberEmail;
        // }
        //console.log(orderRequestModel)
        let requestModel = EAFRestUtil.buildJSONRequestModel(orderRequestModel);
        //console.log(requestModel)

        this.eafRestService.postManualServlet('OrderShipping', null, {
            body: requestModel,
        }).subscribe((response: any) => {
            //let data = Util.convertDataToString(response)
            let data = response;
            if (response.responseStatus == "SUCCESS") {
                //let mailparam = {};

                //mailparam['email'] = email;
                //mailparam['order_id'] = data.orderhead.ORDERCODE;
                // this.sendEmail(mailparam, responseMail => {
                //     //console.log("email",data);

                // });
                if (this.appState.businessUser) {
                    // this.cartService.deleteToDb(oriCart, cart.cartDetails, res => {
                    //     //this.clearCart();
                    //     //this.checkOutService.removeCoupon(coupon);
                    //     callback(data);
                    //     //this.loadingShippingProduct=false;
                    // });
                } else {
                    cart.cartDetails.forEach(cartDetail => {
                        // this.cartService.removeFromCart(cart.shopId, cartDetail.productItemId);
                    });
                    //this.clearCart();
                    //this.checkOutService.removeCoupon(coupon);
                    callback(data);
                    //this.loadingShippingProduct=false;
                }

                // Clear fucking data
                this.selectAddress = null;
                this.attendeeUsers = null;
            } else {
                if (response.responseCode == 'WAITFULL') {
                    let alert = this.alertCtrl.create({
                        title: 'WAITFULL',
                        subTitle: 'หลักสูตรปฏิบัติเต็มไม่สามารถเข้าร่วมได้"',
                        buttons: ['Dismiss']
                    });
                    alert.present();
                    //this.mdlDialogService.alert("หลักสูตรปฏิบัติเต็มไม่สามารถเข้าร่วมได้");
                } else if (data.responseCode == "OUTOFSTOCK") {
                    //this.mdlDialogService.alert("จำนวนสินค้าที่เหลือไม่พอ ไม่สามารถซื้อได้");
                    let alert = this.alertCtrl.create({
                        title: 'OUTOFSTOCK',
                        subTitle: 'จำนวนสินค้าที่เหลือไม่พอ ไม่สามารถซื้อได้"',
                        buttons: ['Dismiss']
                    });
                    alert.present();
                }
                else {
                    //this.mdlDialogService.alert("ERROR");
                    let alert = this.alertCtrl.create({
                        title: 'Error',
                        subTitle: JSON.stringify(response),
                        buttons: ['Dismiss']
                    });
                    alert.present();
                }
                //this.loadingShippingProduct=false;
                typeof errorCallback === 'function' && errorCallback(response);
            }
        }, error => {
            //this.mdlDialogService.alert("ERROR");
            console.log("Error");
            //this.loadingShippingProduct=false;
            typeof errorCallback === 'function' && errorCallback(error);

        });

    }

    public getUserProfileManualServlet(requestParam: any, callback: (response: any) => void) {
        this.userProfileService.postYBATManualBusinessUserDetail(requestParam)
            .subscribe(response => {
                let data = response;
                callback(data);
            }, error => {
                console.warn('Error => ', error);
            });

    }

    public updateBusinessUser(userModel: UserModel): Observable<ResponseBaseModel> {
        let params = [];
        params.push(new EAFModelWithMethod(userModel, this.getInsertUpdateByPrimaryKey(userModel.id), 'MD1171819565'));

        let yBatUserM = userModel.ybatUserInfoM;

        let attactMentList = yBatUserM.ybatUserAttachmentInfoList;
        attactMentList && attactMentList.forEach(attchItm => {
            params.push(new EAFModelWithMethod(attchItm, this.getInsertUpdateByPrimaryKey(attchItm.attachDocumentId), 'MD1171812849'));
        });
        return this.eafRestService.saveEntity(UserModel.ENTITY_ID, params, {});
    }

    public updateYBatUserInfo(yBatUserInfo: YBatUserInfoModel): Observable<ResponseBaseModel> {
        let params = [];
        params.push(new EAFModelWithMethod(yBatUserInfo, this.getInsertUpdateByPrimaryKey(yBatUserInfo.userInfoId)));
        return this.eafRestService.saveEntity(YBatUserInfoModel.ENTITY_ID, params, {});
    }

    public updateYBatUserInfoDeep(yBatUserInfo: YBatUserInfoModel, yBatUserContactInfoList?: YBatUserContactInfoModel[], yBatUserAnswerInfoList?: YBatUserMedicalAnswerInfoModel[], deletedItm_UserAnswerInfoList?: YBatUserMedicalAnswerInfoModel[]): Observable<ResponseBaseModel> {
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

    public updateYBatUserContactInfoModel(ybatUserContactInfo: YBatUserContactInfoModel): Observable<ResponseBaseModel> {
        let params = [];
        params.push(new EAFModelWithMethod(ybatUserContactInfo, this.getInsertUpdateByPrimaryKey(ybatUserContactInfo.userContactId)));
        return this.eafRestService.saveEntity(YBatUserContactInfoModel.ENTITY_ID, params, {});
    }

    public updateYBatAnswer(ybatAnswer: YBatUserMedicalAnswerInfoModel): Observable<ResponseBaseModel> {
        let params = [];
        params.push(new EAFModelWithMethod(ybatAnswer, this.getInsertUpdateByPrimaryKey(ybatAnswer.userMedicalQuestionId)));
        return this.eafRestService.saveEntity(YBatUserMedicalAnswerInfoModel.ENTITY_ID, params, {});
    }

    private getInsertUpdateByPrimaryKey(key: string): 'INSERT' | 'UPDATE' {
        return StringUtil.isEmptyString(key) ? 'INSERT' : 'UPDATE';
    }

}