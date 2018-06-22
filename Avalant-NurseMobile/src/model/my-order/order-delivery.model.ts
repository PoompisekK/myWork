import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';

@Table('ORDER_DELIVERY', {
    eafModuleId: 'MD1171333258', entityId: 'EN_170428162525819_v001'
})
export class OrderDeliveryModel extends EAFModuleBase {

    @Field('TRACKING_NO') public trackingNo: string;
    @Field('SHIPPING_TYPE_ID') public shippingTypeId: string;
    @Field('ORDER_DELIVERY_ID') public orderDeliveryId: string;

    constructor() {
        super();
    }
}