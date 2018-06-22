/**
 * Step Item
 * 
 * @author NorrapatN
 * @since Tue Nov 07 2017
 */
export class StepItem {

  public imageUrl?: string;
  public icon?: string;
  public text?: string;
  public color?: string;
  public isNoWrap?: boolean;

  constructor(value?: StepItem) {
    if (value) {
      Object.assign(this, value);
    }
  }

}
