import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppNavConfig } from '../../../components/app-nav-header/app-nav-header.component';

import { UserProfilePage } from './user-profile/user-profile';
import { AppState } from '../../../../app/app.state';
import { AnimateCss } from '../../../../animations/animate-store';
import { HCMUserProfileRestService } from '../../../../services/userprofile/hcm-userprofile.service';
import { EmployeeSkillModel } from '../../../../model/hcm-user/hcm-employeeSkill.model';
import { HCMEAFRestService } from '../../../../services/eaf-rest/hcm-eaf-rest.service';

@Component({
    selector: 'skill-page',
    templateUrl: 'skill-page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class SkillPage {
    private isLoading: boolean = true;
    private skillData: any;

    constructor(
        private navCtrl: NavController,
        private appState: AppState,
        private hcmUserProfileService: HCMUserProfileRestService,
        private hcmEAFRestService: HCMEAFRestService,
    ) {

    }

    private ionViewWillEnter() {
        this.hcmEAFRestService.getModule(EmployeeSkillModel).subscribe((resp) => {
            console.log("EmployeeConditionModel: ", resp);
            if (resp != null) {
                this.skillData = resp;
                this.isLoading = false;
            }else {
                this.skillData = "";
                this.isLoading = false;
            }
        });
    }
    private PAGE_COMP = {
    }


}
