import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
@Table('ORGANIZATION_PAYMENT_METHOD', {
    eafModuleId: 'MD1171526187', entityId: 'EN_170608151527589_v001'
})
export class PaymentMethodModel extends EAFModuleBase {

    @Field('ORG_PAYMENT_ID') public orgPaymentID: string;
    @Field('ORG_ID') public orgID: string;
    @Field('PAYMENT_METHOD_CODE') public paymentMethodCode: string;
    @Field('PAYMENT_TYPE_NAME') public paymentTypeName: string;

}