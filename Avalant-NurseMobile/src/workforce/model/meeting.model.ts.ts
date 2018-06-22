export class MeetingModel {
        public responsibleCode: string;
        public assignmentCode: string;
        public assignType: string;
        public assignStatus: string;
        public assignDesc: string;
        public assignBy: string;
        public placeDesc: string;
        public latitude: string;
        public longitude: string;
        public startDateTime: string;
        public startDate: string;
        public startTime: string;
        public targetDateTime: string;
        public targetDate: string;
        public targetTime: string;
        public severityType: string;
        public invite: Array<string>;
        public listAssignResponsible: Array<any>;
        public picAssignee: string = "assets/img/user.jpg";
        public listAddAssign: any[];
        public listCancelAssign: any[];
        public listImageURL: any[];
        public listAttachmentFile: any[];
        public topicDesc: string;
}
export class AttendeeModel {
        public employeeCode: string;
        public name: string;
        public surname: string;
        public alternateName: string;
        public alternateSurname: string;
        public perfix: string;
        public alternatePerfix: string;
}