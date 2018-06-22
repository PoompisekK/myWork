import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';

@Table('ORDER_PAYMENT', {
    eafModuleId: 'MD1171751784', entityId: 'EN_170428162525819_v001'
})
export class OrderPaymentModel extends EAFModuleBase {

    @Field('DISPLAY_TEXT') public displayText: string;
    @Field('ORDER_HEAD_ID') public orderHeadId: string;
    @Field('ORDER_PAYMENT_ID') public orderPaymentId: string;
    @Field('PAYMENT_AMOUNT') public paymentAmt: string;
    @Field('PAYMENT_TYPE_NAME') public paymentTypeName: string;

    constructor() {
        super();
    }
}