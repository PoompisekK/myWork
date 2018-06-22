import { Injectable } from '@angular/core';
import { TranslationService, LocaleService, TranslationConfig, TranslationProvider, TranslationHandler } from 'angular-l10n';

/**
 * UEARN Customized Translation Service
 * 
 * @author NorrapatN
 * @since Thu Aug 17 2017
 */
@Injectable()
export class UearnTranslationService extends TranslationService {

  constructor(
    locale: LocaleService,
    configuration: TranslationConfig,
    translationProvider: TranslationProvider,
    translationHandler: TranslationHandler,
  ) {
    super(locale, configuration, translationProvider, translationHandler);
    
  }

}
