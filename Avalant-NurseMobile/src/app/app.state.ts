import { Injectable } from '@angular/core';
import { LocaleService } from 'angular-l10n';
import { Events } from 'ionic-angular';
import { LocalStorageService, SessionStorageService } from 'ngx-Webstorage';

import { AppConstant } from '../constants/app-constant';
import { isChromeDev } from '../constants/environment';
import { AuthenticationRequestModel } from '../model/authentication/authentication-request.model';
import { MobileInfoModel } from '../model/mobile/mobile-info.model';
import { ShippingModel } from '../model/user/shipping.model';
import { UserModel } from '../model/user/user.model';
import { VehicleDataModel } from '../model/vehicle/vehicle.model';
import { EAFRestUtil } from '../services/eaf-rest/eaf-rest.util';
import { ObjectsUtil } from '../utilities/objects.util';
import { WorkforceHttpService } from '../workforce/service/workforceHttpService';
import { WorkforceService } from '../workforce/service/workforceService';

/**
 * App State
 * 
 * @description Use to hold data or state that using in whole application
 * 
 * Created by NorrapatN on 4/19/2017.
 */
@Injectable()
export class AppState {

    constructor(
        private events: Events,
        private localeService: LocaleService,
        private localStorage: LocalStorageService,
        private sessionStorage: SessionStorageService,
        private wfService: WorkforceService,
        private wfHttpService: WorkforceHttpService
    ) {
        // Default values
        this.authData = new AuthenticationRequestModel('m=', 'm=');

        let eafBusinessUser = localStorage.retrieve(AppConstant.LOCAL_STORAGE_KEY.BUSINESS_USER);

        if (eafBusinessUser) {
            isChromeDev() && console.log("eafBusinessUser :", eafBusinessUser);
            this._businessUser = EAFRestUtil.mapEAFResponseModel(UserModel, eafBusinessUser);
            isChromeDev() && console.log("businessUser :", this.businessUser);
            let shippinglist = localStorage.retrieve(AppConstant.LOCAL_STORAGE_KEY.SHIPPING_LIST);
            if (shippinglist) {
                shippinglist.forEach(shippingInfo => {
                    shippingInfo = EAFRestUtil.mapEAFResponseModel(ShippingModel, shippingInfo);
                });
                this._shippingList = shippinglist;
            }
        }

        this._currentOrganizationId = this.localStorage.retrieve(AppConstant.LOCAL_STORAGE_KEY.CURRENT_ORGANIZATION_ID);
    }

    // This should be Getter for retrive value directly from Locale service
    public get language(): string {
        return this.localeService.getCurrentLanguage().toUpperCase();
    }

    public mobileInfo: MobileInfoModel = new MobileInfoModel();

    public cartButtonBouncing: string;

    public get currentOrganizationId(): string {
        return this._currentOrganizationId;
    }

    public set currentOrganizationId(value: string) {

        // This will emit event when Organization has been changed.
        if (this._prevOrganizationId != value) {
            this.events.publish('app:organizationChanged', value);
        }

        this.localStorage.store(AppConstant.LOCAL_STORAGE_KEY.CURRENT_ORGANIZATION_ID, value);
        this._currentOrganizationId = this._prevOrganizationId = value;
    }

    public get isLoggedIn(): boolean {
        return !ObjectsUtil.isEmptyObject(this._businessUser);
    }

    public get authData(): AuthenticationRequestModel {
        return this._authData;
    }

    public set authData(obj: AuthenticationRequestModel) {
        this._authData = obj;
    }

    public get businessUser(): UserModel {
        return this._businessUser;
    }

    public set businessUser(bizUser: UserModel) {
        this.localStorage.store(AppConstant.LOCAL_STORAGE_KEY.BUSINESS_USER, bizUser && bizUser.__eafmap__);
        this._businessUser = bizUser;
    }

    public get employeeCode(): string {
        return this._employeeCode;
    }

    public set employeeCode(empCode: string) {
        this.localStorage.store(AppConstant.LOCAL_STORAGE_KEY.EMPLOYEE_CODE, empCode);
        this._employeeCode = empCode;
    }

    public get shippingList(): ShippingModel[] {
        return this._shippingList;
    }

    public set shippingList(shippingModel: ShippingModel[]) {
        // console.log(shippingModel);
        this.localStorage.store(AppConstant.LOCAL_STORAGE_KEY.SHIPPING_LIST, shippingModel);
        this._shippingList = shippingModel;
    }

    public userVehicleList: VehicleDataModel[] = [];

    public userSelectedVehicle: VehicleDataModel;

    private _employeeCode: string;
    private _businessUser: UserModel;
    private _shippingList: ShippingModel[] = [];
    private _authData: AuthenticationRequestModel;

    private _prevOrganizationId: string;
    private _currentOrganizationId: string;

    public clearLocalStorage(): void {
        this.localStorage.clear();
        // console.debug('💭 LocalStorage cleared.');
    }

    public clearSessionStorage(): void {
        this.sessionStorage.clear();
        // console.debug('💭 SessionStorage cleared.');
    }

    public clearAllCaches(): void {
        this.clearLocalStorage();
        this.clearSessionStorage();
        sessionStorage.clear();
        localStorage.clear();
    }

}
