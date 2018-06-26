import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from 'angular-l10n';

export const HCMTranslateKey: string = "hcmtranslate";

@Pipe({
    name: HCMTranslateKey
})
export class HCMTranslatePipe implements PipeTransform {
    constructor(
        private translationService: TranslationService
    ) { }

    public transform(_key: string, args) {
        console.log("HCMTranslatePipe.transform :", _key, args);
        if (!arguments) {
            return;
        } else {
            let key = arguments && arguments[0];
            let translated = this.translationService.translate(key);
            let defaultValue = arguments && arguments[1];
            if (defaultValue) {
                return !key.equals(translated) ? translated : defaultValue;
            } else {
                return !key.equals(translated) ? translated : key;
            }
        }
    }
}