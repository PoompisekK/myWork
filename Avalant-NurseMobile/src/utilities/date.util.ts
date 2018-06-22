import { StringUtil } from './string.util';
/**
 * Date / Time Utilities
 * @author NorrapatN
 * @since Thu May 25 2017
 */
export class DateUtil {

  public static isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.valueOf());
  }

  /**
   * Create Date string formatted as pattern 'YYYY-MM-DD HH24:mm:ss'
   * @param dateObject Date
   * @param dateFormat DateFormat
   * @param delimiter Delimiter
   */
  public static formatDate(dateObject: Date,
    dateFormat: DateFormat = DateFormat.YYYY_MM_DD_HH24_mm_ss, delimiter: string = '-'): string {
    if (!DateUtil.isValidDate(dateObject)) {
      return null;
    }

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const date = dateObject.getDate();

    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();

    let result = '';
    let dateStr = '';
    let timeStr = '';

    // Switch for Date String
    switch (dateFormat) {
      case DateFormat.YYYY_MM_DD_HH24_mm_ss:
      case DateFormat.YYYY_MM_DD:
        dateStr = [year, month, date].join(delimiter);
        break;

      case DateFormat.DD_MM_YYYY:
        dateStr = [date, month, year].join(delimiter);
    }

    if (dateFormat === DateFormat.YYYY_MM_DD_HH24_mm_ss) {
      timeStr = [hours, minutes, seconds].join(':');
    }

    return dateStr + ' ' + timeStr;
  }

  /**
  * @author Bundit.Ng
  * @since  Tue Jun 13 2017
  * Copyright (c) 2017 Avalant Co.,Ltd.
  *
  * calculateAgeFromBirthDate
  * @return number Age, That's calculate from input date
  * @param birthDate string (yyyy-mm-dd)
  */
  public static calculateAgeFromBirthDate(birthDateInput: string, language?: string): number {
    if (!StringUtil.isEmptyString(birthDateInput)) {
      let today = new Date();
      let birthDate = new Date(birthDateInput);
      // if (!StringUtil.isEmptyString(language)) {
      //    today.setFullYear(today.getFullYear() + (language.toLowerCase() == 'th' ? 543 : 0));
      // }
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
  }

  /**
   * Convert formatted string date into Date object.
   * 
   * @param strDate Formatted date string
   * @return {Date} A date object or null for invalid date
   */
  public static stringToDate(strDate: string): Date {
    let convertedDate = new Date(strDate);
    return this.isValidDate(convertedDate) ? convertedDate : null;
  }

  /**
   * Convert Date object into Formatted string date 'YYYY-MM-DD HH24:mm:ss'.
   * 
   * @param dateObj A Date object
   * @return {String} Formatted string date 'YYYY-MM-DD HH24:mm:ss' or null for invalid date.
   */
  public static dateToString(dateObj: Date): string {
    return this.formatDate(dateObj);
  }

}

export enum DateFormat {
  /**
   * YYYY-MM-DD HH24:mm:ss'
   */
  'YYYY_MM_DD_HH24_mm_ss',

  /**
   * YYYY-MM-DD
   */
  'YYYY_MM_DD',

  /**
   * DD-MM-YYYY
   */
  'DD_MM_YYYY',
}