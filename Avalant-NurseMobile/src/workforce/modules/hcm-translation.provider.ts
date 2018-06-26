import { Injectable } from '@angular/core';
import { TranslationProvider } from 'angular-l10n';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-Webstorage';
import { Observable } from 'rxjs';

import { AppState } from '../../app/app.state';
import { AppConstant } from '../../constants/app-constant';
import { isChromeDev } from '../../constants/environment';
import { HttpService } from '../../services/http-services/http.service';

const HCMCONST: string = "HCM";
/**
 * @author Bundit.Ng
 * @since  Mon Jun 18 2018
 * Copyright (c) 2018 Avalant Co.,Ltd.
 */
@Injectable()
export class HCMTranslationProvider implements TranslationProvider {

    private static HCM_CACHE_KEY: string = HCMCONST + AppConstant.LOCAL_STORAGE_KEY.UEARN_LANGUAGE_VERSION_KEY;

    private getLanguageVersion(language: string): string {
        return this.localStorage.retrieve(HCMTranslationProvider.HCM_CACHE_KEY + language) || '0';
    }

    private setLanguageVersion(language: string, value: string): void {
        this.localStorage.store(HCMTranslationProvider.HCM_CACHE_KEY + language, value);
    }

    constructor(
        private appState: AppState,
        private http: HttpService,
        private localStorage: LocalStorageService,
    ) { }

    public getTranslation(language: string, args: any): Observable<any> {
        return this.getHCMTranslation(language, args);
    }

    private getHCMTranslation(language: string, args: any): Observable<any> {
        // For using Manual servlet these arguments will come from Localization service.
        let url: string = '';
        isChromeDev() && console.log("getTranslation args :", args);
        const reqTime = "t=" + moment().format("YYYYMMDDHHmmss.SSS");
        switch (args.type) {
            case "WebAPI":
                url += args.path + language + "?" + reqTime;
                break;
            default:
                url += args.prefix + language + "." + args.dataFormat + "?" + reqTime;
        }

        const CACHE_KEYS: string = HCMCONST + AppConstant.LOCAL_STORAGE_KEY.CACHE_LANGUAGE + language;

        return this.http.httpGetObservable(url, {
            organizationId: 0,
            // cacheVersion: this.getLanguageVersion(language),
        })
            .map((response) => {
                return response.json().data;
            })
            .do((data) => {
                this.localStorage.store(CACHE_KEYS, data);
            })
            .catch((error) => {
                return Observable.of(this.localStorage.retrieve(CACHE_KEYS) || {});
            });
    }

}
