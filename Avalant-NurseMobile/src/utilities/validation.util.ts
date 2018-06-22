/**
 * Validation Utility functions
 * 
 * Every validation functions can be using from here
 * 
 * @author NorrapatN
 * @since Tue Jul 04 2017
 */
import { FormGroup } from "@angular/forms/forms";
import { TranslationService } from "angular-l10n";
import { StringUtil } from './string.util';
import { AlertController } from "ionic-angular";
import { Inject, forwardRef } from "@angular/core";

export class ValidationUtil {

  public static readonly EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    @Inject(forwardRef(() => TranslationService)) private translationService: TranslationService,
    @Inject(forwardRef(() => AlertController)) private alertCtrl: AlertController,

  ) { }

  public static emailValidate(email: string): boolean {
    return this.EMAIL_REGEXP.test(email);
  }

  public displayInvalidRequireField(formGrp: FormGroup, translateMsgGroup: string) {
    // console.log("formGrp.form:", formGrp);
    let emptyFieldsList = [];
    let invalidFieldsList = [];
    Object.keys(formGrp.value).forEach((keysName) => {
      let fieldValue = formGrp.value[keysName];
      let ctrlField = formGrp.controls[keysName];
      let translateEmptyStr = this.translationService.translate(translateMsgGroup + keysName.toUpperCase());

      if (ctrlField.invalid) {
        if (StringUtil.isEmptyString(fieldValue)) {
          emptyFieldsList.push(translateEmptyStr);
        } else {
          invalidFieldsList.push(translateEmptyStr);
        }
      }
    });

    // console.log("emptyFieldsList   :", emptyFieldsList);
    // console.log("invalidFieldsList :", invalidFieldsList);

    let emptyFieldsStr = "";
    let invalidFieldsStr = "";

    for (let i = 0; i < Math.max(emptyFieldsList.length, invalidFieldsList.length); i++) {
      if (i < emptyFieldsList.length) {
        emptyFieldsStr = emptyFieldsStr + '<br><span color="danger">* </span>' + emptyFieldsList[i];
      }
      if (i < invalidFieldsList.length) {
        invalidFieldsStr = invalidFieldsStr + '<br><span color="danger">* </span>' + invalidFieldsList[i];
      }
    }

    // console.log("emptyFieldsStr   :", emptyFieldsStr);
    // console.log("invalidFieldsStr :", invalidFieldsStr);
    let prefixEmpty = this.translationService.translate('COMMON.VERIFY_INPUT.PLEASE_INPUT'),
      suffixEmpty = this.translationService.translate('COMMON.VERIFY_INPUT.PLEASE_INPUT_COMPLETELY');
    let prefixInval = this.translationService.translate('COMMON.VERIFY_INPUT.PLEASE_CORRECTLY_INPUT'),
      suffixInval = this.translationService.translate('COMMON.VERIFY_INPUT.PLEASE_CORRECT_COMPLETELY_INPUT');

    let msgEmptyContents = prefixEmpty + `${emptyFieldsStr} <br/>` + suffixEmpty;
    let msgInvalContents = prefixInval + `${invalidFieldsStr} <br/>` + suffixInval;

    let msgContents = "";
    if (emptyFieldsList.length > 0) {
      msgContents = msgEmptyContents;
    }
    if (invalidFieldsList.length > 0) {
      msgContents = (StringUtil.isEmptyString(msgContents) ? "" : msgContents + "<br><br>") + msgInvalContents;
    }
    this.alertCtrl.create({
      cssClass: "alertMessageUserProfile",
      message: msgContents,
      buttons: [this.translationService.translate('COMMON.BUTTON.DONE')]
    }).present();
  }

}
