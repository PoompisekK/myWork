import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
/**
 * @author Bundit.Ng
 * @since  Thu Jun 15 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@Table('ORGANIZATION_IMAGE', {
  eafModuleId: 'MD1171025427',
  entityId: 'EN_170427102415863_v001'
})
export class OrganizationImage extends EAFModuleBase {

  @Field('ORG_IMAGE_ID') public orgImageId:string;
  
  @Field('ORG_ID') public orgId:string;
  @Field('IMAGE_PATH') public imagePath:string;
  @Field('IMAGE_FILE_NAME') public imageFileName:string;
  @Field('IS_LOGO') public isLogo:string;
  @Field('IMAGE_KEY') public imageKey:string;
}
