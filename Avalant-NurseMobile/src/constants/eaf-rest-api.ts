import { StringUtil } from '../utilities/string.util';
/*
 * EAF REST API constant
 */
const eafConstant = ENV.REST_API.EAF;
const eafMaster = ENV.REST_API.MASTERWEB;

export class EAFRestApi {
  public static URL = eafConstant.URL;
  public static MASTER_URL = eafMaster.URL;
  public static URL_ENTITY = `${EAFRestApi.URL}/entity`;
  public static URL_FILE = `${EAFRestApi.URL}/file`;
  public static URL_MANUAL_SERVLET = `${EAFRestApi.URL}/DMPManualServlet`;
  public static URL_MANUAL_SERVLET_UNAUTH = `${EAFRestApi.MASTER_URL}/DMPManualServletUnAuth`;
  public static URL_EAF_REFRESH_CACHE = `${EAFRestApi.URL}/refreshMaster.jsp`;
  public static URL_EAF_MANUAL_SERVLET_REFRESH_CACHE = `${EAFRestApi.URL}/DMPManualServlet?refresh=Y`;
  public static URL_UPLOAD = `${EAFRestApi.URL}/file/upload`;
  public static CREDENTIAL = {
    clientId: 'DMPMobile',
    username: eafConstant.USERNAME,
    password: eafConstant.PASSWORD
  };
  public static CALLBACK_METHOD = 'eafCallback';
  public static IMAGE_MINETYPE = 'application/octet-stream';

  public static EAF_URL = {
    AUTHENTICATE: EAFRestApi.URL + '/login',
  };

  public static getImageUrl(imageKey: string): string {
    if (!imageKey || StringUtil.isEmptyString(imageKey)) {
      return `./assets/img/placeholder.png`;
    }
    // return `${EAFRestApi.URL_FILE}/${imageKey}/download?mimetype=${EAFRestApi.IMAGE_MINETYPE}`;
    return this.parseImageUrl(imageKey);
  }

  private static parseImageUrl(imageKey: string): string {
    let regEx = /^(?=.*(eaf-rest\/file).*(download\?mimetype)).*$/;
    let extUrlRegExp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    if (regEx.test(imageKey)) { // if already parse to rest-image url;
      return this.validateHttpAndHttps(imageKey);
    } else if (extUrlRegExp.test(imageKey)) { // is valid by it self. using internet
      return this.validateHttpAndHttps(imageKey);
    } else {
      return `${EAFRestApi.URL_FILE}/${imageKey}/download?mimetype=${EAFRestApi.IMAGE_MINETYPE}`;
    }
  }

  private static validateHttpAndHttps(imageKey: string): string {
    let httpReg = /(https\:\/\/|http\:\/\/)/;
    if (httpReg.test(imageKey)) {
      return imageKey;
    } else {
      return "http://" + imageKey;
    }
  }
}
