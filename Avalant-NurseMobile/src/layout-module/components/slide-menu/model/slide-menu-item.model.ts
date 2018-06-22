/**
 * Slide menu Item Model
 * 
 * @author NorrapatN
 * @since Tue Sep 26 2017
 */
export class SlideMenuItem {

  public id?: string | number;
  public name?: string;
  public iconUrl?: string;
  public link?: string | string[];
  public value?: any;

  constructor(value?: SlideMenuItem) {

    if (!!value) {
      Object.assign(this, value);
    }
  }

}
