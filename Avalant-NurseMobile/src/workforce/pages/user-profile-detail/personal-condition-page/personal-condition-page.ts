import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as moment from 'moment';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppState } from '../../../../app/app.state';
import { EmployeeConditionModel } from '../../../../model/hcm-user/hcm-employeeCondition.model';
import { HCMEAFRestService } from '../../../../services/eaf-rest/hcm-eaf-rest.service';
import { HCMUserProfileRestService } from '../../../../services/userprofile/hcm-userprofile.service';

@Component({
    selector: 'personal-condition-page',
    templateUrl: 'personal-condition-page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class PersonalConditionPage {

    private isLoading: boolean = true;
    private condition: any;

    constructor(
        private navCtrl: NavController,
        private appState: AppState,
        private hcmUserProfileService: HCMUserProfileRestService,
        private hcmEAFRestService: HCMEAFRestService,
    ) {

    }

    private ionViewWillEnter() {
        this.hcmEAFRestService.getModule(EmployeeConditionModel).subscribe((resp) => {
        console.log("EmployeeConditionModel: ", resp);
            if (resp != null) {                
                this.condition = resp;
                this.isLoading = false;
            } else {
                this.condition = "";
                this.isLoading = false;
            }

        });
    }

    private PAGE_COMP = {
    };
}
