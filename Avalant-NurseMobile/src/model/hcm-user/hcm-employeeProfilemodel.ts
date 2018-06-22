import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('EMPLOYEE_PROFILE', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD1181630164',
})
export class EmployeeProfileModel extends EAFModuleBase {
    @Field("AGE") private age: string;
    @Field("ALTERNATE_NAME") private alternateName: string;
    @Field("ALTERNATE_SURNAME") private alternateSurname: string;
    @Field("BIRTH_DATE") private birthDate: string;
    @Field("DATE_OF_DEATH") private dateOfDeath: string;
    @Field("EMPLOYEE_CODE") private employeeCode: string;
    @Field("EMPLOYEE_STATUS") private employeeStatus: string;
    @Field("ETHNICITY") private ethnicity: string;
    @Field("GENDER") private gender: string;
    @Field("HEIGHT") private height: string;
    @Field("HIRING_DATE") private hiringDate: string;
    @Field("MARRIED_STATUS") private marriedStatus: string;
    @Field("NAME") private name: string;
    @Field("NATIONALITY") private nationality: string;
    @Field("ORGANIZE_ID") private organizeId: string;
    @Field("PASSING_PRO_DATE") private passingProDate: string;
    @Field("POSITION_DATE") private positionDate: string;
    @Field("PREFIX_CODE") private prefixCode: string;
    @Field("RELIGION") private religion: string;
    @Field("RESIGN_DATE") private resignDate: string;
    @Field("SURNAME") private surname: string;
    @Field("WEIGHT") private weight: string;
}
