import { Pipe, PipeTransform } from '@angular/core';
import { OrderHeadModel } from '../../model/my-order/order-head.model';
import { TranslationService } from 'angular-l10n';

@Pipe({
  name: 'thaiDateString',
  pure: false
})
export class ThaiDatePipeFromString implements PipeTransform {

  constructor(
    private translationService: TranslationService
  ) {

  }

  private monthNames = (this.translationService.translate("COMMON.USERPROFILE.MONTHS_LONG") || " ").split(" ");
  private monthShortNames = (this.translationService.translate("COMMON.USERPROFILE.MONTHS_SHORT") || " ").split(" ");

  public transform(dateString: string): string {
    let result = "";
    if (dateString) {
      if (dateString.indexOf('-') > -1) {
        let dateArray = dateString.split('-');
        if (dateArray[0].length == 2) {
          return dateArray[0] + ' ' + this.monthNames[parseInt(dateArray[1]) - 1] + ' ' + (parseInt(dateArray[2]) + 543);
        }
        else {
          return dateArray[2] + ' ' + this.monthNames[parseInt(dateArray[1]) - 1] + ' ' + (parseInt(dateArray[0]) + 543);
        }
      }
      else if (dateString.indexOf('/') > -1) {
        let dateArray = dateString.split('/');
        if (dateArray[0].length == 2) {
          return dateArray[0] + ' ' + this.monthNames[parseInt(dateArray[1]) - 1] + ' ' + (parseInt(dateArray[2]) + 543);
        }
        else {
          return dateArray[2] + ' ' + this.monthNames[parseInt(dateArray[1]) - 1] + ' ' + (parseInt(dateArray[0]) + 543);
        }

      }
    }
    return result;
  }

}