import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { YBatUserContactInfoModel } from './ybat.user-contact-info.model';
import { YBatUserInfoModel } from './ybat.user-info.model';
import { YBatUserMedicalAnswerInfoModel } from './ybat.user-medical-info.model';
import { UserAddressModel } from './user-address.model';

//EN_170427181841352_v001
@Table('BUSINESS_USER', {
  eafModuleId: 'MD1171819565',
  entityId: 'EN_170427181841352_v001',
})
export class UserModel extends EAFModuleBase {

  @Field('ID') public id: string;
  @Field('SIGNINTYPE') public signinType: string;
  @Field('SOCIALUSERID') public socialUserId: string;
  @Field('SOCIALUSERNAME') public socialUsername: string;
  @Field('SCMUSERNAME') public scmUserName: string;
  @Field('SCMPWD', { isOnlyGui: true }) public password: string;
  @Field('MEMBEREMAIL') public memberEmail: string;
  @Field('SOCIALPICPROFILE') public socialPicProfile: string;
  @Field('CUSTFNAME') public custFname: string;
  @Field('CUSTLNAME') public custLname: string;
  @Field('NICK_NAME') public nickName: string;
  @Field('GENDER') public gender: string;
  @Field('LANGUAGES') public languages: string;
  @Field('MOBILE') public mobile: string;
  @Field('USER_STATUS') public userStatus: string;
  @Field('BIRTH_DATE') public birthDate: string;
  @Field('CARD_ID') public cardId: string;

  @Field('TELEPHONE') public telephone: string;
  @Field('OFFICEPHONE') public officePhone: string;
  @Field('TITLE_NAME') public titleName: string;
  @Field('TITLE_CODE') public titleCode: string;

  @Field('ADDERID') public adderid: string;
  @Field('ADDRESS') public address: string;
  @Field('CITY') public city: string;
  @Field('COUNTRY') public country: string;
  @Field('PROVINCE') public province: string;
  @Field('ZIPCODE') public zipcode: string;
  @Field('CUSTOMER_TYPE_ID') public customerTypeId: string;
  @Field('EXT_TELEPHONE') public extTelephone: string;
  @Field('SHOPAMT') public shpAmt: string;
  @Field('USER_CODE') public userCode: string;

  @Field('ORGID', { isOnlyGui: true }) public orgId: string;
  //No need Field
  public confirmPassword: string;

  @Field('DIAL_CODE', { isOnlyGui: true })
  public dialCode: string;

  //below, No Column in Table to provided field
  public isKeepUpdate: boolean;

  public stayNight: string;
  public companyCode: string;
  @Field('EMPLOYEECODE') public employeeCode: string;

  public userAddressList: Array<UserAddressModel> = [];
  public ybatUserInfoM: YBatUserInfoModel = new YBatUserInfoModel();
}