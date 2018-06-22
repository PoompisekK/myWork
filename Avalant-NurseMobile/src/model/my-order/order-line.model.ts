import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field, SubModel } from '../../services/eaf-rest/eaf-rest.decorators';
import { OrderLineDetailModel } from './order-line-detail.model';

@Table('ORDERLINE', {
  eafModuleId: 'MD1171637788', entityId: 'EN_170428162525819_v001'
})
export class OrderLineModel extends EAFModuleBase {

  @Field('PRODUCTAMT') public productAmt: string;
  @Field('SEQNO') public seqNo: string;
  @Field('CARDID') public cardId: string;
  @Field('CARDVALUE') public cardValue: string;
  @Field('PRODUCT_ITEM_ID') public productItemId: string;
  @Field('CURRENCY_RATE') public currencyRate: string;
  @Field('IMAGE_KEY') public imageKey: string;
  @Field('SRCFILENAME') public srcFileName: string;
  @Field('SUM_PRICE') public sumPrice: string;
  @Field('PRODUCTPRICE') public productPrice: string;
  @Field('LINETYPE') public lineType: string;
  @Field('EVENT_STATUS') public eventStatus: string;
  @Field('ORDERID') public orderID: string;
  @Field('VIP_CODE') public vipCode: string;
  @Field('PURCHASETYPE') public purchaseType: string;
  @Field('LINEPRICE') public linePrice: string;
  @Field('ID') public id: string;
  @Field('LINEDESC') public lineDesc: string;
  @Field('ORDER_DERIVERY_ID') public orderDeriveryID: string;
  @Field('PRODUCT_IMAGE_KEY') public productImageKey: string;
  @SubModel(OrderLineDetailModel) public orderLineDetailModel: OrderLineDetailModel;
  constructor() {
    super();
  }
}