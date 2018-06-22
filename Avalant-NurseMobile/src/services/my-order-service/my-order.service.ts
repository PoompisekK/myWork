import { Injectable } from '@angular/core';
import { EAFRestService } from '../eaf-rest/eaf-rest.service';
import { Observable } from 'rxjs';
import { OrderHeadModel } from '../../model/my-order/order-head.model';
import { AppState } from '../../app/app.state';
import { IEAFModuleModel } from '../../model/eaf-rest/eaf-module-model';
import { OrderLineModel } from '../../model/my-order/order-line.model';
import { BankModel } from '../../model/my-order/bank.model';
import { OrgBankModel } from '../../model/my-order/org-bank.model';
import { OrderStatusModel } from '../../model/my-order/order-status.model';
import { YbatMSConstantModel } from '../../model/zybat/ybat-MS-constant.model';

@Injectable()
export class MyOrderService {

  constructor(
    private eafRestService: EAFRestService,
    private appState: AppState
  ) { }

  public getOrderList(shopID: string, page: number): Observable<any> {
    return this.eafRestService.searchEntity(OrderHeadModel, OrderHeadModel.ENTITY_ID, { 'SHOPID': shopID, 'MEMBERID': this.appState.businessUser.id }, { page, volumePerPage: 10 });
  }

  public getOrderDetailList(orderID: string): Observable<any> {
    return this.eafRestService.getEntity(OrderHeadModel.ENTITY_ID, OrderHeadModel, { 'ID': orderID });
  }

  public getEventList(shopID: string): Observable<any> {
    return this.eafRestService.postManualServlet('getEventListByShopIdAndMemberId', null, {
      params: {
        language: this.appState.language,
        memberId: this.appState.businessUser.id,
        // language: 'EN',
        // memberId: '137',
        shopId: shopID
      }
    });
  }

  public getBankList(): Observable<any> {
    return this.eafRestService.searchEntity(BankModel, BankModel.ENTITY_ID);
  }

  public getBankListFromOrgID(): Observable<any> {
    return this.eafRestService.searchEntity(OrgBankModel, OrgBankModel.ENTITY_ID, { ORG_ID: this.appState.currentOrganizationId, STATUS: 'A', language: this.appState.language });
  }

  public getOrderStatusFromShopID(shopID: string): Observable<any> {
    if (shopID == '475' || shopID == '477') { //EVENT && COURSE
      return this.eafRestService.searchEntity(OrderStatusModel, OrderStatusModel.ENTITY_ID, { FIELD_ID: '301' });
    }
    else { //PRIVILEGE && DONATE && PRODUCT
      return this.eafRestService.searchEntity(OrderStatusModel, OrderStatusModel.ENTITY_ID, { FIELD_ID: '81' });
    }
  }

  public sendPaidInform(orderID: string, orderCode: string, value: string, imageKey: string, fromBank: string, toBank: string, paymentDate: string, hour: string, minute: string, accountNo: string): Observable<any> {
    return this.eafRestService.postManualServlet('Paidinform', null, {
      params: {
        orderCode: orderCode,
        orderid: orderID,
        amount: value,
        imagekey: imageKey,
        fromBank: fromBank,
        toBank: toBank,
        paymentDate: paymentDate,
        hour: hour,
        minute: minute,
        accountNo: accountNo
      }
    });
  }

  public getYbatConstantMaster(orgId: string, constant_name: string): Observable<any> {
    return this.eafRestService.searchEntity(YbatMSConstantModel, YbatMSConstantModel.ENTITY_ID, { ORG_ID: orgId, CONSTANT_NAME: constant_name });
  }

  public cancelOrder(orderHeadID: string): Observable<any> {
    return this.eafRestService.postManualServlet('cancelEventOrder', null, {
      params: {
        orderheadId: orderHeadID
      }
    });
  }
}