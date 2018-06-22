import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
/**
 * @author Bundit.Ng
 * @since  Mon Jun 19 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@Table('ZYBAT_MS_MEDICAL_QUESTION', {
  eafModuleId: null,
  entityId: null,
})
export class YBatMsMedicalQuestionModel extends EAFModuleBase {
  
  @Field('QUESTION_ID') public questionId: string;

  @Field('QUESTION_NAME') public questionName: string;
  @Field('QUESTION_TYPE') public questionType: string;
  @Field('STATUS') public status: string;
  @Field('ORG_ID') public orgId: string;
  @Field('QUESTION_CODE') public questionCode: string;
  @Field('LANGUAGE') public language: string;
}