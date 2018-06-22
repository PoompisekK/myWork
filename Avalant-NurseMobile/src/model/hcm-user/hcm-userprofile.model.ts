import { Field, Table } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

@Table('EMPLOYEE_PROFILE', {
    entityId: 'EN_180309153757593_v001',
    eafModuleId: 'MD1181630164',
})
export class EmployeeProfileModel extends EAFModuleBase {
    @Field("AGE") public age: any;
    @Field("ALTERNATE_NAME") public alternateName: any;
    @Field("ALTERNATE_SURNAME") public alternateSurname: any;
    @Field("BIRTH_DATE") public birthDate: any;
    @Field("DATE_OF_DEATH") public dateOfDeath: any;
    @Field("EMPLOYEE_CODE") public employeeCode: any;
    @Field("EMPLOYEE_STATUS") public employeeStatus: any;
    @Field("ETHNICITY") public ethnicity: any;
    @Field("GENDER") public gender: any;
    @Field("HEIGHT") public height: any;
    @Field("HIRING_DATE") public hiringDate: any;
    @Field("MARRIED_STATUS") public marriedStatus: any;
    @Field("NAME") public name: any;
    @Field("NATIONALITY") public nationality: any;
    @Field("ORGANIZE_ID") public organizeId: any;
    @Field("PASSING_PRO_DATE") public passingProDate: any;
    @Field("POSITION_DATE") public positionDate: any;
    @Field("PREFIX_CODE") public prefixCode: any;
    @Field("RELIGION") public religion: any;
    @Field("RESIGN_DATE") public resignDate: any;
    @Field("SURNAME") public surname: any;
    @Field("WEIGHT") public weight: any;
}
