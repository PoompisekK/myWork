/*
 * Social Com REST API constant
 */

export class SCMRestApi {
  public static readonly URL = ENV.REST_API.SOCIAL_COM.URL;

  public static readonly ERROR_CODES = {
    INVALID_CREDIENTIAL: 'COMMON.SIGNIN.INVALID_CREDIENTIAL',
    NEED_EMAIL_ACTIVATED: 'COMMON.SIGNIN.NEED_EMAIL_ACTIVATED',
    SYSTEM_ERROR: 'SYSTEM_ERROR',
  };

}
