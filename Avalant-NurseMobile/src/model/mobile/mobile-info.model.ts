import { Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('DMP_MOBILE_APP',{

})
export class MobileInfoModel extends EAFModuleBase {

  public mobileAppId : string;
  public forceUpdateRequired : string;
  public forceUpdateCurrentVersion : string;
  public forceUpdateUrl : string;
  public authenType : string;
  public createBy : string;
  public createDate : Date;
  public updateBy : string;
  public updateDate : Date;
  public currentVersion : string;
  public businessUserId : string;
  public deviceUuid : string;
  public pushNotificationToken : string;
  public mobileAppCode : string;
  public mobilePlatform : string;
  public mobileVersion : string;
}