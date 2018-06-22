import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
/**
 * @author Bundit.Ng
 * @since  Wed May 31 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

//EN_170427181841352_v001
@Table('ZYBAT_USER_ATTACH_DOCUMENT', {
  eafModuleId: 'MD1171812849',//MD1171652387',
  entityId: 'EN_170427181841352_v001'//'EN_170706165145492_v001',
})
export class YBatUserAttachmentModel extends EAFModuleBase {

  @Field('BUSINESS_USER_ID') public businessUserId: string;

  @Field('ATTACH_DOCUMENT_ID') public attachDocumentId: string;
  @Field('DOCUMENT_TYPE') public documentType: string;
  @Field('FILE_NAME') public fileName: string;
  @Field('FILE_PATH') public filePath: string;
  @Field('STATUS') public status: string;
  @Field('ORG_ID') public orgId: string;
  @Field('SEQ') public seq: string;
}