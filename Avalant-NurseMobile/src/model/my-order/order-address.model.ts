import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';

@Table('ORDER_ADDRESS', {
    eafModuleId: 'MD1171537511', entityId: 'EN_170428162525819_v001'
})
export class OrderAddressModel extends EAFModuleBase {

    @Field('ADDRESS_NAME') public addressName: string;
    @Field('COUNTRY') public country: string;
    @Field('DISTRICT') public district: string;
    @Field('HOUSE_NO') public houseNo: string;
    @Field('ORDER_ADDRESS_ID') public orderAddressId: string;
    @Field('ORDER_ID') public orderId: string;
    @Field('POSTCODE') public postCode: string;
    @Field('PROVINCE') public province: string;
    @Field('RECEIVE_NAME') public fName: string;
    @Field('RECEIVE_SURNAME') public lName: string;
    @Field('ROOM') public room: string;
    @Field('SOI') public soi: string;
    @Field('STREET') public street: string;
    @Field('SUBDISTRICT') public subDistrict: string;
    @Field('ADDRESS_NO') public addressNo: string;

    constructor() {
        super();
    }
}