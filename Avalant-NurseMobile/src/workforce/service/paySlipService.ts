import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpRequestWFService } from './httpRequestWFService';

@Injectable()
export class PaySlipService {
    constructor(
        private httpReqWFService: HttpRequestWFService,
    ) {

    }

    public getPayRollPeriod(): Observable<any[]> {
        return this.httpReqWFService.getParamsService("/payroll/period");
    }

    public getPayRollSlip(_businessPeriodNo: string): Observable<any[]> {
        return this.httpReqWFService.getParamsService("/payroll/payslip", { 'businessPeriodNo': _businessPeriodNo });
    }

}
