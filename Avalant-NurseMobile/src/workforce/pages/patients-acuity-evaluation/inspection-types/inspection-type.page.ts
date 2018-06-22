import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppState } from '../../../../app/app.state';
import { PatientParamsData } from '../patients-acuity-evaluation.page';
import { PatientsQuestionsPage } from '../patients-questions/patients-questions.page';

@Component({
    selector: 'inspection-type',
    templateUrl: 'inspection-type.page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class InspectionTypesPage implements OnInit {
    private patientParamsData: PatientParamsData;
    public ngOnInit(): void {
        this.patientParamsData = this.navParams.data;
        console.log("this.patientParamsData :", this.patientParamsData);
    }
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public appState: AppState,
    ) { }

    private menuList: MenuPage[] = [
        { page: PatientsQuestionsPage, name: "Warstle Model", iconSrc: "assets/img/svg/menu/approve_menu.svg" },
        { page: PatientsQuestionsPage, name: "Apache", iconSrc: "assets/img/svg/menu/leave_menu.svg" },
    ];

    public goRoot(pageDataM: MenuPage) {
        if (pageDataM && pageDataM.page) {
            console.log("pageDataM:", pageDataM);
            this.patientParamsData.inspectType = pageDataM.data;
            this.navCtrl.push(pageDataM.page, this.patientParamsData, { animate: true, animation: "", direction: "forward" });
        }
    }
}
class MenuPage {
    public page: any;
    public name: string;
    public iconSrc: string;
    public data?: any;
}