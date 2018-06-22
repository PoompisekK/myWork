module EXPENSE_STATUS {//TASK
    export const DRAFT: string = "EXPS0000";//Draft
    export const SUBMIT: string = "EXPS0001";//Submit
    export const APPROVED: string = "EXPS0002";//Approved
    export const REJECT: string = "EXPS0003";//Reject
    export const PAY: string = "EXPS0004";//Pay
}
module ASSIGNMENT_STATUS {//TASK
    export const OPEN: string = "S0006";
    export const ONPROCESS: string = "S0007";
    export const DONE: string = "S0008";
    export const CANCEL: string = "S0030";
    export const COMPLETE: string = "S0031";
    export const ACCEPTED: string = "S0028";
    export const DENIED: string = "S0029";
}

export class HCMConstant {
    public static readonly AssignmentStatus = ASSIGNMENT_STATUS;
    public static readonly ExpenseStatus = EXPENSE_STATUS;

}
