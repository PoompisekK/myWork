import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
/**
 * @author Bundit.Ng
 * @since  Tue May 30 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
//EN_170606174318087_v001
@Table('ZYBAT_USER_CONTACT_INFO', {
  eafModuleId: 'MD1171413663', //'MD1171744504',
  entityId: 'EN_170519141221929_v001' //'EN_170606174318087_v001',
})
export class YBatUserContactInfoModel extends EAFModuleBase {
  @Field('USER_INFO_ID') public userInfoId: string;

  @Field('USER_CONTACT_ID') public userContactId: string;
  @Field('NAME') public name: string;
  @Field('SURNAME') public surname: string;
  @Field('EMAIL') public email: string;
  @Field('PHONE') public phone: string;
  @Field('CONTACT_TYPE') public contactType: string;
  @Field('RELATION') public relation: string;
  @Field('ORG_ID') public orgId: string;

  constructor(contactType?: string) {
    super();
    if (contactType) { this.contactType = contactType; }
  }
}