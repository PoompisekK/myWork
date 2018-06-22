/**
 * Organization Brand Icon model
 * 
 * @author NorrapatN
 * @since Thu May 18 2017
 */
export class BrandIconModel {

  constructor(options?: BrandIconModel) {
    Object.assign(this, options);
  }

  public id?: string;
  public name?: string;
  public description?: string;
  public category?: string;
  public iconPath?: string;
  public background?: string;

}
