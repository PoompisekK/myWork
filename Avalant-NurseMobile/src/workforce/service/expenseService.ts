import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpRequestWFService } from './httpRequestWFService';
import { LocalStorageService } from 'ngx-Webstorage';
import { AppState } from '../../app/app.state';

@Injectable()
export class ExpenseService {
    private _expenseTypeLists: any[] = [];
    constructor(
        private localStorage: LocalStorageService,
        private appState: AppState,
        private httpReqWFService: HttpRequestWFService,
    ) {
        this.loadExpenseType();
    }

    public get expenseTypeList(): any[] {
        return this._expenseTypeLists;
    }

    private postService(contextService: string, addtionalParam?: { [key: string]: any }, isFormData?: boolean | false): Observable<any> {
        return this.httpReqWFService.postParamsService(contextService, addtionalParam, isFormData);
    }

    private getService(contextService: string, addtionalParam?: { [key: string]: any }): Observable<any[]> {
        return this.httpReqWFService.getParamsService(contextService, addtionalParam);
    }

    //HCMRestService/expense/'expenseRequestNo'
    public getExpenseItemDetail(expenseRequestNo: string): Observable<any[]> {
        return this.getService("/expense/" + expenseRequestNo);
    }

    //HCMRestService/expense/history
    public getExpenseHistoryList(): Observable<any[]> {
        return this.getService("/expense/history");
    }

    //HCMRestService/expense/type
    public getExpenseType(): Observable<any[]> {
        return this.getService("/expense/type");
    }

    public getExpenseMasterStatus(): Observable<any[]> {
        return this.getService("/master/status/EXPENSE");
    }

    //HCMRestService/project/1
    public getProjectList(): Observable<any[]> {
        return this.getService("/project/1");
    }

    //HCMRestService/expense/approved
    public postApproveExpense(reqBody: { approveNo: string, approveOrderNo: string }): Observable<any[]> {
        return this.postService("/expense/approved", reqBody, true);
    }

    //HCMRestService/expense/rejected
    public postRejectExpense(reqBody: { approveNo: string, approveOrderNo: string | number, reason: string }): Observable<any[]> {
        return this.postService("/expense/rejected", reqBody, true);
    }

    //HCMRestService/expense/create : FormData
    public createExpense(reqBody: ExpenseModel): Observable<any | string> {
        return this.postService("/expense/create", reqBody, true);
    }

    //HCMRestService/expense/update-status
    public updateExpenseStatus(reqBody: any): Observable<any | string> {
        return this.postService("/expense/update-status", reqBody, true);
    }

    private loadExpenseType() {
        console.log("Begin loading ExpenseType");
        this.getExpenseType().subscribe((resp) => {
            this._expenseTypeLists = (resp && resp).filter(existItm => existItm.expenseGroupCode == 'EXPENSE');
            console.log("End load ExpenseType :", this._expenseTypeLists);
        });
    }

    public getExpenseTypeName(_expenseTypeCode: string): string {
        const expenseTypeM = this._expenseTypeLists.find(itm => itm.expenseCode == _expenseTypeCode);
        return expenseTypeM && expenseTypeM.expenseName;
    }

    public getExpenseImageTypeByCode(_expenseTypeCode: string): string {
        if (_expenseTypeCode == 'ETM0001') {
            return "./assets/img/svg/traveling.svg";
        } else if (_expenseTypeCode == 'ETM0002') {
            return "./assets/img/svg/office.svg";
        } else if (_expenseTypeCode == 'ETM0003') {
            return "./assets/img/svg/overtime.svg";
        } else if (_expenseTypeCode == 'ETM0006') {
            return "./assets/img/svg/telephone.svg";
        } else if (_expenseTypeCode == 'ETM0007') {
            return "./assets/img/svg/detalcare.svg";
        } else if (_expenseTypeCode == 'ETM0008') {
            return "./assets/img/svg/wellness.svg";
        } else {
            return null;
        }
    }
}

export class ExpenseModel {
    public userId: string;// "aa",
    public employeeCode: string;// "340248",
    public projectId: string;// "340248",
    public expenseType: string;// "ETM0003",
    public groupCode: string;// "EXPENSE",
    public reason: string;// "bla bla bla",
    public invoiceDate: string;// "2017-12-12",
    public totalAmount: string;// "35400",
    public files: any[];// [],
    public organizationId: string | number;// 2
}

/**
 * รายละเอียดโดยประมาน 
 * field คร่าวๆ มีอะไรเพิ่ม/ลบ ก็ใส่มาได้เลย เปลี่ยนชื่อได้
 * ถ้าเสจแล้วยังไง ส่งกลับมาให้ดูด้วย
 * 
 * ด้านล่างจะเป็น Model ใหม่ ด้านบนเป็น Model ของเก่า
 * แต่ก็ Extends มาใช้คร่าวๆ ไปก่อน
 */

export class ExpenseItemModel extends ExpenseModel {
    public typeCode: string;
    public expItmTypeDetail: string;
    public expItmTypeAmount?: number | string;
}

//create expense params คร่าวๆ
export class CreateParamsModel {
    public projectId: number | string;
    public expenseDetail: string;
    public expenseDate: Date | string;
    public expenseDateTime: string;
    public expenseItemList: ExpenseItemModel[];
}

//response params for expense list
export class ResponseObjectModel extends CreateParamsModel {
    public expenseId: string | number;
    public projectId: string | number;
    public projectName?: string;
    public status: string | number;
    public totalAmt: number | string;
    public approverCode?: string;
    public approverName?: string;
    public invoiceDate: Date | string;
}