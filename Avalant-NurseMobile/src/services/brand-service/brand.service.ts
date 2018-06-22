import { Injectable } from '@angular/core';
import { Events, App } from 'ionic-angular';

/**
 * Brand Service
 * 
 * @description
 *    Provide function for Brand (Organization)
 * 
 * @author NorrapatN
 * @since Fri Aug 04 2017
 */
@Injectable()
export class BrandService {

  /**
   * Store previous Brand CSS class for remove when changing
   */
  private _prevClass: string;

  private _currentClass: string;

  /**
   * Current Brand CSS Class
   */
  public get currentClass(): string {
    return this._currentClass;
  }

  constructor(
    private app: App,
    private events: Events,
  ) {

  }

  /**
   * Set current Brand
   * 
   * @description
   *    Use for set Brand code into <ion-app> CSS Class
   * 
   * @param brandTheme A Brand Theme.  If nothing it will clear
   */
  public setBrand(brandTheme?: string): void {
    if (this._prevClass) {
      this.removeClass(this._prevClass);
    }

    if (brandTheme) {
      this.addClass(brandTheme);
      this._currentClass = brandTheme;
      this._prevClass = brandTheme;
    }

    this.events.publish('app:brand:update', brandTheme);
  }

  /**
   * Clear brand code (CSS class)
   */
  public clearBrand(): void {
    this.setBrand();
  }

  private addClass(cssClass: string): void {
    this.app._appRoot.setElementClass(cssClass, true);
  }

  private removeClass(cssClass: string): void {
    this.app._appRoot.setElementClass(cssClass, false);
  }

}
