import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, URLSearchParams } from '@angular/http';
import * as HttpStatus from 'http-status-codes';
import { Events } from 'ionic-angular';
import { LocalStorageService } from 'ngx-Webstorage';
import { Observable } from 'rxjs/Observable';

import { AppConstant } from '../../constants/app-constant';
import { EAFRestApi } from '../../constants/eaf-rest-api';
import { isDev, isChromeDev } from '../../constants/environment';
import { HCMRestApi } from '../../constants/hcm-rest-api';
import { SCMRestApi } from '../../constants/scm-rest-api';
import { message } from '../../layout-module/components/form-control-base/validate';
import { UserModel } from '../../model/user/user.model';
import { EAFRestService } from '../../services/eaf-rest/eaf-rest.service';
import { EAFRestUtil } from '../../services/eaf-rest/eaf-rest.util';
import { HttpService as RestHttpService } from '../../services/http-services/http.service';
import { ObjectsUtil } from '../../utilities/objects.util';
import { StringUtil } from '../../utilities/string.util';

export enum RequestContentType {
    URL_ENCODED = <any>'application/x-www-form-urlencoded',
    APPLICATION_JSON = <any>'application/json;charset=UTF-8',
    MULTI_PART = <any>'multipart/form-data',
    // APPLICATION_JSON_UTF_8 = <any>'application/json;charset=UTF-8'
}

export class HCMUserAuthModel {
    public scm_username: string;
    public scm_pwd: string;
}

@Injectable()
export class WorkforceHttpService {

    private static readonly HCMRestService: string = HCMRestApi.URL;
    public businessUser: UserModel = new UserModel();
    public HCMUserAuthRespObject: any = null;
    private _hcmUserAuthObj: HCMUserAuthModel = null;

    private _HCMAccessToken: string = null;
    private _HCMAccessClient: string = null;
    public getHCMAccessClientId(): string {
        if (!this._HCMAccessClient) {
            this._HCMAccessClient = new Date().getTime().toString();
        }
        return this._HCMAccessClient;
    }
    constructor(
        private eafService: EAFRestService,
        private http: Http,
        private httpService: RestHttpService,
        private events: Events,
        private localStorage: LocalStorageService,
    ) {

    }

    public get HCMUserAuth(): HCMUserAuthModel {
        let storedHCMObject = this.localStorage.retrieve(AppConstant.LOCAL_STORAGE_KEY.HCM_USER_AUTH);
        return this._hcmUserAuthObj || JSON.parse(storedHCMObject || "{}");
    }

    public set HCMUserAuth(_hcmUserAuth: HCMUserAuthModel) {
        this.localStorage.store(AppConstant.LOCAL_STORAGE_KEY.HCM_USER_AUTH, JSON.stringify(_hcmUserAuth || {}));
        this._hcmUserAuthObj = _hcmUserAuth;
    }

    private _employeeCode: string = null;
    set employeeCode(_empCode: string) {
        this._employeeCode = _empCode;
        this.localStorage.store(AppConstant.LOCAL_STORAGE_KEY.EMPLOYEE_CODE, _empCode);
        isDev() && console.log("%c set employeeCode :" + this._employeeCode, 'background-color:#303E69;color:white');
    }

    get employeeCode(): string {
        let _empCode = this.localStorage.retrieve(AppConstant.LOCAL_STORAGE_KEY.EMPLOYEE_CODE);
        return this._employeeCode || _empCode;
    }

    public set HCMAccessToken(hcmToken: string) {
        this._HCMAccessToken = hcmToken;
    }
    public get HCMAccessToken(): string {
        return this._HCMAccessToken;
    }

    /**
     * handshakeWithHCM_Auth
     * the new auth logic
     * @author Bundit.Ng
     * @since  Mon Apr 30 2018
     */
    public handshakeWithHCM_Auth(): Observable<any> {
        return Observable.create((observer) => {
            // console.log("this._HCMAccessToken :", this._HCMAccessToken);
            if (StringUtil.isEmptyString(this._HCMAccessToken)) {
                if (this.HCMUserAuth == null || StringUtil.isEmptyString(this.HCMUserAuth.scm_username) || StringUtil.isEmptyString(this.HCMUserAuth.scm_pwd)) {
                    const errMsg = "Missing HCM User Auth Data Information !!!";
                    console.error("errCb _hcmUserAuthObj :", this.HCMUserAuth);
                    this.events.publish("NEED_LOGIN");
                } else {
                    const hcmUserAuthModel: HCMLoginParamsPOST = {
                        "username": this.HCMUserAuth.scm_username,
                        "password": this.HCMUserAuth.scm_pwd,
                        "clientId": this.getHCMAccessClientId()
                    };
                    this.getObserveHCM(hcmUserAuthModel).subscribe((resp: any) => {
                        if (!ObjectsUtil.isEmptyObject(resp && resp.token)) {
                            this._HCMAccessToken = resp && resp.token;
                            observer.next(true);
                            observer.complete();
                        } else {
                            this._HCMAccessToken = null;
                            console.warn("RequestAccessToken resp:", resp);
                            observer.error(false);
                            observer.complete();
                        }
                    }, (errMsg) => {
                        this._HCMAccessToken = null;
                        this.handleErrorRequest("RequestAccessToken errMsg:", errMsg, () => {
                            observer.error(false);
                            observer.complete();
                        });
                    });
                }
            } else {
                // console.log("this.HCMAccessToken:", this.HCMAccessToken);
                observer.next(true);
                observer.complete();
            }
        })
            .retryWhen((errors) => {
                console.warn("retryWhen errors:", errors);
                // Retry when error occurred.
                return errors.scan((errorCount, error) => {
                    if (errorCount > 1) {
                        throw error;
                    }
                    console.debug('handshakeWithHCM Retrying request...');
                    return errorCount + 1;
                }, 0).flatMap((retryCount => Observable.timer(1000)));
            });
    }

    public getObserveHCM(hcmUserAuthModel: HCMLoginParamsPOST): Observable<any> {
        // return this.httpService.httpPost<any>(HCMRestApi.URL + "/auth/login",
        return this.httpService.httpPost<any>(HCMRestApi.URL + "/auth/loginAD",
            {},
            hcmUserAuthModel)
            .do((resp) => {
                this.HCMUserAuthRespObject = resp;
                let userModel = new UserModel();
                if (resp && resp.message != null) {
                    if (resp && resp.message == "Need Email Activated") {
                        console.warn('Fail loggin in : ', JSON.stringify(resp, null, 2));
                        userModel.userStatus = SCMRestApi.ERROR_CODES.NEED_EMAIL_ACTIVATED;
                        this.businessUser = userModel;
                    } else {
                        console.warn('Error loggin in : ', JSON.stringify(resp, null, 2));
                        userModel.userStatus = SCMRestApi.ERROR_CODES.INVALID_CREDIENTIAL;
                        this.businessUser = userModel;
                    }
                } else {
                    userModel = Object.assign(new UserModel(), resp.verifyRespData || {});
                    userModel.userStatus = resp.authen ? 'A' : 'N';
                    userModel.orgId = resp.organizationId;
                    this.businessUser = userModel;
                }
            });
    }

    public getRequestHeader(): {} {
        return {
            "HCM-Access": this._HCMAccessToken,
            ...(this.eafService.makeAuthHeader(this.eafService.eafSession))
        };
    }

    public httpJSONPost<T>(url: string, bodyParams: { [key: string]: any }): Observable<T> {
        return this.httpPost(url, bodyParams, null, RequestContentType.APPLICATION_JSON);
    }

    public httpFormDataPost<T>(url: string, bodyParams: { [key: string]: any }): Observable<T> {
        return this.httpPost(url, bodyParams, null, RequestContentType.MULTI_PART);
    }

    public postXMLHttpRequestFileUpload<T>(_fileObject: HCMFileUploadM, _targetUrl: string): Observable<T> {
        return Observable.create((subscriber) => {
            this.handshakeWithHCM_Auth().subscribe(() => {
                try {
                    let formData: any = new FormData();
                    let xmlHttpRequest = new XMLHttpRequest();
                    xmlHttpRequest.open("POST", _targetUrl, true);

                    xmlHttpRequest.setRequestHeader("HCM-Access", this._HCMAccessToken);
                    xmlHttpRequest.setRequestHeader("clientId", this.eafService.eafSession.clientId);
                    xmlHttpRequest.setRequestHeader("authorization", this.eafService.eafSession.idToken || this.eafService.eafSession.id_token);

                    let fileName = _fileObject.fileObject && _fileObject.fileObject.name || '';
                    xmlHttpRequest.setRequestHeader('Content-Disposition', 'form-data; name="file" filename="' + fileName + '"');
                    let fileItem = _fileObject.fileObject;
                    isDev() && console.log("fileObj:", fileItem);
                    formData.append("file", fileItem);
                    formData.append("file", fileItem, fileName);
                    formData.append("organizationId", _fileObject.organizationId);
                    formData.append("type", _fileObject.type);
                    formData.append("employeeCode", _fileObject.employeeCode);

                    if (isDev()) {
                        for (var pair of formData.entries()) {
                            console.log(`FormData :'${pair[0]}'`, pair[1]);
                        }
                    }
                    xmlHttpRequest.onloadend = () => {
                        const respJson = JSON.parse(xmlHttpRequest.response);
                        isDev() && console.log("xmlHttpRequest.onloadend :", respJson.data);
                        subscriber.next(respJson.data);
                    };
                    xmlHttpRequest.send(formData);
                } catch (error) {
                    this.handleErrorRequest("XMLHttpRequest onerror :", error, () => {
                        subscriber.error(error);
                        subscriber.complete();
                    });
                }
            });
        });
    }

    private readonly retryingCount: number = 3;
    private initRetry(): number { return 0 + this.retryingCount; }

    private postBreakeCount: number = this.initRetry();
    private httpPost<T>(url: string, bodyParams?: { [key: string]: any }, searchParams?: string | URLSearchParams, contentType?: RequestContentType): Observable<T> {
        let headers = new Headers({ 'Content-Type': contentType || 'application/json', });
        let options = new RequestOptions({ headers: headers, 'withCredentials': true, search: searchParams, body: bodyParams });
        return Observable.create((observer) => {
            this.handshakeWithHCM_Auth().subscribe(() => {
                this.httpService.httpPost(url,
                    options.params,
                    options.body,
                    RequestContentType.APPLICATION_JSON,
                    this.getRequestHeader()).subscribe(resp => {
                        observer.next(resp);
                        observer.complete();
                    }, (errMsg) => {
                        if (this.postBreakeCount > 0 && errMsg.status === HttpStatus.UNAUTHORIZED) {
                            this.postBreakeCount--;
                            this._HCMAccessToken = null;
                            this.httpGet(url, searchParams).subscribe(resp2 => {
                                this.postBreakeCount = this.initRetry();
                                observer.next(resp2);
                                observer.complete();
                            });
                        } else {
                            this.postBreakeCount = this.initRetry();
                            this.handleErrorRequest("HttpStatus error :", errMsg, () => {
                                observer.error(errMsg);
                                observer.complete();
                            });
                        }
                    });
            }, (errMsg) => {
                this.handleErrorRequest("handshakeWithHCM error :", errMsg, () => {
                    observer.error(errMsg);
                    observer.complete();
                });
            });
        });
    }

    private getBreakeCount = this.initRetry();
    public httpGet<T>(url: string, searchParams: string | URLSearchParams): Observable<T> {
        return Observable.create((observer) => {
            this.handshakeWithHCM_Auth().subscribe(() => {
                this.httpService.httpGet<any>(url, searchParams, this.getRequestHeader()).subscribe(resp => {
                    observer.next(resp);
                    observer.complete();
                }, (errMsg) => {
                    if (this.getBreakeCount > 0 && errMsg.status === HttpStatus.UNAUTHORIZED) {
                        this.getBreakeCount--;
                        this._HCMAccessToken = null;
                        this.httpGet(url, searchParams).subscribe(resp2 => {
                            this.getBreakeCount = this.initRetry();
                            observer.next(resp2);
                            observer.complete();
                        });
                    } else {
                        this.getBreakeCount = this.initRetry();
                        this.handleErrorRequest("HttpStatus error :", errMsg, () => {
                            observer.error(errMsg);
                            observer.complete();
                        });
                    }
                });
            }, (errMsg) => {
                this.handleErrorRequest("handshakeWithHCM error :", errMsg, () => {
                    observer.error(errMsg);
                    observer.complete();
                });
            });
        });
    }

    private handleErrorRequest(message: string, err, cb: () => void, ): void {
        console.error(message || "handleErrorRequest error status:", err.status);
        console.error(message || "handleErrorRequest error text:", err.status && HttpStatus.getStatusText(err.status));
        console.error(message || "handleErrorRequest error message:", err.message);
        cb && cb();
    }

    private DMPManualWorkforceUser(params: any): Observable<any> {
        return this.httpService.httpGet<any>(EAFRestApi.URL_MANUAL_SERVLET,
            { key: 'WorkforceUser', ...params },
            this.eafService.makeAuthHeader(this.eafService.eafSession));
    }

    private DMPManualVerifiedUser(params: any): Observable<any> {
        return this.DMPManualWorkforceUser({ action: "verified", ...params });
    }

    private DMPManualListUser(params: any): Observable<any> {
        return this.DMPManualWorkforceUser({ action: "list-user", ...params });
    }

    public getListUserForVerify(): Observable<UserModel[]> {
        return this.DMPManualListUser({})
            .map((res) => {
                if (res.code == "P") {
                    let userList: UserModel[] = new Array<UserModel>();
                    res.data && res.data.forEach(element => {
                        EAFRestUtil.mapEAFResponseModel;
                        userList.push(EAFRestUtil.mapEAFResponseModel(UserModel, element));
                    });
                    return userList;
                } else {
                    throw res.message;
                }
            });
    }

    public getVerifiedWorkforceUser(userProfile: UserModel): Observable<any> {
        return this.DMPManualVerifiedUser({
            bizzUserId: userProfile.id,
            employeeCode: userProfile.employeeCode
        }).map((res) => {
            if (res.code == "P") {
                return res.data;
            } else {
                throw res.message;
            }
        });

    }
}

export class HCMLoginParamsPOST {
    public "username": string;
    public "password": string;
    public "clientId": string;
}

export module HCMFileUploaType {
    export const ASSIGNMENT: string = "assignment";
    export const LEAVE: string = "leave";
}

export class HCMFileUploadM {
    public employeeCode: string;
    public fileObject: any;
    public organizationId: string;
    public type: string;
}