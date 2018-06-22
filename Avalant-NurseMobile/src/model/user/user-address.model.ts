import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { AddressModel } from './address.model';

//EN_151464391839460
@Table('USER_ADDRESS', {
  eafModuleId: 'MD9596983409',
  entityId: 'EN_151464391839460',
})
export class UserAddressModel extends EAFModuleBase {

  @Field('BUSINESS_USER_ID') public businessUserId: string;

  @Field('USER_ADDRESS_ID') public userAddressId: string; // key
  @Field('ADDRESS_ID') public addressId: string;
  @Field('ADDRESS_TYPE_ID') public addressTypeId: string;
  @Field('STATUS') public status: string;

  public address: AddressModel = new AddressModel();
  constructor(addressType?: string) {
    super();
    if (addressType) {
      this.addressTypeId = addressType;
    }
  }
}