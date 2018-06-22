import { Table, Field, SubModel, Id, FieldType } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('PRODUCT', {
  eafModuleId: 'MD117957770',
  entityId: 'EN_170629095502861_v001',
})
export class PrivilegeModel extends EAFModuleBase {
        @Field('CREATE_DATE')
        public createDate: string;
        @Field('USER_PRIVILEGE_ID')
        public userPrivilegeId: string;
        @Field('PRIVILEGE_TYPE_NAME')
        public privilegeTypeName: string;
        @Field('IMAGE_KEY')
        public imageKey: string;
        @Field('ORIG_ID')
        public origId: string;
        @Field('PRODUCT_ID')
        public productId: string;
        @Field('KEY')
        public key: string;
        @Field('DATA')
        public data: string;
}