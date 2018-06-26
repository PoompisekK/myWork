import { Directive, ElementRef, Renderer } from '@angular/core';
import { TranslationService } from 'angular-l10n';

import { AppServices } from '../../services/app-services';
import { HCMTranslateKey } from '../modules/hcm-translate.pipe';

@Directive({
    selector: "[" + HCMTranslateKey + "]"
})
export class HCMTranslateDirective {

    private _langKey: string;
    constructor(
        private renderer: Renderer,
        private _elemRef: ElementRef,
        private appServices: AppServices,
        private translationService: TranslationService) {
    }

    public ngOnInit() {
        this.doTranslate();
        this.appServices.subscribe("translation:changed", () => {
            this.doTranslate();
        });
    }

    public ngAfterViewChecked() {
        // this.doTranslate();
    }

    private doTranslate(): void {
        let innerHTML: string = this._elemRef.nativeElement.innerHTML || '';
        let _defaultValue: string;
        if (!this._langKey) {
            if (innerHTML.indexOf(":") > -1) {
                this._langKey = innerHTML.split(":")[0];
                _defaultValue = innerHTML.split(":")[1];
            } else {
                this._langKey = innerHTML;
            }
        }
        let translated = this.getTranslateLogic(this._langKey, _defaultValue);
        // console.log("doTranslate _keyStr:", this._langKey, " ,_defaultValue:", _defaultValue, " ,translated:", translated);
        this.renderer.setElementProperty(this._elemRef.nativeElement, 'innerHTML', translated);
    }

    private getTranslateLogic(key: string, defaultValue: string): string {
        let translated = this.translationService.translate((key || '').trim());
        if (defaultValue) {
            return !key.equals(translated) ? translated : (defaultValue || '').trim();
        } else {
            return !key.equals(translated) ? translated : key;
        }
    }

    public ngOnDestroy() {

    }
}
