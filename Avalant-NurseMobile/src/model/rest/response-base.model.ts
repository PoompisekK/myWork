import { Enumerable } from '../../app/app.decorators';
/**
 * REST Response base data model
 * @author NorrapatN
 * @since Tue May 23 2017
 */
export class ResponseBaseModel {

  // @Enumerable(false)
  private STATUS: string;

  // @Enumerable(false)
  private MESSAGE: string;

  public get status(): string {
    return this.STATUS;
  }

  public set status(value: string) {
    this.STATUS = value;
  }

  public get message(): string {
    return this.MESSAGE;
  }

  public set message(value: string) {
    this.MESSAGE = value;
  }

  // constructor(
  //   options?: ResponseBaseModel
  // ) { }

}
