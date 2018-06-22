import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field, SubModel } from '../../services/eaf-rest/eaf-rest.decorators';
import { YBatUserContactInfoModel } from './ybat.user-contact-info.model';
import { YBatUserMedicalAnswerInfoModel } from "./ybat.user-medical-info.model";
import { YBatUserAttachmentModel } from './ybat.user-attachment.model';
import { YBatUserMedicalQuestionModel } from './ybat.user-medical-questions.model';
/**
 * @author Bundit.Ng
 * @since  Tue May 30 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
//EN_170519141221929_v001
@Table('ZYBAT_USER_INFO', {
  eafModuleId: 'MD1171413983',
  entityId: 'EN_170519141221929_v001',
})///MD1171148160
export class YBatUserInfoModel extends EAFModuleBase {

  @Field('BUSINESS_USER_ID') public businessUserId: string;

  @Field('USER_INFO_ID') public userInfoId: string;
  @Field('USER_PRIVILEGE_ID') public userPrivilegeId: string;
  @Field('NATIONALITY') public nationality: string;
  @Field('PASSPORT_NO') public passportNo: string;
  @Field('RACE') public race: string;
  @Field('RELIGION') public religion: string;
  @Field('WEIGHT') public weight: string;
  @Field('HIGHT') public hight: string;
  @Field('LINE_ID') public lineId: string;
  @Field('CARD_ID') public cardId: string;
  @Field('OCCUPATION') public occupation: string;
  @Field('EDUCATION_LEVEL') public educationLevel: string;
  @Field('POSITION') public position: string;

  @SubModel(YBatUserContactInfoModel)
  public ybatUserContactInfoList: YBatUserContactInfoModel[] = [];
  @SubModel(YBatUserAttachmentModel)
  public ybatUserAttachmentInfoList: YBatUserAttachmentModel[] = [];

  @SubModel(YBatUserMedicalQuestionModel)
  public ybatUserMedicalQuestionListModel: YBatUserMedicalQuestionModel[] = [];

  //anser user data
  @SubModel(YBatUserMedicalAnswerInfoModel)
  public ybatUserMedicalAnswerInfoList: YBatUserMedicalAnswerInfoModel[] = [];
}