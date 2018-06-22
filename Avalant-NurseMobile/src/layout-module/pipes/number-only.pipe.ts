import { Pipe, PipeTransform } from '@angular/core';
import { NumberUtil } from '../../utilities/number.util';
/**
 * 
 * @author NorrapatN
 * @since Tue Jul 18 2017
 */
@Pipe({
  name: 'numberonly'
})
export class NumberOnlyPipe implements PipeTransform {

  public transform(value: string): string {
    return NumberUtil.catchNumber(value) + '';
  }

}
