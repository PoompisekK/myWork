import { Component } from '@angular/core';
import { TranslationService } from 'angular-l10n';
import { NavController } from 'ionic-angular';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppState } from '../../../../app/app.state';
import { EmployeeLeaveSummaryModel } from '../../../../model/hcm-user/hcm-employeeLeaveSummary.model';
import { HCMEAFRestService } from '../../../../services/eaf-rest/hcm-eaf-rest.service';

@Component({
    selector: 'leave-summary-page',
    templateUrl: 'leave-summary-page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class LeaveSummaryPage {
    private isLoading: boolean = true;
    private summaryY: any[] = [];
    constructor(
        private appState: AppState,
        private navCtrl: NavController,
        private hcmEafRestService: HCMEAFRestService,
        private translationService: TranslationService,
    ) {

    }

    public ionViewDidEnter() {
        this.summaryY = [{
            title: 'Internal Training',
            total: '50',
            Pending: '5'
        },
        {
            title: 'Meeting',
            total: '256',
            Pending: '8'
        }];
        this.isLoading = false;
    }


}
