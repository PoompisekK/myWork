import { Injectable } from '@angular/core';
import { TranslationService } from 'angular-l10n';

import { isChromeDev } from '../../constants/environment';

/**
 * HCMTranslationService
 * @author Bundit.Ng
 * @since  Mon Jun 25 2018
 * Copyright (c) 2018 Avalant Co.,Ltd.
 */

@Injectable()
export class HCMTranslationService {

    constructor(
        private translation: TranslationService
    ) {
    }

    public translate(_key: string, args): any {
        isChromeDev() && console.log("HCMTranslationService.translate :", _key, args);
        if (!arguments) {
            return;
        } else {
            let key = arguments && arguments[0];
            let translated = this.translation.translate(key);//super.translate(key);
            let defaultValue = arguments && arguments[1];
            if (defaultValue) {
                isChromeDev() && console.log("HCMTranslationService.translated :", translated, " ,defaultValue :", defaultValue);
                return !key.equals(translated) ? translated : defaultValue;
            } else {
                isChromeDev() && console.log("HCMTranslationService.translated :", translated, " ,key :", key);
                return !key.equals(translated) ? translated : key;
            }
        }
    }

}
