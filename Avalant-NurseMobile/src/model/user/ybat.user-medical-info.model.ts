import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
/**
 * @author Bundit.Ng
 * @since  Tue May 30 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
//EN_170519141221929_v001
@Table('ZYBAT_USER_MEDICAL_INFO', {
  eafModuleId: 'MD3350065121',
  entityId: 'EN_106648658505900',
})

export class YBatUserMedicalAnswerInfoModel extends EAFModuleBase {
  @Field('USER_INFO_ID') public userInfoId: string;
  @Field('USER_MEDICAL_QUESTION_ID') public userMedicalQuestionId: string;
  @Field('ANSWER') public answer: string;
  @Field('OTHER') public other: string;
  // @Field('ORG_ID', {
  //   isOnlyGui: true,
  // }) public orgId: string;
  @Field('QUESTION_CODE') public questionCode: string;
}