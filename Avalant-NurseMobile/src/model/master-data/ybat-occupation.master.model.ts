import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * @author Bundit.Ng
 * @since  Tue May 30 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@Table('ZYBAT_MS_OCCUPATION', {
  eafModuleId: 'MD1171112728',
  entityId: 'EN_170523111154293_v001'
})
export class YBatOccupationMasterModel extends EAFModuleBase {
  @Field('OCCUPATION_ID') public occupationId: string;
  @Field('OCCUPATION_CODE') public occupationCode: string;
  @Field('OCCUPATION_NAME') public occupationName: string;
  @Field('LANGUAGE') public language: string;
  @Field('STATUS') public status: string;
}