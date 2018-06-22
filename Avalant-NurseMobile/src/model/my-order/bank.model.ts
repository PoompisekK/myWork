import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';

@Table('MS_BANK_INFO', {
    eafModuleId: 'MD3391110364', entityId: 'EN_7641527298619'
})
export class BankModel extends EAFModuleBase {

    @Field('BANK_CODE') public bankCode: string;
    @Field('BANK_NAME') public bankName: string;
    @Field('V_STATUS') public status: string;
    @Field('KEY') public key: Object;

    constructor() {
        super();
    }
}