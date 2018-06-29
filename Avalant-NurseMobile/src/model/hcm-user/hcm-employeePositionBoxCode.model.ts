import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('MODULE_ID', {
    entityId: 'EN_180322105828567_v001',
    eafModuleId: 'MD1181059516',
})
export class EmployeePositionBoxCodeViewModel extends EAFModuleBase {
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("FULL_N_EN") private fullName: string;
    @Field("KEY") private key: any;
    @Field("POSITION_BOX_CODE") private positionBoxCode: string;
}
