import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

import { AnimateCss } from '../../../animations/animate-store';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { LeaveService } from '../../service/leaveService';

/**
* @author Bundit.Ng
* @since  Tue Feb 06 2018
* Copyright (c) 2018 Avalant Co.,Ltd.
*/

@Component({
  selector: 'events-calendar-comp',
  templateUrl: 'events-calendar-comp.html',
  animations: [
    AnimateCss.peek()
  ]
})
export class EventsCalendarPage {

  constructor(
    private appLoadingService: AppLoadingService,
    private platform: Platform,
    private leaveService: LeaveService,
  ) {
  }

  public ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.loadCalendar();
    });
  }

  private isLoading: boolean = true;
  private doRefresh(refresher) {
    // refresher
    this.appLoadingService.showLoading();
    this.loadCalendar(() => {
      refresher.complete();
    });
  }

  private loadCalendar(cb?: () => void, _typeIndex?: number) {
    if (!_typeIndex || _typeIndex == 0) {
      this.leaveService.getCalendarHistoryMy().subscribe(resp => {
        console.log("getCalendarHistoryMy :", resp);
        this.mapObjectDataEvents(resp).subscribe(respEvent => {
          this.createCalendar({ index: _typeIndex, data: respEvent }, cb);
        });
      });
    } else if (_typeIndex == 1) {
      this.leaveService.getCalendarHistorySubordinate().subscribe(resp => {
        console.log("getCalendarHistorySubordinate :", resp);
        this.mapObjectDataEvents(resp).subscribe(respEvent => {
          this.createCalendar({ index: _typeIndex, data: respEvent }, cb);
        });
      });
    }
  }
  private evenstList: any[] = [];

  private displayEvents(_evensts: any) {
    this.appLoadingService.showLoading();
    this.evenstList = [];
    setTimeout(() => {
      this.appLoadingService.hideLoading().then(() => {
        this.evenstList = _evensts.source && _evensts.source.origArray;
        console.log("this.evenstList : ", this.evenstList);
      });
    }, 750);
  }

  private createCalendar(_events: { index: number, data: any[] }, cb?: () => void): void {
    console.log("createCalendar :", _events);
    const calendatOpt = {
      defaultView: 'month',
      events: (_events.data || []),
      displayEventTime: false,
      eventClick: (event) => {
        console.log("eventClick event :", event);
        // this.displayEvents(event);
      },
      eventColor: '#378006',
      dayClick: (date, jsEvent, view) => {
        console.log('Date :', date.format(), ", jsEvent :", jsEvent, ", view :", view);
      }
    };
    jQuery('#calendarDiv' + (_events.index || 0)).fullCalendar(calendatOpt);

    setTimeout(() => {
      this.appLoadingService.hideLoading().then(() => {
        this.isLoading = false;
        cb && cb();
      });
    }, 750);
  }

  @ViewChild(Slides) private slides: Slides;

  private slideWillChange(): void {
    console.log("slideWillChange !!!");
  }

  private slideHasChanged(): void {
    console.info("slideHasChanged !!!");
    let indx: number = this.slides.getActiveIndex();
    console.log("indx :", indx);
    this.loadCalendar(() => {
      console.info("loadCalendar Completed !!!");
    }, indx);
  }

  private isActive(index: number): boolean {
    return index == this.slides.getActiveIndex();
  }

  private slideActive(index: number): void {
    this.slides.slideTo(index);
    // this.slides.st
  }

  private getColorOfDay(_evtItm: any): any {
    const textColor = "white black #A00 black white #00BFFF white".split(" ");
    const bgColor = "red yellow pink #7FFF7F #FF9900 #00BFFF #993399".split(" ");
    let dateTime = moment(_evtItm.start);
    _evtItm.color = bgColor[dateTime.day()];
    _evtItm.textColor = textColor[dateTime.day()];
    return _evtItm;
  }

  private mapObjectDataEvents(params: any[]): Observable<any[]> {
    let result: any[] = [];
    return Observable.create((observer) => {
      try {
        (params || []).forEach((item) => {
          let evtItm = item;
          evtItm.eventNo = item.leaveNo;
          evtItm.eventTypeNo = item.leaveTypeNo;
          evtItm.title = item.leaveType + " : " + item.empName;
          evtItm.start = item.fromDate;
          evtItm.end = item.toDate;
          evtItm = this.getColorOfDay(evtItm);
          result.push(evtItm);
        });
        observer.next(result);
      } catch (error) {
        console.error("error:", error);
        observer.error(error);
      }
    });
  }
}

// class EventItemModel {
//   "eventTypeNo": string;
//   "eventNo": string;
//   "title": string;
//   "start": string;
//   "end"?: string;
//   "color"?: string;
// }