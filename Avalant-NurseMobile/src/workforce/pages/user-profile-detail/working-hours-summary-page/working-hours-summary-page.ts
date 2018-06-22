import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppState } from '../../../../app/app.state';
import { EmployeeWorkingHoursModel } from '../../../../model/hcm-user/hcm-workingHours.model';
import { HCMEAFRestService } from '../../../../services/eaf-rest/hcm-eaf-rest.service';

@Component({
    selector: 'working-hours-summary-page',
    templateUrl: 'working-hours-summary-page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class WorkingHoursSummaryPage {
    private isLoading: boolean = true;
    private currMonth: Date = new Date();
    private employeeWorkingHours: EmployeeWorkingHoursModel = new EmployeeWorkingHoursModel;
    constructor(
        private navCtrl: NavController,
        private appState: AppState,
        private hcmEAFRestService: HCMEAFRestService,
    ) {

    }

    public ionViewDidEnter() {
        this.hcmEAFRestService.getModule(EmployeeWorkingHoursModel)
            .do(() => { this.isLoading = false; })
            .subscribe(respData => {
                if (respData != null) {
                    this.employeeWorkingHours = respData;
                }
                console.log("hcmEAFRestService EmployeeWorkingHoursModel:", this.employeeWorkingHours);
            });
    }
}
