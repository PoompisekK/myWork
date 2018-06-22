import { Field, Table, FieldType } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('PRODUCTREVIEW', {
    eafModuleId: 'MD1171645840',
    entityId: 'EN_170509164517274_v001'
})
export class ProductReviewModel extends EAFModuleBase {

    @Field('PRODUCTID') public productID: string;
    @Field('MEMBERID') public memberID: string;
    @Field('CUSTFNAME') public memberFName: string;
    @Field('CUSTLNAME') public memberLName: string;
    @Field('CREATE_DATE', {
        fieldType: FieldType.DATE
    }) public createDate: string;
    @Field('REVIEWDESC') public reviewDesc: string;
    @Field('REVIEWSTATUS') public reviewStatus: string;
    @Field('SOCIALPICPROFILE') public memberPic: string;

}