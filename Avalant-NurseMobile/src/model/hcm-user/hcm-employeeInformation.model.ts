import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('V_EMPLOYEE_INFORMATION_2', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD1181542311',
})
export class EmployeeInformationViewModel extends EAFModuleBase {
    @Field("CERTIFICATE_DATE") private certificateDate: string;
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("FULL_N_EN") private fullNEn: string;
    @Field("FUNCTION_LEVEL_NAME") private functionLevelName: string;
    @Field("FUNCTION_NAME") private functionName: string;
    @Field("MANAGER_FULL_NAME") private managerFullName: string;
    @Field("NODE_LEVEL_1") private nodeLevel_1: string;
    @Field("NODE_LEVEL_2") private nodeLevel_2: string;
    @Field("NODE_LEVEL_3") private nodeLevel_3: string;
    @Field("ORGANIZE_ID") private organizeId: string;
    @Field("PO_NAME") private poName: string;
}
