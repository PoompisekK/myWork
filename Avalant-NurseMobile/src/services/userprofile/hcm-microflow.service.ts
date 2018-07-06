import { forwardRef, Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { AppState } from '../../app/app.state';
import { HCMEAFRestService } from '../eaf-rest/hcm-eaf-rest.service';
import { WorkforceHttpService } from '../../workforce/service/workforceHttpService';

@Injectable()
export class HCMMicroFlowService {
    constructor(
        private appState: AppState,
        private http: Http,
        private wfHttpService: WorkforceHttpService,
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

    public getCalendar(_month: string, _year: string): Observable<MicroFlowResponseModel> {
        return this.getMicroflowRest("my_calendar", {
            "in_param_my_calen": {
                "p_employee_code": this.wfHttpService.employeeCode,
                "p_month": _month,
                "p_year": _year
            }
        }).map(resp => resp.json());
    }

    public getWorkGroupSchedule(_month: string, _year: string): Observable<MicroFlowResponseModel> {
        return this.getMicroflowRest("work_group_schedule_of_my_calendar", {
            "param_work_my_calendar": {
                "as_year": _year,
                "as_month": _month,
                "employee_code": this.wfHttpService.employeeCode
            }
        }).map(resp => resp.json());
    }

    public MyScheduleShiftSum(_month: string, _year: string): Observable<MicroFlowResponseModel> {
        return this.getMicroflowRest("MyScheduleShiftSum", {
            "schedule_param_shift": {
                "as_year": _year,
                "as_month": _month,
                "employee_code": this.wfHttpService.employeeCode
            }
        }).map(resp => resp.json());
    }

    public MyScheduleNoHoliday(_month: string, _year: string): Observable<MicroFlowResponseModel> {
        return this.getMicroflowRest("MyScheduleNoHoliday", {
            "schedule_param_holiday": {
                "as_year": _year,
                "as_month": _month,
                "employee_code": this.wfHttpService.employeeCode
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