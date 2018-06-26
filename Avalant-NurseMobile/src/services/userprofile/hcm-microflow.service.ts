import { forwardRef, Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { AppState } from '../../app/app.state';
import { HCMEAFRestService } from '../eaf-rest/hcm-eaf-rest.service';

@Injectable()
export class HCMMicroFlowService {
    constructor(
        private appState: AppState,
        private http: Http,
        @Inject(forwardRef(() => HCMEAFRestService)) private hcmEAFRestService: HCMEAFRestService,
    ) { }

    public getSwapWith(_teamGroupNo: string): Observable<MicroFlowResponseModel> {
        return this.getMicroflowRest("swap_with", {
            "param_v_swap_with": {
                "as_date": moment().format("YYYY-MM-DD"),
                "team_group_no": _teamGroupNo 
            }
        }).map(resp => resp.json());
    }

    public getMicroflowRest(flowName: string, objectData: any): Observable<any> {
        return this.http.post("https://bdms.alworks.io/MicroflowRest/DoAction", { "flowName": flowName, "object": objectData });
    }
}
export class MicroFlowResponseModel {
    public exception: string;
    public flowId: string;
    public flowName: string;
    public responseObjectsMap: any;
    public responstring: string;
    public tId: string;
}