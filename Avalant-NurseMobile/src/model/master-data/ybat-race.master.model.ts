import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * @author Bundit.Ng
 * @since  Tue May 30 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@Table('ZYBAT_MS_RACE', {
  eafModuleId: 'MD4038828359',
  entityId:'EN_646162540941700'
})
export class YBatRaceMasterModel extends EAFModuleBase {

  @Field('RACE_ID') public raceId: string;
  
  @Field('RACE_CODE') public raceCode: string;
  @Field('RACE_NAME') public raceName: string;
  @Field('LANGUAGE') public language: string;
  @Field('ORG_ID') public orgId: string;
}