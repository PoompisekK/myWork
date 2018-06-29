import { Component, ViewChild } from '@angular/core';
import { TranslationService } from 'angular-l10n';
import { NavController, Slides } from 'ionic-angular';
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
        this.taskListMonth = [
            { task: this.ckeckListMonth(moment(this.month).add(-1, "month").toDate()) },
            { task: this.ckeckListMonth(this.month) },
            { task: this.ckeckListMonth(moment(this.month).add(1, "month").toDate()) }
        ];
    }

    private dataTimeRec = [
        {
            date: '2018-06-28',
            timeIn: '08:00',
            timeOut: '17:40'
        },
        {
            date: '2018-06-27',
            timeIn: '08:10',
            timeOut: '17:41'
        },
        {
            date: '2018-06-26',
            timeIn: '07:30',
            timeOut: '17:30'
        },
        {
            date: '2018-05-25',
            timeIn: '08:12',
            timeOut: '18:00'
        },
        {
            date: '2018-05-24',
            timeIn: '09:00',
            timeOut: '19:45'
        },
        {
            date: '2018-05-23',
            timeIn: '08:00',
            timeOut: '17:40'
        },
        {
            date: '2018-05-25',
            timeIn: '08:12',
            timeOut: '18:00'
        },
        {
            date: '2018-05-24',
            timeIn: '09:00',
            timeOut: '19:45'
        },
        {
            date: '2018-04-23',
            timeIn: '08:00',
            timeOut: '17:40'
        }
    ];

    private checkLate(_time) {
        const date = moment(new Date()).format('YYYY-MM-DD');
        const time = moment(date + 'T' + _time).format('hmm');
        console.log('Time : ', parseInt(time));
        if (parseInt(time) > 800) {
            return this.hcmTranslationService.translate('M_TIMERECORDING.LATE', 'Late');
        } else {
            return this.hcmTranslationService.translate('M_TIMERECORDING.NORMAL_WORKING_DAY', 'Normal Working Day');
        }
    }
    private checkStyeLate(_time) {
        const date = moment(new Date()).format('YYYY-MM-DD');
        const time = moment(date + 'T' + _time).format('hmm');
        console.log('Time : ', parseInt(time));
        if (parseInt(time) > 800) {
            return true;
        } else {
            return false;
        }
    }
    
    @ViewChild("slidesDayView") private slidesDayView: Slides;
    private nextSlide() {
        this.slidesDayView.slideTo(2, 500);
    }
    private prevSlide() {
        this.slidesDayView.slideTo(0, 500);
    }    
    private month = moment(new Date()).add(-1, "month").toDate();    
    private taskListMonth = [];
    private loadPrev() {
        this.month = moment(this.month).add(-1, "month").toDate();       
        this.taskListMonth = [
            { task: this.ckeckListMonth(moment(this.month).add(-1, "month").toDate()) },
            { task: this.ckeckListMonth(this.month) },
            { task: this.ckeckListMonth(moment(this.month).add(1, "month").toDate()) }
        ];
        let newIndex = this.slidesDayView.getActiveIndex();
        console.log(newIndex);
        this.slidesDayView.slideTo(newIndex + 1, 0, false);// Workaround to make it work: breaks the animation
    }
    private loadNext() {
        this.month = moment(this.month).add(1, "month").toDate();       
        this.taskListMonth = [
            { task: this.ckeckListMonth(moment(this.month).add(-1, "month").toDate()) },
            { task: this.ckeckListMonth(this.month) },
            { task: this.ckeckListMonth(moment(this.month).add(1, "month").toDate()) }
        ];
        let newIndex = this.slidesDayView.getActiveIndex();
        console.log(newIndex);
        this.slidesDayView.slideTo(newIndex - 1, 0, false);// Workaround to make it work: breaks the animation
    }
   
    private ckeckListMonth(_month) {
        let listByMonth = [];
        this.dataTimeRec.forEach(element => {
            if (moment(element.date).format('MM') == moment(_month).format('MM')) {
                listByMonth.push(element);
            }
        });
        return listByMonth;
    }
}
