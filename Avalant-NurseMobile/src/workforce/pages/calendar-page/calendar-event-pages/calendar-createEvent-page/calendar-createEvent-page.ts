import { Component, OnInit,ViewChild } from '@angular/core';
import { NavController,Slides } from 'ionic-angular';
import { LoginPage } from '../../../login/login-page';
import { TimeLine } from '../../../timeline/timeline';
import { NotiPage } from '../../../noti-page/noti-page';
import { EventModel } from '../../../../model/event.model';
import { WorkforceService } from '../../../../service/workforceService';
import { GoogleMap } from '../../../google-map/google-map';
import { WorkForceHomePage } from '../../../workforce-home/workforce-home.page';

@Component({
  selector: 'calendar-createEvent-page',
  templateUrl: 'calendar-createEvent-page.html'
})
export class CalendarCreateEventPage implements OnInit{
  private events:EventModel[] = new Array<EventModel>();
  private optionEvents = [];
  private nonActiveImg = ["assets/img/meeting.png","assets/img/assignment.png"];
  private activeImg = ["assets/img/meeting-selected.png","assets/img/assignment-active.png"];
  @ViewChild('slides') 
  private slides:Slides;
  constructor(
    public navCtrl: NavController,
    private workforceService:WorkforceService
  ) {

  }
  public ngOnInit(){

      this.optionEvents = [{type:"meeting",name:"Meeting",path:this.activeImg[0]},{type:"assignment",name:"Assignment",path:this.nonActiveImg[1]}];
      for(let i=0;i<2;i++){
        let event = new EventModel();
        event.type = this.optionEvents[i].type;
        this.events.push(event);
      }
  }
  public ionViewWillEnter(){
    if(this.workforceService.seletedPlace){
      this.events[this.slides.getActiveIndex()].place = this.workforceService.seletedPlace;
    }
  }
  // goToCalendar2(params) {
  //   if (!params) params = {};
  //   this.navCtrl.push(CalendarPage2);
  // }
  public goToHome(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(WorkForceHomePage);
  }
  public goToNotiPage(params) {
    if (!params) params = {};
    this.navCtrl.push(NotiPage);
  }
  private seletedOption(seletedIndex){
    for(let index=0;index<this.optionEvents.length;index++){
      if(index == seletedIndex){
        this.optionEvents[seletedIndex].path  = this.activeImg[seletedIndex];
        this.slides.slideTo(seletedIndex);
      }else{
        this.optionEvents[index].path =   this.nonActiveImg[index];
      }
    }

  }
  private slideChanged(){
    for(let index=0;index<this.optionEvents.length;index++){
      if(index == this.slides.getActiveIndex()){
        this.optionEvents[this.slides.getActiveIndex()].path  = this.activeImg[this.slides.getActiveIndex()];
      }else{
        this.optionEvents[index].path =   this.nonActiveImg[index];
      }
    }
  }
  private createEvent(){
    this.workforceService.saveEventCalendar(this.events[this.slides.getActiveIndex()]);
    console.log(this.events[this.slides.getActiveIndex()]);
    this.navCtrl.pop();
  }
  private goToGoogleMap(){
    this.navCtrl.push(GoogleMap,{
      seletedPlace : this.workforceService.seletedPlace
    });
  }
}
