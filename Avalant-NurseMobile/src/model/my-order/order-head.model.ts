import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field, SubModel, FieldType } from '../../services/eaf-rest/eaf-rest.decorators';
import { OrderLineModel } from './order-line.model';
import { OrderAddressModel } from './order-address.model';
import { OrderPaymentModel } from './order-payment.mode';
import { OrderDeliveryModel } from './order-delivery.model';

@Table('ORDERHEAD', {
  eafModuleId: 'MD1171626236', entityId: 'EN_170428162525819_v001'
})
export class OrderHeadModel extends EAFModuleBase {

  @Field('ID') public id: string;
  @Field('ORDERCODE') public orderID: string;
  @Field('CUSTFNAME') public fName: string;
  @Field('CUSTLNAME') public lName: string;
  @Field('TOTALAMT') public totalAmt: string;
  @Field('CREATE_DATE') public createDate: string;
  @Field('NETAMT', { fieldType: FieldType.NUMBER }) public netAmt: number;  
  @Field('ITEMAMT') public itemAmt: string;
  @Field('ORDERSTATUS') public orderStatus: string;
  @Field('ORDER_DATE') public orderDate: string;
  @Field('SHIPPINGAMT') public shippingAmt: string;
  @Field('ORDER_STATUS_NAME') public orderStatusName: string;
  @Field('SHIPPING_TYPE_NAME') public shippingTypeName: string;
  @Field('TRACKING_NO') public trackingNo: string;
  @Field('VATAMT') public vatAmt: string;
  @Field('PROMO_DISCOUNT') public promoDiscount: string;
  @Field('COUPON_DISCOUNT') public couponDiscount: string;
  @Field('PRIVELEGE_DISCOUN') public privelegeDiscount: string;

  @SubModel(OrderLineModel) public orderLineList: OrderLineModel[];
  @SubModel(OrderAddressModel) public orderAddressList: OrderAddressModel[];
  @SubModel(OrderPaymentModel) public orderPaymentList: OrderPaymentModel[];
  @SubModel(OrderDeliveryModel) public orderDeliveryList: OrderDeliveryModel[];

  constructor() {
    super();
  }
}