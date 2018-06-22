import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('ZYBAT_MS_CONSTANT', {
    eafModuleId: 'MD1171721650', entityId: 'EN_170529172044382_v001'
})
export class YbatMSConstantModel extends EAFModuleBase {

    @Field('CONSTANT_NAME: string') public constantName: string;
    @Field('STATUS: string') public status: string;
    @Field('ORG_ID: string') public orgID: string;
    @Field('CONSTANT_VALUE: string') public constantValue: string;
    @Field('CONSTANT_ID: string') public constantID: string;
    @Field('CONSTANT_DESC: string') public constantDesc: string;

    constructor() {
        super();
    }
}