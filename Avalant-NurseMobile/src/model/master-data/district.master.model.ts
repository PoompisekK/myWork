import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * @author Bundit.Ng
 * @since  Tue May 30 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@Table('MS_DISTRICT', {
  eafModuleId: 'MD4702705104',
  entityId: 'EN_30521560826287'
})
export class DistrictMasterModel extends EAFModuleBase {
  @Field('PROVINCE_ID') public provinceId: string;

  @Field('DISTRICT_ID') public districtId: string;
  @Field('DISTRICT_CODE') public districtCode: string;
  @Field('DISTRICT_NAME') public districtName: string;
  @Field('LANGUAGE') public language: string;
  @Field('ORG_ID') public orgId: string;
  @Field('STATUS') public status: string;
}