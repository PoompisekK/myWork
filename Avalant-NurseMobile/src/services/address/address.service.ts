import { EAFRestService } from '../eaf-rest/eaf-rest.service';
import { UserAddressModel } from '../../model/user/user-address.model';
import { AppConstant } from '../../constants/app-constant';
import { EAFModelWithMethod } from '../../model/eaf-rest/eaf-model-with-method.model';
import { ResponseBaseModel } from '../../model/rest/response-base.model';
import { EAFRestApi } from '../../constants/eaf-rest-api';
import { TranslationService } from 'angular-l10n';
import { Injectable } from '@angular/core';
import { SessionStorage, LocalStorageService, SessionStorageService } from 'ngx-Webstorage';
import { Subject, Observable, Observer } from 'rxjs';
import { CartItem } from './cart-item.model';
import { CartEvent } from './cart.event';
import { HttpService } from '../http-services/http.service';
import { ObjectsUtil } from '../../utilities/objects.util';
import { AlertController } from "ionic-angular";
import { CartDetail } from "./cart-detail";
import { AddressModel } from "../../model/user/address.model";
import { StringUtil } from '../../utilities/string.util';

/**
 * A Shopping Cart Service
 * 
 * @author NorrapatN
 * @since Tue May 23 2017
 */
@Injectable()
export class AddressService {

  constructor(
    private httpService: HttpService,
    private eafRestService: EAFRestService,
    private translateService: TranslationService,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private alertCtrl: AlertController,
  ) {

  }

  public saveShippingAddress(address: AddressModel): Observable<ResponseBaseModel> {

    let process: any = ((address.addressId) ? 'UPDATE' : 'INSERT');

    return this.eafRestService.saveEntity(AddressModel.ENTITY_ID, [new EAFModelWithMethod(address, process)], {})
      .do(resp1 => {
        if (resp1.status == AppConstant.EAF_RESPONSE_CONST.StatusConstEAF.SUCCESS
          && process == "INSERT") {

          let tmpUserAddress = new UserAddressModel();
          tmpUserAddress.addressId = resp1['ADDRESS_ID'];
          tmpUserAddress.addressTypeId = address.addressTypeId;
          tmpUserAddress.businessUserId = address.businessUserId;
          tmpUserAddress.status = 'A';

          this.eafRestService.saveEntity(UserAddressModel.ENTITY_ID, [new EAFModelWithMethod(tmpUserAddress, 'INSERT')], {});
        }
      });
  }

  public updateAddress(addressModel: AddressModel): Observable<any> {
    return this.eafRestService.saveEntity(AddressModel.ENTITY_ID, [new EAFModelWithMethod(addressModel, this.getInsertUpdateByPrimaryKey(addressModel.addressId))], {});
  }

  private getInsertUpdateByPrimaryKey(key: string): 'INSERT' | 'UPDATE' {
    return StringUtil.isEmptyString(key) ? 'INSERT' : 'UPDATE';
  }

}
