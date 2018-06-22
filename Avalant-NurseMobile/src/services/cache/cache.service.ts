/**
 * Cache Service
 */
/**
 * @author Bundit.Ng
 * @since  Mon Jun 5 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { EAFRestService } from '../eaf-rest/eaf-rest.service';
import { EAFModuleClass } from '../eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../../model/eaf-rest/eaf-module-base';
import { AppState } from '../../app/app.state';
import { LocalStorageService } from 'ngx-Webstorage';
import { CacheConstant } from '../../constants/cache';
import { TitleNameMasterModel } from '../../model/master-data/title-name.master.model';
import { ObjectsUtil } from '../../utilities/objects.util';
import { DialCodeCountryCachModel } from '../../model/cache/dial-code-country.cache.model';
import { HttpService } from '../http-services/http.service';
import { AppConstant } from '../../constants/app-constant';
import { EAFRestUtil } from '../eaf-rest/eaf-rest.util';

/**
 * Type of Cache map
 * 
 * used to store masters data
 */
export type CacheMap = { [key: string]: any };

@Injectable()
export class AvaCacheService {

  private storedCaches: CacheMap;
  // private language: string = this.appState.language ||'TH';
  private cfgParam = {
    page: '1',
    volumePerPage: '300'
  };

  constructor(
    private appState: AppState,
    private eafRestService: EAFRestService,
    private localStorage: LocalStorageService,

  ) {
    this.storedCaches = this.loadStoredCaches();
    // console.debug('💭 Stored Caches :', this.storedCaches);
  }

  /**
   * (Re)Load Stored caches from LocalStorage
   */
  public loadStoredCaches(): CacheMap {
    let storedCaches: Object = this.localStorage.retrieve(AppConstant.LOCAL_STORAGE_KEY.STORED_CACHES);
    let cacheMap: CacheMap = {};
    if (storedCaches && storedCaches instanceof Object) {
      for (let key in storedCaches) {
        cacheMap[key] = storedCaches[key];
      }
    }
    console.info('😺 Caches loaded.');
    return cacheMap;
  }

  /**
   * Save Caches into LocalStorage
   */
  public saveCaches(): void {
    this.localStorage.store(AppConstant.LOCAL_STORAGE_KEY.STORED_CACHES, this.storedCaches);
    // console.debug('💭 Caches saved');
  }

  public clearCaches(): void {
    this.localStorage.clear(AppConstant.LOCAL_STORAGE_KEY.STORED_CACHES);
  }

  public getCacheMaster<T extends EAFModuleBase>(cacheName: string, masterModel: EAFModuleClass<T>, searchCriteria?: { [key: string]: any }, language: string = this.appState.language): Observable<T[]> {

    /* this.storedCaches = this.loadStoredCaches();
    cacheName = language + '-' + cacheName;
    if (searchCriteria) {
      cacheName = cacheName + '-' + JSON.stringify(searchCriteria);
    }
    console.info("getCacheMaster cacheName:", cacheName);
    return Observable.create((observer: Observer<any>) => {

      let cache: any = this.storedCaches[cacheName];

      if (cache) {
        // NorrapatN: We need to clone this object before it used.
        observer.next(ObjectsUtil.deepClone(cache));
        observer.complete();
      } else {
        this.eafRestService.searchEntity(masterModel, masterModel['ENTITY_ID'] || masterModel['ENTITY'], {
          ...searchCriteria,
          LANGUAGE: language,
        }, this.cfgParam).subscribe((respCache) => {
          this.storedCaches[cacheName] = respCache;
          this.saveCaches();
          observer.next(respCache);
        }, (error) => {
          console.warn(`Error while loading cache from "${cacheName}" :`, error);
          observer.next(null);
        }).add(() => {
          observer.complete();
        });
      }
      // observer.complete();
    }); */

    let params: any = {
      reqCacheName: cacheName,
      ENTITY_ID: masterModel['ENTITY_ID'] || masterModel['ENTITY'],
    };
    return Observable.create((observer: Observer<any>) => {
      this.getDMPManualCache("DMPMobileCache", params).subscribe((respCache) => {

        let responseStr: string = (respCache || '').toString();
        let rawObject: any = this.extractResponseData(responseStr);
        // console.debug('💭 rawObject.status ===>', rawObject.status);
        // Check if response is failed
        if (rawObject && AppConstant.EAF_RESPONSE_CONST.isFailed(rawObject.status)) {
          // Throw to capture by retryWhen
          console.warn('⚠️ Requestion failed :', rawObject.message);
          throw new Error('Error response : ' + rawObject.message);
        }
        respCache = masterModel ? EAFRestUtil.mapResponseList(masterModel, rawObject) : rawObject;

        observer.next(respCache);
      }, (error) => {
        console.warn(`Error while loading DMPMobileCache from "${cacheName}" :`, error);
        observer.next(null);
      }).add(() => {
        observer.complete();
      });
    });
  }

  private extractResponseData(jsonpStr: string) {
    return new Function('return ' + jsonpStr)();
  }

  public getDMPManualCache<T>(servletKeyName: string, searchCriteria?: { [key: string]: any }, language: string = this.appState.language): Observable<T[]> {
    if(!searchCriteria){
      searchCriteria = {};
    }
    searchCriteria.orgID = this.appState.currentOrganizationId;
    searchCriteria.cacheVersion = this.eafRestService.getCacheVersion(searchCriteria.reqCacheName, language);
    searchCriteria.cacheFlag = AppConstant.FLAG.YES;
    // console.log("getDMPManualCache searchCriteria :", toRaw(searchCriteria));
    return Observable.create((observer: Observer<any>) => {
      this.eafRestService.getManualObservableServlet(servletKeyName, null, {
        language: language,
        ...searchCriteria,
        ...this.cfgParam
      })
        .subscribe((respCache) => {
          // console.log("respCache:", respCache);
          observer.next(respCache);
        }, (error) => {
          console.warn(`Error while loading manual as cache from "${servletKeyName}" :`, error);
          observer.next(null);
        }).add(() => {
          observer.complete();
        });
    });
  }

  /*
  public getManualCacheMaster<T>(servletKeyName: string, searchCriteria?: { [key: string]: any }, language: string = this.appState.language): Observable<T[]> {
    let cacheServletKeyName = language + '-' + servletKeyName;
    if (searchCriteria) {
      cacheServletKeyName = servletKeyName + '-' + JSON.stringify(searchCriteria);
    }
    console.info("getCacheMaster cacheName:", cacheServletKeyName);
    return Observable.create((observer: Observer<any>) => {
      let cache: any = this.storedCaches[cacheServletKeyName];
      if (cache) {
        observer.next(ObjectsUtil.deepClone(cache));
        observer.complete();
      } else {
        this.eafRestService.postManualServlet(servletKeyName, null, {
          params: {
            language: language,
            ...searchCriteria
          }
        }).subscribe((respCache) => {
          this.storedCaches[cacheServletKeyName] = respCache;
          this.saveCaches();
          observer.next(respCache);
        }, (error) => {
          console.warn(`Error while loading manual as cache from "${servletKeyName}" :`, error);
          observer.next(null);
        }).add(() => {
          observer.complete();
        });
      }
    });
  } 
  */
 
  public loadAllCache(): void {

  }

  public refreshEAFCaches(): Observable<{}> {
    return this.eafRestService.refreshMasterCache();
  }

  public refreshEAFManualServletCaches(): Observable<{}> {
    return this.eafRestService.refreshManualServletCache();
  }

  public getTitleMaster(customerType: string, organizationId?: string): Observable<TitleNameMasterModel[]> {
    // console.debug('💭 Getting title master data with Customer type :', customerType);
    // return this.getCacheMaster<TitleNameMasterModel>(CacheConstant.MS_TITLE, TitleNameMasterModel, {
    return this.getCacheMaster<TitleNameMasterModel>(CacheConstant.MS_TITLE, TitleNameMasterModel, {
      OWNER_TYPE: customerType,
      ORG_ID: organizationId || this.appState.currentOrganizationId,
    });
  }

  public gettDialCodeCountry(): Observable<any[]> {
    // return this.getManualCacheMaster("getDialCodeCountry");
    return this.getDMPManualCache("getDialCodeCountry");
  }

}

// NorrapatN: Cache constant moved to /src/constants/cache.ts