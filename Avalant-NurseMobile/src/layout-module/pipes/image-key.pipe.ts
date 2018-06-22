import { Pipe, PipeTransform } from '@angular/core';
import { EAFRestApi } from '../../constants/eaf-rest-api';
/**
 * Image key Pipe
 * 
 * Use for transform Image key into Image URL
 * 
 * @author NorrapatN
 * @since Sat Jun 24 2017
 */
@Pipe({
  name: 'imagekey'
})
export class ImageKeyPipe implements PipeTransform {

  public transform(imageKey: string) {
    let fak = EAFRestApi.getImageUrl(imageKey);
    // console.debug('💭 Image URL : ' + fak);
    return fak;
  }

}
