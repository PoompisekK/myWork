import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import * as moment from 'moment';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppState } from '../../../../app/app.state';
import { WorkForceHomePage } from '../../workforce-home/workforce-home.page';
import { PatientParamsData } from '../patients-acuity-evaluation.page';

@Component({
    selector: 'assessment-summary',
    templateUrl: 'assessment-summary.page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class AssessmentSummaryPage implements OnInit {
    private patientUserData: any;
    private patientParamsData: PatientParamsData;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public appState: AppState,
    ) { }

    private dateTime = moment(new Date()).format("YYYY-MM-DD");
    public ngOnInit(): void {
        this.patientParamsData = this.navParams.data;
        console.log("this.patientParamsData :", this.patientParamsData);
        this.patientUserData = this.patientParamsData.patientUserData && this.patientParamsData.patientUserData.length > 0 && this.patientParamsData.patientUserData[0];
        console.log("this.patientUserData :", this.patientUserData);

        console.log("Date & Time => " , this.dateTime);
    }

    private completeAcuity() {
        console.log("getViews:", this.navCtrl.getViews());
        let targetView = this.navCtrl.getViews().filter(view => view.name == 'PatientAcuityEvaluationPage');
        console.log("targetView:", targetView);
        if (targetView.length && targetView.length > 0) {
            this.navCtrl.popTo(targetView.shift());
        } else {
            this.navCtrl.setRoot(WorkForceHomePage, {}, { animate: true, direction: "forward" });
        }
    }
}
