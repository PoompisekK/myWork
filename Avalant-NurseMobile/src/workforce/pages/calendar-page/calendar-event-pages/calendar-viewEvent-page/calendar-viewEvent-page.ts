import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WorkforceService } from '../../../../service/workforceService';
import { EventModel } from '../../../../model/event.model';
import { GoogleMap } from '../../../google-map/google-map';
import { CalendarModel } from '../../../../model/calendar.model';
@Component({
    selector: 'calendar-viewEvent-page',
    templateUrl: 'calendar-viewEvent-page.html',
    styleUrls: ['/calendar-viewEvent-page.scss']
})
export class CalendarViewEventPage implements OnInit {
    private event: CalendarModel = new CalendarModel();
    private startDate:string;
    private endDate:string;
    private deadLine:string;

    constructor(
        public navCtrl: NavController,
        private workforceService: WorkforceService,
        private navParams: NavParams
    ) {
    }

    public ngOnInit() {
        this.event = this.navParams.get("event");
        if(this.event.assignType=='MEETING'){
            this.startDate  = this.event.startDate+" "+this.event.startTime;
            this.endDate =  this.event.targetDate+" "+this.event.targetTime;
        }else{
            this.deadLine =  this.event.targetDate+" "+this.event.targetDate;
        }
  
        // this.event.targetDateTime = new Date(this.assign.startDate+"T"+this.assign.startTime).toISOString();
        if (this.event) {
            console.log("this.event:", this.event);
        }

    }
    public goToGoogleMap() {
        this.navCtrl.push(GoogleMap, {
            seletedPlace: this.workforceService.seletedPlace,
            formPage: "leave"
        });
    }

}
