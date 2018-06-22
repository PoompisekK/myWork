import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';

@Table('ADDRESS', {
  eafModuleId: 'MD1172150798',
  entityId: 'EN_170427214948756_v001',
})
export class AddressModel extends EAFModuleBase {

  @Field('BUSINESS_USER_ID') public businessUserId: string;
  @Field('ADDRESS_ID') public addressId: string;
  @Field('ADDRESS_NO') public addressNo: string;
  @Field('ADDRESS_NAME') public addressName: string;
  @Field('HOUSE_NO') public houseNo: string;
  @Field('ROOM') public room: string;
  @Field('MOO') public moo: string;
  @Field('STREET') public street: string;
  @Field('SOI') public soi: string;

  @Field('SUBDISTRICT') public subDistrict: string;
  @Field('SUBDISTRICT_NAME', { isOnlyGui: true }) public subDistrictName: string;
  @Field('DISTRICT') public district: string;
  @Field('DISTRICT_NAME', { isOnlyGui: true }) public districtName: string;
  @Field('PROVINCE') public province: string;
  @Field('PROVINCE_NAME', { isOnlyGui: true }) public provinceName: string;
  @Field('POSTCODE') public postcode: string;
  @Field('COUNTRY') public country: string;

  @Field('RECEIVE_NAME') public receiveName: string;
  @Field('RECEIVE_SURNAME') public receiveSurname: string;
  @Field('EMAIL') public email: string;

  @Field('PHONE') public phone: string;
  @Field('STATUS') public status: string;

  public addressTypeId: string;

  constructor() {
    super();
  }
}