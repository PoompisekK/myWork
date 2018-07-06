import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Transfer } from '@ionic-native/transfer';
import { Events } from 'ionic-angular';
import { LocalStorageService, SessionStorage } from 'ngx-Webstorage';
import { Observable, Subscription } from 'rxjs';

import { AppConstant } from '../../constants/app-constant';
import { HCMRestApi } from '../../constants/hcm-rest-api';
import { EAFSessionModel } from '../../model/authentication/eaf-session.model';
import { EAFModelWithMethod } from '../../model/eaf-rest/eaf-model-with-method.model';
import { EAFModuleBase } from '../../model/eaf-rest/eaf-module-base';
import { IEAFModuleModel } from '../../model/eaf-rest/eaf-module-model';
import { EAFRestEntityResponse } from '../../model/eaf-rest/eaf-rest-entity-response.model';
import { IEAFRestHeader } from '../../model/eaf-rest/eaf-rest-header';
import { EAFRestResponse } from '../../model/eaf-rest/eaf-rest-response.model';
import { ResponseBaseModel } from '../../model/rest/response-base.model';
import { DateUtil } from '../../utilities/date.util';
import { ObjectsUtil } from '../../utilities/objects.util';
import { RxJSUtil } from '../../utilities/rxjs.util';
import { StringUtil } from '../../utilities/string.util';
import { WorkforceHttpService } from '../../workforce/service/workforceHttpService';
import { HttpService, RequestContentType } from '../http-services/http.service';
import { EAFModuleClass } from './eaf-rest.decorators';
import { EAFRestUtil } from './eaf-rest.util';
import { AppState } from '../../app/app.state';
import { EAFContext } from '../../eaf/eaf-context';

/**
 * NorrapatN : Evaluate can use only Global scope. I don't know how to use local scope.
 */
window.eafCallback = (data: any): any => {
    // console.debug('Got data :', data);
    return data;
};

export enum ManualServletAuthMethod {
    /**
     * This No Auth will change to DMPManualServletUnAuth  only !.
     */
    NO_AUTH,

    /**
     * This will use DMPManualServlet.
     */
    WITH_AUTH,
}

/**
 * EAF Rest Service. (OneWEB)
 * 
 * @author Bundit.Ng
 * @since  Tue Jun 19 2018
 * Copyright (c) 2018 Avalant Co.,Ltd.
 */

@Injectable()
export class HCMEAFRestService {
    private cfg = { page: '1', volumePerPage: '200' };

    @SessionStorage()
    private _hcmEAFSession: EAFSessionModel;

    @SessionStorage()
    private _clientId: string;

    private pendingSubscriberCallbacks: Function[] = [];

    constructor(
        private httpService: HttpService,
        private transfer: Transfer,
        private events: Events,
        private appState: AppState,
        private wfHttpService: WorkforceHttpService,
        private localStorage: LocalStorageService,
    ) {
    }

    public get hcmEAFSession(): EAFSessionModel {
        if (this._hcmEAFSession && !(this._hcmEAFSession.expireDate instanceof Date)) {
            this._hcmEAFSession.expireDate = new Date(this._hcmEAFSession.expireDate);
        }
        return this._hcmEAFSession;
    }

    private static _cfgSearch = { page: '1', volumePerPage: '200' };
    public static get cfgSearch() {
        return this._cfgSearch;
    }

    protected handleError(error: Response) {
        console.warn(error);
        return Observable.throw(error);
    }

    public makeAuthHeader(session: EAFSessionModel): { [key: string]: any } {
        if (!session) {
            console.warn("⚠️⚠️ Can't make auth header of ", session);
            return null;
        }

        return {
            clientId: session.clientId,
            authorization: session.idToken || session.id_token,
        };
    }

    /**
     * Extract data from response string in JSONP formatted
     * 
     * NOTE : Use new Function('...') instead of eval('...'). A better way to evaluation.
     * 
     * @param jsonpStr Response in JSONP formatted
     */
    private extractResponseData(jsonpStr: string) {
        return new Function('return ' + jsonpStr)();
    }

    public static getInsertUpdateByPrimaryKey(key: string): 'INSERT' | 'UPDATE' {
        return StringUtil.isEmptyString(key) ? 'INSERT' : 'UPDATE';
    }

    public renewSession(cb: () => any): any {
        // console.debug('⚠️⚠️ Checking is a session invalidated ?...');
        if (!this.validateSession()) {
            if (!this.pendingSubscriberCallbacks) {
                this.pendingSubscriberCallbacks = [];
            }
            console.debug('⚠️⚠️ Invalidated session - Renewing session by handshake...');
            this.pendingSubscriberCallbacks.push(cb);
            const subscription = this.handshakeWithEAF_HCM().debounceTime(300).subscribe(() => this.clearSubscribers());

            return subscription;
        } else {
            return cb();
        }
    }

    public handshakeWithEAF_HCM(): Observable<any> {
        return this.wfHttpService.handshakeWithHCM_Auth()
            .do((respStatus) => {
                if (respStatus) {
                    const HCMUserAuth = this.wfHttpService.HCMUserAuthRespObject;
                    this._hcmEAFSession = new EAFSessionModel;
                    this._hcmEAFSession.id_token = HCMUserAuth.eafRestToken;
                    this._hcmEAFSession.clientId = this.wfHttpService.getHCMAccessClientId();
                }
            });
    }

    private clearSubscribers(): void {
        while (this.pendingSubscriberCallbacks.length) {
            let cb = this.pendingSubscriberCallbacks.shift();
            typeof cb === 'function' && cb();
        }
    }

    private unsubscribeCallback(requestSubscription: Subscription): () => void {
        return () => {
            // console.debug('Unsubscribe called, Cancelling request...');
            requestSubscription.unsubscribe();
        };
    }

    /**
     * Search entity 
     * 
     * Getting data by criteria as parameters with specified Entity ID
     * 
     * @param clazz Class to map response from search entity. *Requried class that extended from EAFModuleBase
     * @param entityId Entity ID that related
     * @param parameters Search parameters as Map
     * @param eafSearchOptions EAF Search options  @see IEAFRestHeader
     */
    public searchEntity<T extends EAFModuleBase>(clazz: EAFModuleClass<T>, entityId: string, parameters?: { [key: string]: any }, eafSearchOptions?: IEAFRestHeader): Observable<T[]> {

        // ES6 Merge object
        parameters = {
            ...parameters,
            ...EAFRestUtil.safeSearchOption(eafSearchOptions)
        };

        return new Observable<T[]>((subscriber) => {
            return this.renewSession(() => {
                let observable: Observable<any> = this.httpService.httpGetObservable<T[]>(`${HCMRestApi.URL_ENTITY}/${entityId}/search`, parameters,
                    this.makeAuthHeader(this.hcmEAFSession))
                    .map((response: Response) => {
                        // console.debug(`Mapping for "${entityId}"`);
                        // Evaluate method
                        let responseStr = response.text();
                        let rawObject: EAFRestResponse = this.extractResponseData(responseStr);
                        // Check if response is failed
                        if (rawObject && AppConstant.EAF_RESPONSE_CONST.isFailed(rawObject.status)) {
                            // Throw to capture by retryWhen
                            console.warn('⚠️ Requestion failed :', rawObject.message);
                            throw new Error('Error response : ' + rawObject.message);
                        }
                        let result = clazz ? EAFRestUtil.mapResponseList(clazz, rawObject) : rawObject;
                        console.log("result:", result);
                        return result;
                    }).retryWhen((errors) => {
                        // Retry when error occurred.
                        return errors.scan((errorCount, error) => {
                            if (errorCount > 1) {
                                throw error;
                            }
                            console.debug('⚠️⚠️ Retrying request...');
                            return errorCount + 1;
                        }, 0).flatMap((retryCount => Observable.timer(1000)));
                    })
                    .catch(this.handleError);

                const requestSubscription = observable.subscribe((response: any) => {
                    subscriber.next(response);
                    subscriber.complete();
                }, (error) => {
                    subscriber.error(error);
                });

                return this.unsubscribeCallback(requestSubscription);
            });
        });
    }

    /**
       * Get Entity
       * 
       * Getting data by ID or something with parameters with specified Entity ID
       * 
       * @param entityId Entity ID that related
       * @param moduleId Module ID that mapping
       * @param classes List<Module ID,Class> of class to map response from search entity.
       * @param parameters Search parameters as Map
       * @param eafSearchOptions EAF Search options  @see IEAFRestHeader
       */
    private getEntitiesMapByModules<T extends EAFModuleBase>(entityId: string, moduleId: string, classes: { [eafModuleId: string]: EAFModuleClass<IEAFModuleModel> }[],
        parameters?: { [key: string]: any }, eafSearchOptions?: IEAFRestHeader): Observable<{ [eafModuleId: string]: IEAFModuleModel[] }> {

        // Add warning
        if (!parameters) {
            console.warn(`Getting Entity may require to passed search parameters to get a success result.`);
        }

        // ES6 Merge object
        parameters = {
            ...parameters,
            ...EAFRestUtil.safeSearchOption(eafSearchOptions)
        };

        let url = `${HCMRestApi.URL_ENTITY}/${entityId}/get`;
        if (moduleId) {
            url = `${HCMRestApi.URL_ENTITY}/${entityId}/module/${moduleId}/get`;
        }

        return new Observable<{ [key: string]: IEAFModuleModel[] }>((subscriber) => {
            return this.renewSession(() => {
                let observable: Observable<{ [key: string]: IEAFModuleModel[] }> = this.httpService.httpGetObservable<{ [key: string]: IEAFModuleModel[] }>(url, parameters,
                    this.makeAuthHeader(this.hcmEAFSession))
                    .map((response: Response) => {
                        // Evaluate method
                        let responseStr = response.text();
                        let rawObject: EAFRestEntityResponse = this.extractResponseData(responseStr);
                        // Check if response is failed
                        if (rawObject && AppConstant.EAF_RESPONSE_CONST.isFailed(rawObject.status)) {
                            // Throw to capture by retryWhen
                            console.warn('⚠️ Requestion failed :', rawObject.message);
                            throw new Error('Error response : ' + rawObject.message);
                        }
                        console.warn('rawObject :', rawObject);
                        let mapResponse = EAFRestUtil.mapResponseMultiClazz(moduleId, rawObject, null);
                        console.log("mapResponse: ", mapResponse);
                        return mapResponse;
                    }).retryWhen((errors) => {
                        // Retry when error occurred.
                        return errors.scan((errorCount, error) => {
                            if (errorCount > 1) {
                                throw error;
                            }
                            console.debug('⚠️⚠️ Retrying request...');
                            return errorCount + 1;
                        }, 0).flatMap((retryCount => Observable.timer(1000)));
                    })
                    .catch(this.handleError);

                const requestSubscription = observable.subscribe((response: any) => {
                    subscriber.next(response);
                    subscriber.complete();
                }, (error) => {
                    subscriber.error(error);
                });

                return this.unsubscribeCallback(requestSubscription);
            });
        });
    }

    /**
     * Get Entity
     * 
     * Getting data by ID or something with parameters with specified Entity ID
     * 
     * @param entityId Entity ID that related
     * @param classes List<Module ID,Class> of class to map response from search entity.
     * @param parameters Search parameters as Map
     * @param eafSearchOptions EAF Search options  @see IEAFRestHeader
     */
    public getEntityMapByModules<T extends EAFModuleBase>(entityId: string, classes: { [eafModuleId: string]: EAFModuleClass<IEAFModuleModel> },
        parameters?: { [key: string]: any }, eafSearchOptions?: IEAFRestHeader): Observable<{ [eafModuleId: string]: IEAFModuleModel[] }> {

        // Add warning
        if (!parameters) {
            console.warn(`Getting Entity may require to passed search parameters to get a success result.`);
        }

        // ES6 Merge object
        parameters = {
            ...parameters,
            ...EAFRestUtil.safeSearchOption(eafSearchOptions)
        };

        let url = `${HCMRestApi.URL_ENTITY}/${entityId}/get`;

        return new Observable<{ [key: string]: IEAFModuleModel[] }>((subscriber) => {
            return this.renewSession(() => {
                let observable: Observable<{ [key: string]: IEAFModuleModel[] }> = this.httpService.httpGetObservable<{ [key: string]: IEAFModuleModel[] }>(url, parameters,
                    this.makeAuthHeader(this.hcmEAFSession))
                    .map((response: Response) => {
                        // Evaluate method
                        let responseStr = response.text();
                        let rawObject: EAFRestEntityResponse = this.extractResponseData(responseStr);
                        // Check if response is failed
                        if (rawObject && AppConstant.EAF_RESPONSE_CONST.isFailed(rawObject.status)) {
                            // Throw to capture by retryWhen
                            console.warn('⚠️ Requestion failed :', rawObject.message);
                            throw new Error('Error response : ' + rawObject.message);
                        }
                        let mapResponse = EAFRestUtil.mapResponseMultiClass(rawObject, classes);
                        return mapResponse;
                    }).retryWhen((errors) => {
                        // Retry when error occurred.
                        return errors.scan((errorCount, error) => {
                            if (errorCount > 1) {
                                throw error;
                            }
                            console.debug('⚠️⚠️ Retrying request...');
                            return errorCount + 1;
                        }, 0).flatMap((retryCount => Observable.timer(1000)));
                    })
                    .catch(this.handleError);

                const requestSubscription = observable.subscribe((response: any) => {
                    subscriber.next(response);
                    subscriber.complete();
                }, (error) => {
                    subscriber.error(error);
                });

                return this.unsubscribeCallback(requestSubscription);
            });
        });
    }

    public getEntities<T extends EAFModuleBase>(entityId: string, clazz: EAFModuleClass<T>[],
        parameters?: { [key: string]: any }, eafSearchOptions?: IEAFRestHeader): Observable<any> {
        return this.getEntitiesMapByModules(entityId, null, null, parameters, eafSearchOptions);
    }

    private getEntitiesModule<T extends EAFModuleBase>(entityId: string, moduleId: string, clazz: EAFModuleClass<T>[],
        parameters?: { [key: string]: any }, eafSearchOptions?: IEAFRestHeader): Observable<any> {
        return this.getEntitiesMapByModules(entityId, moduleId, null, parameters, eafSearchOptions);
    }

    public getEntity<T extends EAFModuleBase>(entityId: string, clazz: EAFModuleClass<T>,
        parameters?: { [key: string]: any }, eafSearchOptions?: IEAFRestHeader): Observable<T> {
        return this.getEntityMapByModules(entityId, null, parameters, eafSearchOptions)
            .map((moduleMap) => {
                return EAFRestUtil.mapResponseModules<T>(moduleMap, clazz);
            });
    }

    /**
     * Save Entity
     * 
     * Saving data model. It can be save multiple data models by passed List of model with save method
     * 
     * @param entityId Entity ID
     * @param modelList List of model with save method
     * @param searchParams Parameters
     * @param eafOptions (Optional) EAF Options @see IEAFRestHeader
     */
    public saveEntity<T extends EAFModuleBase>(entityId: string, modelList: EAFModelWithMethod[],
        searchParams: { [key: string]: any }, eafOptions?: IEAFRestHeader) {
        // http://192.168.11.251:8080/eaf-rest/entity/EN_170428154750387_v001/save?handleForm=Y&CART_ID=2

        if (!searchParams) {
            console.warn(`Saving Entity may require to passed parameters to get a success result.`);
        }

        searchParams = {
            ...searchParams,
            ...EAFRestUtil.safeSaveOption(eafOptions)
        };

        let body = StringUtil.valueToString(EAFRestUtil.buildEAFRequestModel(modelList));
        let observable = this.httpService.httpPostObservable<ResponseBaseModel>(`${HCMRestApi.URL_ENTITY}/${entityId}/save`, searchParams,
            body, RequestContentType.APPLICATION_JSON, this.makeAuthHeader(this.hcmEAFSession))
            .map((response: Response) => {
                // Evaluate method
                let responseStr = response.text();
                let rawObject: EAFRestEntityResponse = this.extractResponseData(responseStr);

                return ObjectsUtil.instantiate(ResponseBaseModel, rawObject);
            })
            .catch(this.handleError);

        return RxJSUtil.makeHot<ResponseBaseModel>(observable);
    }
    //----------------------------------- Make Service -------------------------------------------------
    public saveEntityShift<T extends EAFModuleBase>(entityId: string, modelList: EAFModelWithMethod[],
        searchParams: { [key: string]: any }, eafOptions?: IEAFRestHeader) {
        // http://192.168.11.251:8080/eaf-rest/entity/EN_170428154750387_v001/save?handleForm=Y&CART_ID=2

        if (!searchParams) {
            console.warn(`Saving Entity may require to passed parameters to get a success result.`);
        }

        searchParams = {
            ...searchParams,
            ...EAFRestUtil.safeSaveOption(eafOptions)
        };

        let modelTest = {
            MD1181113885: [
                {
                    INSERT: modelList
                }
            ]
        };
        console.log('modelTest : ',modelTest);
        let body = modelTest;
        let observable = this.httpService.httpPostObservable<ResponseBaseModel>(`${HCMRestApi.URL_ENTITY}/${entityId}/save`, searchParams,
            body, RequestContentType.APPLICATION_JSON, this.makeAuthHeader(this.hcmEAFSession))
            .map((response: Response) => {
                // Evaluate method
                let responseStr = response.text();
                let rawObject: EAFRestEntityResponse = this.extractResponseData(responseStr);

                return ObjectsUtil.instantiate(ResponseBaseModel, rawObject);
            })
            .catch(this.handleError);

        return RxJSUtil.makeHot<ResponseBaseModel>(observable);
    }
    public saveEntityShiftSwap<T extends EAFModuleBase>(entityId: string, modelList: EAFModelWithMethod[],
        searchParams: { [key: string]: any }, eafOptions?: IEAFRestHeader) {
        // http://192.168.11.251:8080/eaf-rest/entity/EN_170428154750387_v001/save?handleForm=Y&CART_ID=2

        if (!searchParams) {
            console.warn(`Saving Entity may require to passed parameters to get a success result.`);
        }

        searchParams = {
            ...searchParams,
            ...EAFRestUtil.safeSaveOption(eafOptions)
        };

        let modelTest = {
            MD118184232: [
                {
                    INSERT: modelList
                }
            ]
        };
        console.log('modelTest : ',modelTest);
        let body = modelTest;
        let observable = this.httpService.httpPostObservable<ResponseBaseModel>(`${HCMRestApi.URL_ENTITY}/${entityId}/save`, searchParams,
            body, RequestContentType.APPLICATION_JSON, this.makeAuthHeader(this.hcmEAFSession))
            .map((response: Response) => {
                // Evaluate method
                let responseStr = response.text();
                let rawObject: EAFRestEntityResponse = this.extractResponseData(responseStr);

                return ObjectsUtil.instantiate(ResponseBaseModel, rawObject);
            })
            .catch(this.handleError);

        return RxJSUtil.makeHot<ResponseBaseModel>(observable);
    }
    public saveEntityApprove<T extends EAFModuleBase>(entityId: string, modelList: EAFModelWithMethod[],
        searchParams: { [key: string]: any }, eafOptions?: IEAFRestHeader) {
        // http://192.168.11.251:8080/eaf-rest/entity/EN_170428154750387_v001/save?handleForm=Y&CART_ID=2

        if (!searchParams) {
            console.warn(`Saving Entity may require to passed parameters to get a success result.`);
        }

        searchParams = {
            ...searchParams,
            ...EAFRestUtil.safeSaveOption(eafOptions)
        };
        
        let modelTest =  {
            MD1181454401: [{
                UPDATE: {
                    EMPLOYEE_SWAP_TRANSACTION: modelList
                }
            }]
        };
        console.log('modelTest : ',modelTest);
        let body = modelTest;
        let observable = this.httpService.httpPostObservable<ResponseBaseModel>(`${HCMRestApi.URL_ENTITY}/${entityId}/save`, searchParams,
            body, RequestContentType.APPLICATION_JSON, this.makeAuthHeader(this.hcmEAFSession))
            .map((response: Response) => {
                // Evaluate method
                let responseStr = response.text();
                let rawObject: EAFRestEntityResponse = this.extractResponseData(responseStr);

                return ObjectsUtil.instantiate(ResponseBaseModel, rawObject);
            })
            .catch(this.handleError);

        return RxJSUtil.makeHot<ResponseBaseModel>(observable);
    }    
    //-------------------------------------------------------------------------------------------------------------
    public validateSession(): boolean {
        return !(!this.hcmEAFSession || !DateUtil.isValidDate(this.hcmEAFSession.expireDate)
            || this.hcmEAFSession.expireDate.getTime() - new Date().getTime() < 0
            || !this.hcmEAFSession.clientId || !this.hcmEAFSession.idToken);
    }

    public getDataByHCMClassMapping<T extends EAFModuleBase>(userObject: any, clazz: EAFModuleClass<T>): any | { [key: string]: any } {
        let respObj = userObject && userObject[this.toAttributeClassKey(this.getEAFClassName(clazz))];
        if ("object".equals(typeof respObj) && respObj instanceof Array && (respObj && respObj.length == 1)) {
            return respObj[0];
        } else {
            return respObj;
        }
    }

    public getEAFClassName<T extends EAFModuleBase>(clazz: EAFModuleClass<T>): string {
        return clazz && clazz.name;
    }

    public toAttributeClassKey(attrKeys): string {
        return this.toCamelCase(attrKeys.replace("Model", ""));
    }

    public toCamelCase(str): string {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    };

    public getModule<T extends EAFModuleBase>(mappingEAFClass: EAFModuleClass<T>, optParams?: { [key: string]: any }) {
        return this.getEntitiesModule(mappingEAFClass["ENTITY_ID"], mappingEAFClass["MODULE_ID"], [mappingEAFClass], {
            ...(optParams || {}),
            EMPLOYEE_CODE: this.appState.businessUser && this.appState.businessUser.employeeCode,
            ORGANIZE_ID: this.appState.currentOrganizationId,
        }, this.cfg)
            .map(resp => {
                console.log("resp:", resp);
                let resObj: any = {};
                Object.keys(resp).forEach((moduleId => {
                    let eafModuleClass: any = (EAFContext.findEAFModuleClass(moduleId) || {});
                    let attrKeys: string = this.getEAFClassName(eafModuleClass);
                    if (attrKeys) {
                        attrKeys = this.toAttributeClassKey(attrKeys);
                        resObj[attrKeys] = resp[moduleId];
                    }
                }));
                return resObj;
            })
            .map((unMapResObj) => this.getDataByHCMClassMapping(unMapResObj, mappingEAFClass));
    }
}
