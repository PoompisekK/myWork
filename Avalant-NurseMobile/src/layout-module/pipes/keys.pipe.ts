import { Pipe, PipeTransform } from "@angular/core";

/**
 * Keys Pipe
 * 
 * Use to iterate object map
 * 
 * Example : <div *ngFor="let key of objs | keys">
 * 
 * @see https://stackoverflow.com/a/41396558
 */
@Pipe({ name: 'keys', pure: false })
export class KeysPipe implements PipeTransform {
  public transform(value: any, args: any[] = null): any {
    if (!value) {
      return [];
    }
    return Object.keys(value);
  }
}
