
export class LeaveModel {
    public leaveNo: string;
    public leaveTypeNo: string;
    public leaveTypeName: string;
    public leaveType: string;
    public leaveCode: string;
    public leaveDays: string;
    public leaveHours: string;
    public period: string;
    public fromDate: string;
    public toDate: string;
    public fromDateHalf: string;
    public toDateHalf: string;
    public fullDay: string;
    public status: string;
    public requestReason: string;
    public rejectReason: string;
    public recordDate: string;
    public shiftNameCode: string;
    public attachFile: any[] = [];
    public listAttachmentFile: any[] = [];
    public acknowledge: any[] = [];
    public urgentRequest: string = "N";
}
export class RequestLeaveModel {

    public acknowledge: string[] = [];
    public attachFile: string = "";//filesName
    public employeeCode: string;
    public employeeCodeRequest: string;
    public fromDate: string;
    public fromDateHalf: string;
    public leaveType: string;
    public organizationId: string;
    public reason: string;
    public toDate: string;
    public toDateHalf: string;
    public userId: string;
    public urgentRequest: string;
    public listAttachmentFile: string[];
}

export class LeaveSummaryInfo {
    public balanceDay: number;
    public carryForwardDay: number;
    public eligibleDay: number;
    public empCode: string;
    public leaveTypeName: string;
    public leaveTypeNo: string;
    public pendingDay: number;
    public usedDay: number;
}
export class LeaveTypeModel {
    public leaveTypeCode: string;
    public leaveTypeNo: string;
    public leaveTypeName: string;
    public remark: string;
    public balanceDay: number;
    public imgPath: string;
}