import { Type } from "@angular/core";
/**
 * Page tab model
 * @author NorrapatN
 * @since Wed May 17 2017
 */

export class PageTab {

  public component: Type<any> | string;
  public title: string;
  public params: { [key: string]: any };

  public shopTypeId?: string;
  public shopId?: string;

  constructor(
    options?: {
      component?: Type<any>,
      title?: string,
      params?: { [key: string]: any };
    }
  ) {
    if (options) {
      Object.assign(this, options);
    }
  }
}
