import { Injectable } from '@angular/core';
import { DatePicker as DatePickerNative } from '@ionic-native/date-picker';
import { ModalController } from 'ionic-angular';
import { DatePickerOption, DatePickerProvider } from 'ionic2-date-picker';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

import { AppServices } from '../app-services';

declare var DatePicker:any;

@Injectable()
export class CalendarDatePickerService {
  constructor(
    private appService: AppServices,
    private datePickerProvider: DatePickerProvider,
    private modalCtrl: ModalController,
  ) {

  }

  public getDisplayDateTimePicker(_currSelectedDate?: Date, _mode?: string | 'date' | 'time' | 'datetime', limitDate?: { min: Date | string, max: Date | string }): Observable<Date> {
    if (this.appService.isServeChrome()) {
      return this.showSampleCalendar();
    } else {
      return this.showNativeCalendar(_currSelectedDate, _mode, limitDate);
    }
  }

  private showNativeCalendar(curDate: Date, _mode: string, limitDate?: { min: Date | string, max: Date | string }): Observable<Date> {
    let options = {
      date: (curDate ? new Date(curDate) : null) || new Date(),
      mode: _mode || 'date',//  'date','time','datetime'
      androidTheme: 5,
      allowOldDates: true,
      allowFutureDates: true,
      minDate: limitDate && limitDate.min || '',
      maxDate: limitDate && limitDate.max || '',
      doneButtonLabel: 'Ok',
      cancelButtonLabel: 'Cancel',
      // doneButtonColor: '#F2F3F4',
      // cancelButtonColor: '#000000'
    };
    console.log("showNativeCalendar options:", options);

    return Observable.create((observer) => {
      DatePicker.show(options)
        .then((resultDate) => {
          observer.next(resultDate);
          observer.complete();
        }, (error) => {
          observer.error(error);
          observer.complete();
        });
    });
  }

  private showSampleCalendar(): Observable<Date> {
    let datePickerOption: DatePickerOption = {
      minimumDate: new Date(), // the minimum date can be selectable
      maximumDate: new Date(), // the maximum date can be selectable
    };
    return Observable.create((observer) => {
      this.datePickerProvider.showCalendar(this.modalCtrl, datePickerOption)
        .subscribe((dateResult) => {
          observer.next(dateResult);
          observer.complete();
        });
    });
  }

  public static DateFormat(_date: Date, _formatType: string): string {
    return moment(_date).format(_formatType);
  }
}