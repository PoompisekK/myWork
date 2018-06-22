/*
 * Social Com REST API constant
 */

export class SMSOTPWebservice {
  private static readonly OTP_URL = ENV.REST_API.SMS_OTP_WEBSERVICE.URL;

  public static readonly GENERATE_OTP = SMSOTPWebservice.OTP_URL + '/OTPServiceGenerateOTP?';
  public static readonly VERIFY_OTP = SMSOTPWebservice.OTP_URL + '/OTPServiceVerifyOTP?';
}
