import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

/**
 * Safe URL Pipe
 * 
 * HTML Sanitizer
 * 
 * @author NorrapatN
 * @see https://stackoverflow.com/a/37076868
 * @since Thu Jun 08 2017
 */
@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  public transform(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
