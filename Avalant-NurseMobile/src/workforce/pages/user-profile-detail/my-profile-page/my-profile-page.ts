import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppState } from '../../../../app/app.state';
import { EmployeeInformationViewModel } from '../../../../model/hcm-user/hcm-employeeInformation.model';
import { EmployeeProfileModel } from '../../../../model/hcm-user/hcm-userprofile.model';
import { HCMEAFRestService } from '../../../../services/eaf-rest/hcm-eaf-rest.service';
import { HCMUserProfileRestService } from '../../../../services/userprofile/hcm-userprofile.service';

@Component({
    selector: 'my-profile-page',
    templateUrl: 'my-profile-page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class MyProfilePage {
    private isLoading: boolean = true;
    private profileItm: any = {};

    constructor(
        private navCtrl: NavController,
        private hcmUserProfileService: HCMUserProfileRestService,
        private hcmEAFRestService: HCMEAFRestService,
        private appState: AppState
    ) {

    }

    private ionViewWillEnter() {
        this.hcmUserProfileService.getHCMUser().subscribe(userResp => {
            console.log("ionViewDidEnter getHCMUser:", userResp);
            let employeeProfile = this.hcmEAFRestService.getDataByHCMClassMapping(userResp, EmployeeProfileModel);
            console.log("EmployeeProfileModel:", employeeProfile);
            let employeeInformation = this.hcmEAFRestService.getDataByHCMClassMapping(userResp, EmployeeInformationViewModel);
            console.log("EmployeeInformationViewModel: ", employeeInformation);

            this.profileItm = {
                name: employeeProfile.name ,
                surname: employeeProfile.surname,
                hospital: employeeInformation.nodeLevel_1,
                position: employeeInformation.poName,
                job: employeeInformation.functionName,
                job_level: employeeInformation.functionLevelName,
                department: employeeInformation.nodeLevel_3,
                managerName: employeeInformation.managerFullName,
                certificateD: employeeInformation.certificateDate,
            };
            console.log('certificateDate: ' , this.profileItm.certificateD);
            this.isLoading = false;
        });
    }

    private checkEmptyInf(_inf){
        if(_inf == null || _inf == "" || _inf == undefined ){
            return "";
        }else{
            return _inf;
        }
    }

    private PAGE_COMP = {
    };

    private goToProfile() {
        alert("Go to Profile page");

    }

}
