import { StringUtil } from '../utilities/string.util';
/*
 * HCM REST API constant
 */
const eafConstant = ENV.REST_API.HCM_SERVICE_URL;

export class HCMRestApi {
  public static URL = eafConstant.URL;
  public static EAF_REST_URL = eafConstant.EAF_REST_URL;
  public static URL_ENTITY = `${HCMRestApi.EAF_REST_URL}/entity`;
  public static EAF_AUTHENTICATE_URL = `${HCMRestApi.URL}/workforce/accessTokenDMP?m=signInFromSCM`;

  public static URL_IMAGE_PROFILE = `${HCMRestApi.URL}/file/profileimage`;

  public static getHCMImageUrl(empCode: string): string {
    return HCMRestApi.URL_IMAGE_PROFILE + "/" + empCode + "?" + (new Date().getTime().toString());
  }
}