import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('MODULE_ID', {
    entityId: 'EN_180227144257818_v001',
    eafModuleId: 'MD1181447302', // or MD1181443880
})
export class EmployeeTargetShiftModel extends EAFModuleBase {
    @Field("DESCRIPTION") private description: string;
    @Field("KEY") private key: any;
    @Field("SHIFT_NAME_CODE") private shiftNameCode: string;
    @Field("SHIFT_NAME_NAME") private shiftNameName: string;   

}