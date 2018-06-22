import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * @author Bundit.Ng
 * @since  Tue May 30 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@Table('ZYBAT_MS_NATIONALITY', {
  eafModuleId: 'MD1171446492',
  entityId: 'EN_170523144555661_v001'
})
export class YBatNationalityMasterModel extends EAFModuleBase {

  @Field('NATIONALITY_ID') public nationalityId: string;
  @Field('NATIONALITY_CODE') public nationalityCode: string;
  @Field('NATIONALITY_NAME') public nationalityName: string;
  @Field('LANGUAGE') public language: string;
  @Field('ORG_ID') public orgId: string;
}