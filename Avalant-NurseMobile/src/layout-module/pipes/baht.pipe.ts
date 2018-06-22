import { Pipe, PipeTransform } from '@angular/core';
import { NumberUtil } from '../../utilities/number.util';
/**
 * Baht Currency Pipe
 * 
 * @author NorrapatN
 * @since Tue Jul 25 2017
 */
@Pipe({
  name: 'baht',
})
export class BahtPipe implements PipeTransform {

  public transform(value: any): string {
    value = NumberUtil.convertToNumber(value);
    if (!value) {
      return '0.00';
    }

    return NumberUtil.format(value, 2);
  }

}
