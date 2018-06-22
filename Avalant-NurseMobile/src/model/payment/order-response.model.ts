import { IEAFManualModelBase } from '../eaf-rest/eaf-manual-model-base';

/**
 * Order Response model for Tamma Manual servlet
 * 
 * @author NorrapatN
 * @since Thu Jul 06 2017
 */
export interface IOrderResponse extends IEAFManualModelBase {
  orderAddresses: any[];
  orderhead: IOrderHeadResponse;
  orderlines: IOrderLine[];
  responseStatus: string;
  responseCode: string;
  taxInvoiceHead: ITaxInvoiceHead;
}

export interface IOrderHeadResponse extends IEAFManualModelBase {
  ADDRESS: string;
  COUPON_DISCOUNT: number;
  CUSTFNAME: string;
  CUSTLNAME: string;
  CUSTOMER_TYPE: string;
  DISTRICT_CODE: string;
  EMAIL: string;
  ID: number;
  ITEMAMT: number;
  MEMBERID: number;
  MOBILE: string;
  ENTAMT: number;
  ORDERCODE: string;
  ORDERDATE: string;
  ORDERSTATUS: number;
  ORD_ID: number;
  PHONE: string;
  POSTCODE: string;
  PRIVILEGE_DISCOUNT: number;
  PROMO_DISCOUNT: number;
  PROVINCEID: string;
  SHIPPINGAMT: number;
  SHOPID: number;
  STATUS_CODE: string;
  SUBDISTRICT_CODE: string;
  TOTALAMT: number;
  VATAMT: number;
  ZIPCODE: string;
}

export interface IOrderLine extends IEAFManualModelBase {
  ID: number;
  DISCOUNT_PRICE: number;
  LINEDESC: string;
  LINEPRICE: number;
  LINESTATUS: number;
  LINETYPE: number;
  ORDERID: number;
  PRODUCTPRICE: number;
  PURCHASETYPE: number;
  SEQNO: number;
  VAT_PRICE: number;
  PROMO_DISCOUNT: number;
  PRIVELEGE_DISCOUNT: number;
  COUPON_DISCOUNT: number;
  BUILDING: string;
  WAIT_SEQ: number;
  BARCODE: string;
  EVENT_STATUS: string;
  BUSINESS_USER_ID: number;

}

export interface ITaxInvoiceHead extends IEAFManualModelBase {
  invoiceNo: string;
  orderheadId: number;
  taxInvoiceId: number;
  taxinvoiceNo: string;
}
