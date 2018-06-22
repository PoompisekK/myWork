import {YBatUserMedicalAnswerInfoModel} from './ybat.user-medical-info.model';
import {YBatUserMedicalQuestionModel} from './ybat.user-medical-questions.model';
import {YBatUserContactInfoModel} from './ybat.user-contact-info.model';
import {YBatUserInfoModel} from './ybat.user-info.model';
import {AddressModel} from './address.model';
import {UserModel} from './user.model';

export class PersonalInfo {

    public eventPeriod: string;
    public eventStatus: string;
    public relationDesc: string;

    public attendeeType: string;
    public customerType: string;

    public validateFail: boolean;

    public userProfile: UserModel;
    public zybatUserInfo: YBatUserInfoModel;

    public homeAddress: AddressModel;
    public officeAddress: AddressModel;
    public documentAddress: AddressModel;

    public zybatUserContactInfos :YBatUserContactInfoModel[];
    public zybatUserContactInfoParent :YBatUserContactInfoModel;
    public zybatUserContactInfoEmergency :YBatUserContactInfoModel;

    public zybatUserMedicalInfos: YBatUserMedicalAnswerInfoModel[];
	public zybatMedicalQuestions: YBatUserMedicalQuestionModel[];
}