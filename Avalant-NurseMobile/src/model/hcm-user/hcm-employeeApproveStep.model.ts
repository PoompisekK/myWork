import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('APPROVAL_FLOW', {
    entityId: 'EN_180524162923542_v001',
    eafModuleId: 'MD1181630935',
})
export class EmployeeApproveStepViewModel extends EAFModuleBase {
    @Field("KEY") private key: any;       
    @Field("STATUS") private status: string;
    @Field("DOCUMENT_NO") private documentNo: string;
    @Field("FULL_NAME") private fullName: string;
    @Field("JOB_LEVEL_NAME") private jobLeaveName: string;
    @Field("JOB_NAME") private jobName: string;
    @Field("POSITION_NAME") private positionName: string;
}
