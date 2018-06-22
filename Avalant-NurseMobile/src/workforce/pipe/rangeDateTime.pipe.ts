import { Pipe, PipeTransform } from '@angular/core';
import { EventModel } from '../model/event.model';
import { CalendarModel } from '../model/calendar.model';
@Pipe({ name: 'rangeDateTime'})
export class RangeDateTime implements PipeTransform  {
  constructor() {}
  public transform(event: CalendarModel,type:string) {
    let result ="";
    let startDateTime = new Date(event.startDate+"T"+event.startTime);
    let endDateTime = new Date(event.targetDate+"T"+event.targetTime);
    console.log(event.startDate);
    console.log(event.startTime);
        if(type=='date'){
            if(startDateTime.getDate()==endDateTime.getDate()){
                result = startDateTime.getDate().toString();
            }else{
                result = startDateTime.getDate().toString()+"-"+endDateTime.getDate().toString();
    
            }
        }else if(type=='time'){
            result = startDateTime.getHours().toString()+":"+startDateTime.getMinutes().toString()
            +" - "+endDateTime.getHours().toString()+":"+endDateTime.getMinutes().toString();
        }

        return result;
  }
}