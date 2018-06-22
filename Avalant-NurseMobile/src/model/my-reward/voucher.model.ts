import { Table, Field, SubModel, Id, FieldType } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
// @Table('PRODUCT', {
//   eafModuleId: 'MD117100184',
//   entityId: 'EN_170405095846823_v001',
// })
export class VoucherModel extends EAFModuleBase {
        @Field('cardno')
        public cardno: string;
        @Field('cardno')
        public createdate: string;
        @Field('expiredate')
        public expiredate: string;
        @Field('cardstatus')
        public cardstatus: string;
         @Field('remark')
        public remark: string;
}