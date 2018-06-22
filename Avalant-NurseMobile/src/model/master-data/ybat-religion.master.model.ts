import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * @author Bundit.Ng
 * @since  Tue May 30 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@Table('ZYBAT_MS_RELIGION', {
  eafModuleId: 'MD11715411',
  entityId: 'EN_170523150420521_v001'
})
export class YBatReligionMasterModel extends EAFModuleBase {

  @Field('RELIGION_ID') public religionId: string;
  @Field('RELIGION_CODE') public religionCode: string;
  @Field('RELIGION_NAME') public religionName: string;
  @Field('LANGUAGE') public language: string;
  @Field('SYSTEM_CODE') public systemCode: string;
  @Field('STATUS') public status: string;
}