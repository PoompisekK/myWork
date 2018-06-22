import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';

@Table('ORGANIZATION_BANK_ACCOUNT', {
  eafModuleId: 'MD5790811942', entityId: 'EN_698944121666663'
})
export class OrgBankModel extends EAFModuleBase {

  @Field('BANK_CODE') public bankCode: string;
  @Field('BANK_NAME') public bankName: string;
  @Field('V_STATUS') public status: string;
  @Field('KEY') public key: Object;
  @Field('ACCOUNT_NAME') public accountName: string;
  @Field('BRANCH_CODE') public branchCode: string;
  @Field('BRANCH_NAME') public branchName: string;
  @Field('ACCOUNT_NO') public accountNo: string;
  
  constructor() {
    super();
  }
}