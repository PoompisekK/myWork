import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * @author Bundit.Ng
 * @since  Tue May 30 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@Table('MS_POSTCODE', {
  eafModuleId: 'MD1598490528',
  entityId: 'EN_142810819985990'
})
export class PostCodeMasterModel extends EAFModuleBase {
  @Field('SUBDISTRICT_CODE') public subdistrictCode: string;
  @Field('POSTCODE_ID') public postcodeId: string;
  @Field('POSTCODE') public postcode: string;
  @Field('STATUS') public status: string;
}