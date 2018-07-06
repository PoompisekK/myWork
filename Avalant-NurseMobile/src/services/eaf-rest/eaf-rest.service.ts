import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { Response, RequestOptionsArgs } from '@angular/http';
import { FileUploadOptions, TransferObject, Transfer, FileTransferError } from '@ionic-native/transfer';
import { HttpService, RequestContentType } from '../http-services/http.service';
import { EAFSessionModel } from '../../model/authentication/eaf-session.model';
import { EAFModuleBase } from '../../model/eaf-rest/eaf-module-base';
import { EAFModuleClass } from './eaf-rest.decorators';
import { EAFRestUtil } from './eaf-rest.util';
import { IEAFRestHeader } from '../../model/eaf-rest/eaf-rest-header';
import { EAFRestApi } from '../../constants/eaf-rest-api';
import { EAFRestResponse } from '../../model/eaf-rest/eaf-rest-response.model';
import { RxJSUtil } from '../../utilities/rxjs.util';
import { IEAFModuleModel } from '../../model/eaf-rest/eaf-module-model';
import { EAFRestEntityResponse } from '../../model/eaf-rest/eaf-rest-entity-response.model';
import { EAFModelWithMethod } from '../../model/eaf-rest/eaf-model-with-method.model';
import { ObjectsUtil } from '../../utilities/objects.util';
import { ResponseBaseModel } from '../../model/rest/response-base.model';
import { SessionStorage } from "ngx-Webstorage";
import { DateUtil } from '../../utilities/date.util';
import { AppConstant } from '../../constants/app-constant';
import { StringUtil } from '../../utilities/string.util';
import { Events } from 'ionic-angular';
import { LocalStorageService } from 'ngx-Webstorage';

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
 * @author NorrapatN
 * @since Mon May 29 2017
 */
@Injectable()
export class EAFRestService {

  @SessionStorage()
  private _eafSession: EAFSessionModel;

  @SessionStorage()
  private _clientId: string;

  private pendingSubscriberCallbacks: Function[] = [];

  constructor(
    private httpService: HttpService,
    private transfer: Transfer,
    private events: Events,
    private localStorage: LocalStorageService,
  ) {
  }

  public get eafSession(): EAFSessionModel {
    if (this._eafSession && !(this._eafSession.expireDate instanceof Date)) {
      this._eafSession.expireDate = new Date(this._eafSession.expireDate);
    }
    return this._eafSession;
  }

  private static _cfgSearch = { page: '1', volumePerPage: '300' };
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
      // authorization: 'Bearer ' + session.id_token,
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
      const subscription = this.handshakeWithEAF().debounceTime(300).subscribe(() => this.clearSubscribers());

      return subscription;
    } else {
      return cb();
    }
  }

  /**
   * Did you know Shakehand ? That's it.
   * 
   */
  public handshakeWithEAF(): Observable<EAFSessionModel> {
    // Get or Generate Client ID
    this._clientId = this._clientId || new Date().getTime() + '';
    return this.httpService.httpPost<EAFSessionModel>(EAFRestApi.EAF_URL.AUTHENTICATE, null, {
      ...EAFRestApi.CREDENTIAL,
      clientId: this._clientId,
    }).map((response: any) => {
      let session = ObjectsUtil.instantiate(EAFSessionModel, response);
      session.clientId = this._clientId;

      // Calculate expire date
      session.expireDate = (() => {
        let expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + session.validity * 1000);
        return expireDate;
      })();

      // console.log("session:", session);
      return this._eafSession = session;
    })
      .retryWhen((errors) => {
        // Retry when error occurred.
        return errors.scan((errorCount, error) => {
          if (errorCount > 1) {
            throw error;
          }
          console.debug('⚠️⚠️ Retrying request...');
          return errorCount + 1;
        }, 0).flatMap((retryCount => Observable.timer(1000)));
      })
      .do((session) => {
        // this.notificationService.clientId = session.clientId;
        // this.notificationService.createConnection();
        this.events.publish('eafRest:handshake', session.clientId, session.idToken);
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
        let observable: Observable<any> = this.httpService.httpGetObservable<T[]>(`${EAFRestApi.URL_ENTITY}/${entityId}/search`, parameters,
          this.makeAuthHeader(this.eafSession))
          .map((response: Response) => {
            // console.debug(`Mapping for "${entityId}"`);
            // Evaluate method
            let responseStr = response.text();
            let rawObject: EAFRestResponse = this.extractResponseData(responseStr);
            // console.debug('⚠️⚠️ rawObject.status ===>', rawObject.status);

            // Check if response is failed
            if (rawObject && AppConstant.EAF_RESPONSE_CONST.isFailed(rawObject.status)) {
              // Throw to capture by retryWhen
              console.warn('⚠️ Requestion failed :', rawObject.message);
              throw new Error('Error response : ' + rawObject.message);
            }

            return clazz ? EAFRestUtil.mapResponseList(clazz, rawObject) : rawObject;
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

    let url = `${EAFRestApi.URL_ENTITY}/${entityId}/get`;

    return new Observable<{ [key: string]: IEAFModuleModel[] }>((subscriber) => {
      return this.renewSession(() => {
        let observable: Observable<{ [key: string]: IEAFModuleModel[] }> = this.httpService.httpGetObservable<{ [key: string]: IEAFModuleModel[] }>(url, parameters,
          this.makeAuthHeader(this.eafSession))
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

            return EAFRestUtil.mapResponseMultiClass(rawObject, classes);
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
    let observable = this.httpService.httpPostObservable<ResponseBaseModel>(`${EAFRestApi.URL_ENTITY}/${entityId}/save`, searchParams,
      body, RequestContentType.APPLICATION_JSON, this.makeAuthHeader(this.eafSession))
      .map((response: Response) => {
        // Evaluate method
        let responseStr = response.text();
        let rawObject: EAFRestEntityResponse = this.extractResponseData(responseStr);

        return ObjectsUtil.instantiate(ResponseBaseModel, rawObject);
      })
      .catch(this.handleError);

    return RxJSUtil.makeHot<ResponseBaseModel>(observable);
  }

  public validateSession(): boolean {
    return !(!this.eafSession || !DateUtil.isValidDate(this.eafSession.expireDate)
      || this.eafSession.expireDate.getTime() - new Date().getTime() < 0
      || !this.eafSession.clientId || !this.eafSession.idToken);
  }

  /**
   * Request data to Manual Servlet
   * 
   * @param method HTTP Method eg. get, post
   * @param servletId Servlet ID that listed on "dmp.dmp_servlet"
   * @param clazz (Optional) Class model to map data. Nothing will response any
   * @param options (Optional) Parameters
   */
  public requestManualServlet<T>(method: string, servletId: string, clazz?: { new(): T }, options?: {
    /**
     * Search parameters
     */
    params?: { [key: string]: any },

    /**
     * Body Parameters
     */
    body?: { [key: string]: any },

    /**
     * Authorization method
     */
    authMethod?: ManualServletAuthMethod,
  }): Observable<T> | Observable<any> {
    options = options || { authMethod: ManualServletAuthMethod.WITH_AUTH };
    if (!method) {
      console.error('⛔️️ Method is required !', );
      throw new Error('Method is required !');
    }

    if (!servletId) {
      console.error('⛔️️ Servlet Id is required !');
      throw new Error('Servlet Id is required !');
    }

    // Check authMethod
    if (options.authMethod === void 0) {
      options.authMethod = ManualServletAuthMethod.WITH_AUTH;
    }

    // if (options && options.params) {
    //   let params = options.params;
    //   if (params instanceof String) {
    //     params += '&key=' + servletId;
    //     options.params = params;
    //   } else if (params instanceof URLSearchParams) {
    //     params.set('key', servletId);
    //   } else {
    //     params['key'] = servletId;
    //   }
    // }

    // Set params default
    options.params = options.params || {};
    options.params['key'] = servletId; // Set servlet id
    options.params['cbMethod'] = 'eafCallback'; //Set eafCallback

    // console.debug('⚠️⚠️ Options.params =', options.params);

    const url = options.authMethod === ManualServletAuthMethod.WITH_AUTH ? EAFRestApi.URL_MANUAL_SERVLET : EAFRestApi.URL_MANUAL_SERVLET_UNAUTH;

    if (method.toLowerCase() === 'get') {
      if (options && options.body) {
        console.warn('⚠️ ' + method + ' is not required "body" parameters. It will not be sent.');
      }
      return Observable.create((subscriber: Observer<T[]>) => {
        return this.renewSession(() => {
          let observable: Observable<any> = this.httpService.httpGet(url, options.params, this.makeAuthHeader(this.eafSession))
            .do((data) => {
              // console.log('HTTP Get :', data)
            })
            .map((response) => {
              return clazz != null ? ObjectsUtil.instantiate<T>(clazz, response) : response;
            })
            .catch(this.handleError);

          const requestSubscription = observable.subscribe((response) => {
            subscriber.next(response);
            subscriber.complete();
          }, (error) => {
            subscriber.error(error);
          });

          return this.unsubscribeCallback(requestSubscription);
        });
      });
    } else if (method.toLowerCase() === 'post') {
      return Observable.create((subscriber: Observer<T[]>) => {
        return this.renewSession(() => {
          let observable: Observable<any> = this.httpService.httpPost(url, options.params, options.body, RequestContentType.APPLICATION_JSON, this.makeAuthHeader(this.eafSession))
            .do((data) => {
              // console.log('HTTP Post :', data)
            }) // eyeball results in the console
            .map((response) => {
              return clazz != null ? ObjectsUtil.instantiate<T>(clazz, response) : response;
            })
            .catch(this.handleError);

          const requestSubscription = observable.subscribe((response) => {
            subscriber.next(response);
            subscriber.complete();
          }, (error) => {
            subscriber.error(error);
          });
          return this.unsubscribeCallback(requestSubscription);
        });
      });
    } else {
      console.error('⛔️️ Method ' + method + ' is neither support or implemented yet.!');
      throw new Error('Method is neither support or implemented yet.');
    }
  }
  /**
   * Request data to Manual Observable Servlet
   * 
   * @param method HTTP Method eg. get, post
   * @param servletId Servlet ID that listed on "dmp.dmp_servlet"
   * @param clazz (Optional) Class model to map data. Nothing will response any
   * @param options (Optional) Parameters
   */
  public requestManualObservableServlet<T>(method: string, servletId: string, clazz?: { new(): T | any }, options?: {
    /**
     * Search parameters
     */
    params?: { [key: string]: any },

    /**
     * Body Parameters
     */
    body?: { [key: string]: any },

    /**
     * Authorization method
     */
    authMethod?: ManualServletAuthMethod,
  }): Observable<T> | Observable<any> {
    options = options || { authMethod: ManualServletAuthMethod.WITH_AUTH };
    if (!method) {
      console.error('⛔️️ Method is required !', );
      throw new Error('Method is required !');
    }

    if (!servletId) {
      console.error('⛔️️ Servlet Id is required !');
      throw new Error('Servlet Id is required !');
    }

    // Check authMethod
    if (options.authMethod === void 0) {
      options.authMethod = ManualServletAuthMethod.WITH_AUTH;
    }

    // if (options && options.params) {
    //   let params = options.params;
    //   if (params instanceof String) {
    //     params += '&key=' + servletId;
    //     options.params = params;
    //   } else if (params instanceof URLSearchParams) {
    //     params.set('key', servletId);
    //   } else {
    //     params['key'] = servletId;
    //   }
    // }

    // Set params default
    options.params = options.params || {};
    options.params['key'] = servletId; // Set servlet id
    options.params['cbMethod'] = 'eafCallback'; //Set eafCallback

    // console.debug('⚠️⚠️ Options.params =', options.params);

    const url = options.authMethod === ManualServletAuthMethod.WITH_AUTH ? EAFRestApi.URL_MANUAL_SERVLET : EAFRestApi.URL_MANUAL_SERVLET_UNAUTH;

    if (method.toLowerCase() === 'get') {
      if (options && options.body) {
        console.warn('⚠️ ' + method + ' is not required "body" parameters. It will not be sent.');
      }
      return Observable.create((subscriber: Observer<T[]>) => {
        let _params = options.params;
        return this.renewSession(() => {
          let observable: Observable<T[]> = this.httpService.httpGetObservable(url, options.params, this.makeAuthHeader(this.eafSession))
            .map((response1) => {
              // console.log('map[1] HTTP Get :', response1);
              // Extract version on header
              const cacheVersion: string = response1.headers.get('dmp-servercacheversion');
              const responseJson: { [key: string]: string } = response1.json();

              if (responseJson.status === 'success' && this.getCacheVersion(_params.reqCacheName, _params.language) === cacheVersion) {
                // If existed in cache go on
                let cacheData = this.getCacheData(_params.reqCacheName, _params.language);
                console.info("getDMPManualCache Return [Client Cache] Data !!!!");
                return cacheData;
              } else if (typeof responseJson.status === 'string') {
                console.warn('⚠️ Response from DMPManualCache provider is not success');
                console.warn('  response :', responseJson);
              } else {
                console.debug('Got new DMPManualCache object');
                this.setCacheVersion(_params.reqCacheName, _params.language, cacheVersion);//  this.setLanguageVersion(language, cacheVersion);
              }
              console.info("getDMPManualCache Return [Server Cache] Data !!!!");
              return clazz != null ? ObjectsUtil.instantiate<T>(clazz, responseJson) : responseJson;
            })
            .do((data) => {
              this.setCacheData(_params.reqCacheName, _params.language, data);
            })
            // .map((response2: Response) => {
            //   console.log('map[2] HTTP Get :', response2);
            //   if ((response2 || '').toString().indexOf('eafCallback') > -1) {
            //     response2 = eval(response2.toString());
            //   }
            //   // console.debug(`Mapping for "${entityId}"`);
            //   // Evaluate method
            //   let responseStr = response2.toString();
            //   let rawObject: EAFRestResponse = (this.extractResponseData(responseStr) || {}).DATA;
            //   // console.debug('⚠️⚠️ rawObject.status ===>', rawObject.status);
            //   // Check if response is failed
            //   if (rawObject && AppConstant.EAF_RESPONSE_CONST.isFailed(rawObject.status)) 
            //     // Throw to capture by retryWhen
            //     console.warn('⚠️ Requestion failed :', rawObject.message);
            //     throw new Error('Error response : ' + rawObject.message);
            //   }
            //   return clazz ? EAFRestUtil.mapResponseList(clazz, rawObject) : rawObject;
            // })
            .retryWhen((errors) => {
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

          const requestSubscription = observable.subscribe((response) => {
            subscriber.next(response);
            subscriber.complete();
          }, (error) => {
            subscriber.error(error);
          });

          return this.unsubscribeCallback(requestSubscription);
        });
      });
    } else if (method.toLowerCase() === 'post') {
      return Observable.create((subscriber: Observer<T[]>) => {
        let observable: Observable<any> = this.httpService.httpPost(url, options.params, options.body, RequestContentType.APPLICATION_JSON, this.makeAuthHeader(this.eafSession))
          .do((data) => {
            // console.log('HTTP Post :', data)
          }) // eyeball results in the console
          .map((response) => {
            return clazz != null ? ObjectsUtil.instantiate<T>(clazz, response) : response;
          })
          .catch(this.handleError);

        const requestSubscription = observable.subscribe((response) => {
          subscriber.next(response);
          subscriber.complete();
        }, (error) => {
          subscriber.error(error);
        });

        return this.unsubscribeCallback(requestSubscription);
      });
    } else {
      console.error('⛔️️ Method ' + method + ' is neither support or implemented yet.!');
      throw new Error('Method is neither support or implemented yet.');
    }
  }

  /**
   * Call Manual Servlet by GET method
   * 
   * @param servletId Servlet ID that listed on "dmp.dmp_servlet"
   * @param clazz (Optional) Class model to map data. Nothing will response any
   * @param options (Optional) Parameters
   */
  public getManualServlet<T>(servletId: string, clazz?: { new(): T }, params?: { [key: string]: any }): Observable<T> {
    return this.requestManualServlet('get', servletId, clazz, {
      params
    });
  }

  /**
   * Call Manual Observable Servlet by GET method
   * 
   * @param servletId Servlet ID that listed on "dmp.dmp_servlet"
   * @param clazz (Optional) Class model to map data. Nothing will response any
   * @param options (Optional) Parameters
   */
  public getManualObservableServlet<T>(servletId: string, clazz?: { new(): T }, params?: { [key: string]: any }): Observable<T> {
    return this.requestManualObservableServlet('get', servletId, clazz, {
      params
    });
  }

  /**
   * Call Manual Servlet by POST method
   * 
   * @param servletId Servlet ID that listed on "dmp.dmp_servlet"
   * @param clazz (Optional) Class model to map data. Nothing will response any
   * @param options (Optional) Parameters
   */
  public postManualServlet<T>(servletId: string, clazz?: { new(): T }, options?: {
    /**
     * Search parameters
     */
    params?: { [key: string]: any },

    /**
     * Body Parameters
     */
    body?: { [key: string]: any },
  }): Observable<T> {
    return this.requestManualServlet('post', servletId, clazz, options);
  }

  public refreshMasterCache(): Observable<{}> {
    return Observable.create((observer) => {
      this.renewSession(() => {
        this.httpService.httpGetObservable(EAFRestApi.URL_EAF_REFRESH_CACHE, {}, this.makeAuthHeader(this.eafSession)).subscribe(resp => {
          observer.next(resp);
          observer.complete();
        });
      });
    });
  }

  public refreshManualServletCache(): Observable<{}> {
    return Observable.create((observer) => {
      this.renewSession(() => {
        this.httpService.httpGetObservable(EAFRestApi.URL_EAF_MANUAL_SERVLET_REFRESH_CACHE, {}, this.makeAuthHeader(this.eafSession)).subscribe((resp) => {
          observer.next(resp);
          observer.complete();
        });
      });
    });
  }

  /**
  * Upload file to server and response key to get that data later
  * 
  * @param file File want to upload
  * @deprecated To upload images please use {#uploadFileV2(...)}
  */
  public uploadFile(file: File): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpService.httpPostObservable<any>(EAFRestApi.URL_UPLOAD, {}, formData, RequestContentType.MULTI_PART, this.makeAuthHeader(this.eafSession))
      .map((response) => {
        return response.json();
      });
  }

  /**
   * Upload File V2 (Support only one file per request!)
   * 
   * @param filePath Local file path
   */
  public uploadFileV2(filePath: string): Observable<any> {
    return new Observable<any>((subscriber) => {
      const uploadURL = EAFRestApi.URL_UPLOAD;
      let fileName = filePath.split(/(\\|\/)/g).pop();
      if ((fileName || '').indexOf('?') != -1) {
        fileName = fileName.substr(0, fileName.indexOf('?'));
      }
      const options: FileUploadOptions = {
        fileKey: 'file',
        fileName,
        chunkedMode: false,
        mimeType: 'multipart/form-data',
        params: { 'fileName': fileName },
        headers: this.makeAuthHeader(this.eafSession),
      };
      console.log("options:", options);
      const fileTransfer: TransferObject = this.transfer.create();

      // let loading = this.loadingCtrl.create({
      //   content: 'Uploading...',
      // });
      // loading.present();

      // Use the FileTransfer to upload the image
      fileTransfer.upload(filePath, uploadURL, options).then(data => {
        console.debug('fileTransfer Upload result :', data);
        // loading.dismissAll()
        // this.presentToast('Image succesful uploaded.');
        subscriber.next(JSON.parse(data.response));
      }, (err: FileTransferError) => {
        console.warn('Error uploading file :', err);
        // loading.dismissAll()
        // this.presentToast('Error while uploading file.');
        subscriber.error(err);
      });
    });

  }

  public getCacheData(_cacheName: string, language: string): string | any {
    let cachKey = 'cache-' + language + '_' + _cacheName;
    let value = this.localStorage.retrieve(cachKey);
    return JSON.parse(value);
  }
  public setCacheData(_cacheName: string, language: string, value: string): void {
    let cachKey = 'cache-' + language + '_' + _cacheName;
    console.log("setCacheData store : ", cachKey, ", typeof :" + (typeof value));
    this.localStorage.store(cachKey, JSON.stringify(value));
  }

  public getCacheVersion(_cacheName: string, language: string): string | any {
    let cachKey = language + '_' + _cacheName;
    let value = this.localStorage.retrieve(cachKey) || '0';
    console.log("getCacheVersion store : ", cachKey, value);
    return value;
  }

  public setCacheVersion(_cacheName: string, language: string, value: string): void {
    let cachKey = language + '_' + _cacheName;
    console.log("setCacheVersion store : ", cachKey, value);
    this.localStorage.store(cachKey, value);
  }
}
