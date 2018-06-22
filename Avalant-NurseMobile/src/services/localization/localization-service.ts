/**
 * localization-service
 * Created by NorrapatN on 4/21/2017.
 */
import { Injectable } from '@angular/core';
import { LocaleService, TranslationService } from 'angular-l10n';
import { Events } from 'ionic-angular';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-Webstorage';

import { AppState } from '../../app/app.state';
import { HCMRestApi } from '../../constants/hcm-rest-api';

@Injectable()
export class LocalizationService {
  private supportLanguage = ['en', 'th'];
  public manualChangeWithOutLogin: boolean = false;

  constructor(
    private events: Events,
    private localeService: LocaleService,
    private localStorage: LocalStorageService,
    private translation: TranslationService,
    private appState: AppState,
  ) { }

  public load(): Promise<any> {
    this.localeService.addConfiguration()
      .addLanguages(this.supportLanguage)
      .useLocalStorage()
      .setCookieExpiration(30)
      .defineLanguage('en');
    moment.locale('en');
    this.localeService.init();

    // this.translation.addConfiguration().addProvider('./assets/locale/');
    this.translation.addConfiguration()
      // .addWebAPIProvider(EAFRestApi.URL_MANUAL_SERVLET_UNAUTH + '?key=LanguageService&orgID=' + this.appState.currentOrganizationId + '&language=');
      .addWebAPIProvider(HCMRestApi.URL + '/lang/');
    // .addCustomProvider({
    //   orgID: this.appState.currentOrganizationId,
    // }); // Use Custom provider instead.

    let promise: Promise<any> = new Promise((resolve: any) => {
      this.translation.translationChanged.subscribe((lang: string) => {
        this.events.publish('translation:changed', lang);
        resolve(true);
      }, error => {
        console.warn('Error => ', error);
      });

      this.translation.translationError.subscribe((error) => {
        this.events.publish('translation:error', error);
        console.warn('⚠️ Translation Changing error ! :', error);
      });
    });

    this.translation.init();

    return promise;
  }

  public getLastDisplayAppLanguage(): string {
    return this.localStorage.retrieve(LASTSTATE_APPLANGUAGE);
  }

  private setLastDisplayAppLanguage(language: string) {
    this.localStorage.store(LASTSTATE_APPLANGUAGE, language);
  }

  public setLanguageSync(language: string) {
    moment.locale(language);
    this.localeService.setCurrentLanguage(language);
    this.setLastDisplayAppLanguage(language);
  }

  public async setLanguage(language: string) {
    if (!this.manualChangeWithOutLogin) {
      moment.locale(language);
      this.localeService.setCurrentLanguage(language);
      this.setLastDisplayAppLanguage(language);
    }
    return language;
  }
}

const LASTSTATE_APPLANGUAGE: string = "app-language";
