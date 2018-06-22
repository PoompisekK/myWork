import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpRequestWFService } from './httpRequestWFService';

@Injectable()
export class BenefitService {
    constructor(
        private httpReqWFService: HttpRequestWFService,
    ) { }

    private postBenefitService(contextService: string, addtionalParam?: { [key: string]: any }, isFormData?: boolean | false): Observable<any> {
        return this.httpReqWFService.postParamsService("/benefit/" + contextService, addtionalParam, isFormData);
    }

    private getBenefitService(contextService: string, addtionalParam?: { [key: string]: any }): Observable<any[]> {
        return this.httpReqWFService.getParamsService("/benefit/" + contextService, addtionalParam);
    }

    public getBenefitSummaryList(): Observable<any[]> {
        return this.getBenefitService("summary");
    }

    public getBenefitSummaryDetail(reqBody: { benefitType: string }): Observable<any[]> {
        return this.getBenefitService("detail", reqBody);
    }

}
