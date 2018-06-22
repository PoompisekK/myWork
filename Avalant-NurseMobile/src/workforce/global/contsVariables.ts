import { HCMRestApi } from '../../constants/hcm-rest-api';

export class ContsVariables {
    public static readonly HCMRestService = HCMRestApi.URL;

    public static readonly leaveConst = {
        leaveType: {
            sick: {
                code: "LV00000001",
                name: "ลาป่วย",
                nameEn: "Sick"
            },
            vacation: {
                code: "LV00000003",
                name: "ลาพักผ่อนประจำปี",
                nameEn: "Vacation"
            },
            business: {
                code: "LV00000005",
                name: "ลากิจ",
                nameEn: "Business"
            },
            other: {
                othersLeave: {
                    code: "OTHERS_LEAVE",
                    name: "ลาอื่นๆ",
                    nameEn: "Others"
                },
                forgetCard: {
                    code: "LV00000122",
                    name: "ลืมบัตร",
                    nameEn: "Forget card"
                },
                sickOverLeave: {
                    code: "LV00000127",
                    name: "ลาป่วยเกินสิทธิ์",
                    nameEn: "Sick Leave over limit"
                },
                forgetScanCard: {
                    code: "LV00000124",
                    name: "ลืมสแกนบัตร",
                    nameEn: "Forget card scan"
                },
                ordinationOver: {
                    code: "LV00000130",
                    name: "ลาอุปสมบทเกินสิทธิ์",
                    nameEn: "Ordination Leave over limit"
                },
                ordination: {
                    code: "LV00000008",
                    name: "ลาอุปสมบท",
                    nameEn: "Ordination Leave"
                },
                militaryService: {
                    code: "LV00000004",
                    name: "ลารับราชการทหาร",
                    nameEn: "Military Leave"
                },
                militaryServiceOver: {
                    code: "LV00000128",
                    name: "ลารับราชการทหารเกินสิทธิ์",
                    nameEn: "Military Leave over limit"
                },
                offSiteWork: {
                    code: "LV00000121",
                    name: "ปฏิบัติงานนอกสถานที่",
                    nameEn: "On-site work"
                },
                leaveEarly: {
                    code: "LV00000125",
                    name: "ขอผ่าน",
                    nameEn: "Leave early"
                },
                vaccination: {
                    code: "LV00000125",
                    name: "ลาทำหมัน",
                    nameEn: "Vaccination Leave"
                },
                training: {
                    code: "LV00000123",
                    name: "อบรม/สัมมนา",
                    nameEn: "Training"
                },
                absent: {
                    code: "ABSENT",
                    name: "ขาดงาน",
                    nameEn: "Absent",
                }
            }
        }

    };
    public static readonly leaveTypeName = {
        sick: "LV00000001",
        business: "LV00000005",
        vacation: "LV00000003",
        other: {
            forgetCard: "LV00000122",
            sickOverLeave: "LV00000127",
            forgetScanCard: "LV00000124",
            ordinationOver: "LV00000130",
            ordination: "LV00000008",
            militaryService: "LV00000004",
            militaryServiceOver: "LV00000128",
            offSiteWork: "LV00000121",
            leaveEarly: "LV00000125",
            vaccination: "LV00000129",
            training: "LV00000005",
            absent: "ABSENT"
        }
    };
    public static readonly googleKey = "AIzaSyCthFLrS4vVfsCL1eRTpH7PjF3NrFQRZsU";

    public static readonly StatusAssigment = {
        ACCEPTED: "S0028",
        CANCEL: "S0030",
        COMPLETE: "S0031",
        DENIED: "S0029",
        OPEN: "S0006",
        PROCESS: "S0007",
    };
    
    public static readonly typeFileUpload = {
        leave: "leave",
        assignMent: "assignment"
    };
}