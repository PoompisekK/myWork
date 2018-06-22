import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Subject } from 'rxjs';

import { AnimateCss } from '../../../animations/animate-store';
import { AppState } from '../../../app/app.state';
import { AppConstant } from '../../../constants/app-constant';
import { StringUtil } from '../../../utilities/string.util';
import { MeetingService } from '../../service/meetingService';
import { InspectionTypesPage } from './inspection-types/inspection-type.page';

@Component({
    selector: 'patients-acuity-evaluation',
    templateUrl: 'patients-acuity-evaluation.page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class PatientAcuityEvaluationPage implements OnInit {
    private employeeList: any[] = [];
    private displayEmployeeList: any[] = [];
    private inputSearch: Subject<string> = new Subject();
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public meettingService: MeetingService,
        public appState: AppState,
    ) { }
    private isLoading: boolean = true;
    public ngOnInit(): void {
        this.getAllEmployeeMember();
        this.inputSearch.debounceTime(AppConstant.APP_DEBOUNCE_SEARCH_TIME).subscribe((searchText) => {
            if (!StringUtil.isEmptyString(searchText) && (searchText || "").length >= 3) {
                this.displayEmployeeList = this.employeeList.filter((itm) => {
                    let text = JSON.stringify(itm).toLowerCase();
                    return text.indexOf((searchText || '').toLowerCase()) > -1;
                });
                console.log("search result length :", this.displayEmployeeList.length);
            } else {
                this.displayEmployeeList = this.employeeList;
            }
        });
    }

    private getAllEmployeeMember() {
        this.meettingService.getAllEmployee("").subscribe((resp: any[]) => {
            (resp || []).sort((item1, item2) => {
                let text1 = ((item1 || {}).name || '').toLowerCase();
                let text2 = ((item2 || {}).name || '').toLowerCase();
                if (text1 > text2) {
                    return 1;
                } else if (text1 == text2) {
                    return 0;
                } else if (text1 < text2) {
                    return -1;
                }
            });

            let _resp = [];
            for (let eIdx = 0; eIdx < (resp || []).length; eIdx++) {
                const element = (resp || [])[eIdx];
                if (element.employeeCode != this.appState.employeeCode) {
                    _resp.push(element);
                }
            }
            resp = _resp;

            setTimeout(() => {
                this.employeeList = resp;
                this.displayEmployeeList = resp;
                console.log("getAllEmployee:", resp);
                this.isLoading = false;
            }, 750);
        });
    }

    private selectEmployee(_emp: any) {
        console.log("click selectEmployee :", _emp);
        (this.employeeList || []).forEach((itm) => {
            itm.isCheck = (_emp.employeeCode === itm.employeeCode);
        });

        this.selectMember();
    }

    private selectMember() {
        let selectedList = (this.employeeList || []).filter(itm => itm.isCheck == true);
        console.log("selectedList:", selectedList);
        let patienData: PatientParamsData = {
            "patientUserData": selectedList
        };
        this.navCtrl.push(InspectionTypesPage, patienData, { animate: true, direction: "forward" });
    }
}
export class PatientParamsData {
    public patientUserData?: any;
    public inspectType?: string;
    public inspectQuestion?: any;
}
