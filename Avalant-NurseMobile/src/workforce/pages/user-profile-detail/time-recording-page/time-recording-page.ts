import { Component } from '@angular/core';
import { TranslationService } from 'angular-l10n';
import { NavController } from 'ionic-angular';
import * as moment from 'moment';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppState } from '../../../../app/app.state';
import { HCMTranslationService } from '../../../modules/hcm-translation.service';

@Component({
    selector: 'time-recording-page',
    templateUrl: 'time-recording-page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class timeRecordingPage {

    constructor(
        private navCtrl: NavController,
        private appState: AppState,
        private translationService: TranslationService,
        private hcmTranslationService: HCMTranslationService,
    ) {

    }

    private dataTimeRec = [
        {
            date: '2018-02-28',
            timeIn: '08:00',
            timeOut: '17:40'
        },
        {
            date: '2018-02-27',
            timeIn: '08:10',
            timeOut: '17:41'
        },
        {
            date: '2018-02-26',
            timeIn: '07:30',
            timeOut: '17:30'
        },
        {
            date: '2018-02-25',
            timeIn: '08:12',
            timeOut: '18:00'
        },
        {
            date: '2018-02-24',
            timeIn: '09:00',
            timeOut: '19:45'
        },
        {
            date: '2018-02-23',
            timeIn: '08:00',
            timeOut: '17:40'
        }
    ];

    private checkLate(_time) {        
        const date = moment(new Date()).format('YYYY-MM-DD');
        const time = moment(date+'T'+_time).format('hmm');
        console.log('Time : ', parseInt(time));
        if (parseInt(time) > 800) {           
            return this.hcmTranslationService.translate('M_TIMERECORDING.LATE','Late');
        } else {
            return this.hcmTranslationService.translate('M_TIMERECORDING.NORMAL_WORKING_DAY','Normal Working Day');
        }
    }
}
