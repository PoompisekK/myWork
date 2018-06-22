/**
 * @author Bundit.Ng
 * @since  Fri Sep 01 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
export class RequestOTPModel {
  public smsType: string;
  public language: string;
  public orgID: string;
  public mobileNo: string;
  public sendType: string;
}

export class VerifyOTPModel {
  public messageTransactionID: string;
  public referKey: string;
  public otpCode: string;
}
