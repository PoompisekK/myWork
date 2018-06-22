import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * @author Bundit.Ng
 * @since  Tue May 30 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@Table('MS_PROVINCE', {
  eafModuleId: 'MD1171743747',
  entityId: 'EN_170428174219287_v001'
})
export class ProvinceMasterModel extends EAFModuleBase {
  @Field('SEQ') public seq: string;
  @Field('PROVINCE_ID') public provinceId: string;
  @Field('PROVINCE_CODE') public provinceCode: string;
  @Field('PROVINCE_NAME') public provinceName: string;
  @Field('LANGUAGE') public language: string;
  @Field('ORG_ID') public orgId: string;
  @Field('STATUS') public status: string;
}