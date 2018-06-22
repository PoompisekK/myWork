import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
/**
 * @author Bundit.Ng
 * @since  Mon Jun 19 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@Table('ZYBAT_MS_MEDICAL_CHOICE', {
  eafModuleId: null,
  entityId: null,
})
export class YBatMsMedicalChoiceModel extends EAFModuleBase {
  @Field("MEDICAL_CHOICE_ID") public medicalChoiceId: string;
  @Field("QUESTION_ID") public questionId: string;
  @Field("CHOICE_DESC") public choiceDesc: string;
  @Field("CHOICE_CODE") public choiceCode: string;
  @Field("CHOICE_WEIGHT") public choiceWeight: string;
  @Field("ISREQUIRE_OTHER_DETAIL") public isrequireOtherDetail: string;
  @Field("STATUS") public status: string;
  @Field("ORG_ID") public orgId: string;
  @Field("LANGUAGE") public language: string;
  @Field("CHOICE_SEQ") public choiceSeq: string;
}