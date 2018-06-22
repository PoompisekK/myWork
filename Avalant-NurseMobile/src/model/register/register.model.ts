/**
 * Register model for Register (Sign Up) page
 */

export class RegisterModel {

  public firstName: string;
  public lastName: string;

  public email: string;
  public password: string;
  public confirmPassword: string;
  public nickName: string;
  // public username
  public mobileNo: string;
  public birthDate: string;//yyyy-mm-dd
  public isKeepUpdate: boolean;

  public get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }
}