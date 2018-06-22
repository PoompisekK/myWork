import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ContsVariables } from '../global/contsVariables';
import { CalendarModel } from '../model/calendar.model';
import { HttpRequestWFService } from './httpRequestWFService';

@Injectable()
export class CalendarService {
    constructor(
        private httpReqWFService: HttpRequestWFService,
    ) {

    }
    public getCalendar(startDate: string): Observable<CalendarModel[]> {
        return this.httpReqWFService.getParamsService("/assign/getCalendar", { 'fromDate': startDate });
    }

    public getCalendarEvents(startDate: string): Observable<CalendarModel[]> {
        return this.httpReqWFService.getParamsService("/assign/event", { 'fromDate': startDate });
    }

    public getCalendarDay(startDate: string): Observable<CalendarModel[]> {
        return this.httpReqWFService.getParamsService("/assign/calendar-day", { 'date': startDate });
    }
}