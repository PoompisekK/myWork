import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * @author Bundit.Ng
 * @since  Tue May 30 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@Table('MS_SUBDISTRICT', {
  eafModuleId: 'MD2448379684',
  entityId: 'EN_57712553104316'
})
export class SubDistrictMasterModel extends EAFModuleBase {
  @Field('DISTRICT_ID') public districtId: number;
  @Field('SUBDISTRICT_ID') public subDistrictId: number;

  @Field('SUBDISTRICT_CODE') public subDistrictCode: string;
  @Field('SUBDISTRICT_NAME') public subDistrictName: string;
  @Field('STATUS') public status: string;
}