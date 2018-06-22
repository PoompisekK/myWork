import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

/**
 * Safe Style Pipe
 * 
 * Style Sanitizer
 * 
 * @author NorrapatN
 * @see https://stackoverflow.com/a/37076868
 * @since Thu Jun 08 2017
 */
@Pipe({
  name: 'safeStyle'
})
export class SafeStylePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  public transform(style: string) {
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
}
