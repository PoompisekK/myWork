export class AssignmentModel {
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
        public assignTo: Array<string>;
        public picAssignee: string;
        public topicDesc: string;
        public listAssignResponsible: any[];
        public listAddAssign: any[];
        public listCancelAssign: any[];
        public listAddAttachmentFile: any[];
        public listRemoveAttachmentFile: any[];
        public files: any[] = [];

        // public listFiles:any[];
        public listImageURL: any[] = new Array<any>();
        public listAttachmentFile: any[] = new Array<any>();

        // public id:string;
        // public topic:string;
        // public detail:string;
        // public attachFile:any;
        // public deadLine:string;
        // public deadLineDate:string;
        // public deadLineTime:string;
        // public place = {
        //         coords:{
        //             lat:null,
        //             lng:null,
        //         },
        //         name:null
        // };
        // public assignTo:Array<string>;
        // public picAssignee:string = "assets/img/user.jpg";
}
// export class TaskAssignModel{
//         public responsibleCode:string;
//         public assignmentCode:string;
//         public assignType:string;
//         public assignStatus:string;
//         public assignDes:string;
//         public assignBy:string;
//         public placeDesc:string;
//         public latitude:string;
//         public longtitude:string;
//         public startDate:string;
//         public startTime:string;
//         public targetDate:string;
//         public targetTime:string;
//         public severityType:string;

// }
export class AssigneeModel {
        public employeeCode: string;
        public name: string;
        public surname: string;
        public alternateName: string;
        public alternateSurname: string;
        public perfix: string;
        public alternatePerfix: string;
}