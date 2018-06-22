import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';

@Table('ORGANIZATION_AUTHORIZE_METHOD', {
    eafModuleId: 'MD117182147', entityId: 'EN_170427180032514_v001'
})
export class AuthenticationAllowModel extends EAFModuleBase {

    @Field('AUTHEN_METHOD_CODE') public authCode: string;
    @Field('ORG_AUTHEN_ID') public orgAuthID: string;
    @Field('ORG_ID') public orgID: string;

    constructor() {
        super();
    }
}