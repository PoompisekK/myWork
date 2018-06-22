import {OrderAddressModel} from '../../model/my-order/order-address.model';
import {OrderLineModel} from '../../model/my-order/order-line.model';
import {OrderHeadModel} from '../../model/my-order/order-head.model';
import { Injectable } from '@angular/core';
import { HttpService } from '../http-services/http.service';
import { EAFRestService } from '../eaf-rest/eaf-rest.service';
import { AppState } from '../../app/app.state';
import { PaymentMethodModel } from '../../model/payment/payment-method.model';

@Injectable()
export class PaymentService {

    constructor(
        private httpService: HttpService,
        private eafRestService: EAFRestService,
        private appState: AppState
    ) { }

    public order: OrderHeadModel;
    public orderLines: OrderLineModel[];
    public orderAddresses: OrderAddressModel[];

    public getPaymentMethodFromOrgID(orgID: string) {
        return this.eafRestService.searchEntity(PaymentMethodModel, PaymentMethodModel.ENTITY_ID, { 'ORG_ID': orgID, 'LANGUAGE': this.appState.language });
    }
}