import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field, SubModel } from '../../services/eaf-rest/eaf-rest.decorators';
import { YBatMsMedicalChoiceModel } from "./ybat.ms-medical-choice.model";
import { YBatMsMedicalQuestionModel } from './ybat.ms-medical-question.model';
/**
 * @author Bundit.Ng
 * @since  Mon Jun 19 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@Table('', {
  eafModuleId: null,
  entityId: null,
})
export class YBatUserMedicalQuestionModel extends EAFModuleBase {

  @Field("QUESTION_ID") public questionId: string;
  @Field("DISPLAY_FLAG") public displayFlag: string;
  @Field("MANDATORY_FLAG") public mandatoryFlag: string;
  @Field("MEDICAL_QUESTION_ID") public medicalQuestionId: string;
  @Field("ORG_ID") public orgId: string;
  @Field("QUESTION_CODE") public questionCode: string;
  @Field("QUESTION_SEQ") public questionSeq: string;
  @Field("STATUS") public status: string;

  @Field("DISPLAY_REF_QUESTION") public displayRefQuestion: string;
  @Field("DISPLAY_REF_VALUE") public displayRefValue: string;
  @Field("REQUIRE_REF_QUESTION") public requireRefQuestion: string;
  @Field("REQUIRE_REF_VALUE") public requireRefValue: string;

  @SubModel(YBatMsMedicalChoiceModel)
  public ybatMsMedicalChoices: YBatMsMedicalChoiceModel[] = [];
  @SubModel(YBatMsMedicalQuestionModel)
  public ybatMsMedicalQuestion: YBatMsMedicalQuestionModel;

  // @SubModel(YBatMsMedicalChoiceModel)
  public zybatMsMedicalChoices: YBatMsMedicalChoiceModel[] = [];
  // @SubModel(YBatMsMedicalQuestionModel)
  public zybatMsMedicalQuestion: YBatMsMedicalQuestionModel;

  public color: string;

}