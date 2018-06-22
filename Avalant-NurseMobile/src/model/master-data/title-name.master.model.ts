import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * @author Bundit.Ng
 * @since  Wed Jun 14 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@Table('MS_TITLE', {
  eafModuleId: 'MD2632926019',
  entityId: 'EN_31806474565311'
})
export class TitleNameMasterModel extends EAFModuleBase {

  @Field('TITLE_ID') public titleId: string;

  @Field('TITLE_CODE') public titleCode: string;
  @Field('TITLE_NAME') public titleName: string;
  @Field('LANGUAGE') public language: string;
  @Field('OWNER_TYPE') public ownerType: string;
  @Field('STATUS') public status: string;
  @Field('ORG_ID') public orgId: string;
  @Field('GENDER') public gender: string;
  @Field('SEQ') public seq: string;
}