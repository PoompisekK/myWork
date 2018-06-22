import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * @author Bundit.Ng
 * @since  Wed Jun 07 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@Table('ZYBAT_MS_EDUCATION_LEVEL', {
  eafModuleId: 'MD1171014689',
  entityId: 'EN_170523101424894_v001'
})
export class YBatEducationLevelMasterModel extends EAFModuleBase {

  @Field('EDUCATION_LEVEL_ID') public educationLeveIid: string;
  @Field('LEVEL_CODE') public levelCode: string;
  @Field('LEVEL_NAME') public levelName: string;
  @Field('LANGUAGE') public language: string;
  @Field('STATUS') public status: string;
}