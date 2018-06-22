import { Component, ViewEncapsulation, Optional, ElementRef, Renderer, HostListener } from '@angular/core';
import { DateTime, PickerColumn, Config, Item, PickerController } from 'ionic-angular';
import { isPresent, isString, isArray, deepCopy, isBlank } from 'ionic-angular/util/util';
import { Form } from 'ionic-angular/util/form';
import { parseTemplate, convertFormatToKey, dateValueRange, renderTextFormat, getValueFromFormat, DateTimeData, LocaleData } from 'ionic-angular/util/datetime-util';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslationService } from "angular-l10n";

const DEFAULT_FORMAT = 'D MMM YYYY';
const FORMAT_YYYY = 'YYYY';
const FORMAT_YY = 'YY';
const FORMAT_MMMM = 'MMMM';
const FORMAT_MMM = 'MMM';
const FORMAT_MM = 'MM';
const FORMAT_M = 'M';
const FORMAT_DDDD = 'DDDD';
const FORMAT_DDD = 'DDD';
const FORMAT_DD = 'DD';
const FORMAT_D = 'D';
const FORMAT_HH = 'HH';
const FORMAT_H = 'H';
const FORMAT_hh = 'hh';
const FORMAT_h = 'h';
const FORMAT_mm = 'mm';
const FORMAT_m = 'm';
const FORMAT_ss = 'ss';
const FORMAT_s = 's';
const FORMAT_A = 'A';
const FORMAT_a = 'a';
const FORMAT_KEYS = [
  { f: FORMAT_YYYY, k: 'year' },
  { f: FORMAT_MMMM, k: 'month' },
  { f: FORMAT_DDDD, k: 'day' },
  { f: FORMAT_MMM, k: 'month' },
  { f: FORMAT_DDD, k: 'day' },
  { f: FORMAT_YY, k: 'year' },
  { f: FORMAT_MM, k: 'month' },
  { f: FORMAT_DD, k: 'day' },
  { f: FORMAT_HH, k: 'hour' },
  { f: FORMAT_hh, k: 'hour' },
  { f: FORMAT_mm, k: 'minute' },
  { f: FORMAT_ss, k: 'second' },
  { f: FORMAT_M, k: 'month' },
  { f: FORMAT_D, k: 'day' },
  { f: FORMAT_H, k: 'hour' },
  { f: FORMAT_h, k: 'hour' },
  { f: FORMAT_m, k: 'minute' },
  { f: FORMAT_s, k: 'second' },
  { f: FORMAT_A, k: 'ampm' },
  { f: FORMAT_a, k: 'ampm' },
];

/**
 * @hidden
 * Use to convert a string of comma separated numbers or
 * an array of numbers, and clean up any user input
 */
function convertToArrayOfNumbers(input: any, type: string): number[] {
  if (isString(input)) {
    // convert the string to an array of strings
    // auto remove any whitespace and [] characters
    input = input.replace(/\[|\]|\s/g, '').split(',');
  }

  let values: number[];
  if (isArray(input)) {
    // ensure each value is an actual number in the returned array
    values = input
      .map((num: any) => parseInt(num, 10))
      .filter(isFinite);
  }

  if (!values || !values.length) {
    console.warn(`Invalid "${type}Values". Must be an array of numbers, or a comma separated string of numbers.`);
  }

  return values;
}

/**
 * @hidden
 * Use to convert a string of comma separated strings or
 * an array of strings, and clean up any user input
 */
function convertToArrayOfStrings(input: any, type: string): string[] {
  if (isPresent(input)) {
    if (isString(input)) {
      // convert the string to an array of strings
      // auto remove any [] characters
      input = input.replace(/\[|\]/g, '').split(',');
    }

    let values: string[];
    if (isArray(input)) {
      // trim up each string value
      values = input.map((val: string) => val.trim());
    }

    if (!values || !values.length) {
      console.warn(`Invalid "${type}Names". Must be an array of strings, or a comma separated string.`);
    }

    return values;
  }
}

/**
 * Ionic Date time Buddhist Era Calendar
 * 
 * @author NorrapatN
 * @since Tue Aug 01 2017
 */
@Component({
  selector: 'ion-datetime-be',
  template:
    '<div *ngIf="!_text" class="datetime-text datetime-placeholder">{{placeholder}}</div>' +
    '<div *ngIf="_text" class="datetime-text">{{_text}}</div>' +
    '<button aria-haspopup="true" ' +
    'type="button" ' +
    '[id]="id" ' +
    'ion-button="item-cover" ' +
    '[attr.aria-labelledby]="_labelId" ' +
    '[attr.aria-disabled]="_disabled" ' +
    'class="item-cover">' +
    '</button>',
  host: {
    '[class.datetime-disabled]': '_disabled'
  },
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: DateTimeBe, multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class DateTimeBe extends DateTime {

  @HostListener('click', ['$event'])
  public _click(ev: UIEvent) {
    // do not continue if the click event came from a form submit
    if (ev.detail === 0) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    this.open();
  }

  @HostListener('keyup.space')
  public _keyup() {
    this.open();
  }

  constructor(
    form: Form,
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    private translator: TranslationService,
    @Optional() item: Item,
    @Optional() private pickerCtrl: PickerController
  ) {
    super(form, config, elementRef, renderer, item, pickerCtrl);
  }

  /**
   * @hidden
   */
  public ngAfterContentInit() {
    // first see if locale names were provided in the inputs
    // then check to see if they're in the config
    // if neither were provided then it will use default English names
    ['monthNames', 'monthShortNames', 'dayNames', 'dayShortNames'].forEach(type => {
      (<any>this)._locale[type] = convertToArrayOfStrings(isPresent((<any>this)[type]) ? (<any>this)[type] : this._config.get(type), type);
    });

    this._initialize();
  }

  /**
   * @hidden
   */
  public open() {
    if (this.isFocus() || this._disabled) {
      return;
    }
    // console.debug('datetime, open picker');

    // the user may have assigned some options specifically for the alert
    const pickerOptions = deepCopy(this.pickerOptions);

    // Configure picker under the hood
    const picker = this._picker = this.pickerCtrl.create(pickerOptions);
    picker.addButton({
      text: this.cancelText,
      role: 'cancel',
      handler: () => this.ionCancel.emit(this)
    });
    picker.addButton({
      text: this.doneText,
      handler: (data: any) => this.value = data,
    });

    picker.ionChange.subscribe(() => {
      this.validate();
      picker.refresh();
    });

    // Update picker status before presenting
    this.generate();
    this.validate();

    // Present picker
    this._fireFocus();
    picker.present(pickerOptions);
    picker.onDidDismiss(() => {
      this._fireBlur();
    });
  }

  /**
   * Override from base generate().
   */
  public generate(): void {
    const picker = this._picker;
    // if a picker format wasn't provided, then fallback
    // to use the display format
    let template = this.pickerFormat || this.displayFormat || DEFAULT_FORMAT;

    if (isPresent(template)) {
      // make sure we've got up to date sizing information
      this.calcMinMax();

      // does not support selecting by day name
      // automaticallly remove any day name formats
      template = template.replace('DDDD', '{~}').replace('DDD', '{~}');
      if (template.indexOf('D') === -1) {
        // there is not a day in the template
        // replace the day name with a numeric one if it exists
        template = template.replace('{~}', 'D');
      }
      // make sure no day name replacer is left in the string
      template = template.replace(/{~}/g, '');

      // parse apart the given template into an array of "formats"
      parseTemplate(template).forEach(format => {
        // loop through each format in the template
        // create a new picker column to build up with data
        let key = convertFormatToKey(format);
        let values: any[];

        // first see if they have exact values to use for this input
        if (isPresent((<any>this)[key + 'Values'])) {
          // user provide exact values for this date part
          values = convertToArrayOfNumbers((<any>this)[key + 'Values'], key);

        } else {
          // use the default date part values
          values = dateValueRange(format, this._min, this._max);
        }

        const column: PickerColumn = {
          name: key,
          selectedIndex: 0,
          options: values.map(val => {
            return {
              value: val,
              // NorrapatN : Custom function for render text format.
              text: this.renderTextFormat(format, val, null, this._locale),
            };
          })
        };

        // cool, we've loaded up the columns with options
        // preselect the option for this column
        const optValue = getValueFromFormat(this.getValue(), format);
        const selectedIndex = column.options.findIndex(opt => opt.value === optValue);
        if (selectedIndex >= 0) {
          // set the select index for this column's options
          column.selectedIndex = selectedIndex;
        }

        // add our newly created column to the picker
        picker.addColumn(column);
      });

      // Normalize min/max
      const min = <any>this._min;
      const max = <any>this._max;
      const columns = this._picker.getColumns();
      ['month', 'day', 'hour', 'minute']
        .filter(name => !columns.find(column => column.name === name))
        .forEach(name => {
          min[name] = 0;
          max[name] = 0;
        });

      this.divyColumns();
    }
  }

  /**
   * @hidden
   */
  public updateText() {
    // create the text of the formatted data
    const template = this.displayFormat || this.pickerFormat || DEFAULT_FORMAT;
    this._text = this.renderDateTime(template, this.getValue(), this._locale);
  }

  /**
   * @hidden
   */
  public _inputUpdated() {
    this._value.tzOffset = (new Date().getTimezoneOffset() * -1);
    super._inputUpdated();
    this.updateText();
  }

  /**
   * Render text format -- Override checking for buddist year.
   * 
   * @author NorrapatN
   */
  private renderTextFormat(format: string, value: any, date: DateTimeData, locale: LocaleData): string {
    if (format.indexOf('Y') < 0) {
      return renderTextFormat(format, value, date, locale);
    } else {
      return (Number(value) + this.isYearsBE()) + '';
    }
  }

  private isYearsBE(): number {
    // return this.translator.getLanguage() && this.translator.getLanguage().toLowerCase() == 'th' ? 543 : 0;
    return false ? 543 : 0;
  }

  /**
   * Override Render date time
   */
  private renderDateTime(template, value, locale) {
    if (isBlank(value)) {
      return '';
    }
    let tokens = [];
    let hasText = false;
    FORMAT_KEYS.forEach((format, index) => {
      if (template.indexOf(format.f) > -1) {
        let token = '{' + index + '}';
        let text = this.renderTextFormat(format.f, ((value))[format.k], value, locale);
        if (!hasText && text && isPresent(((value))[format.k])) {
          hasText = true;
        }
        tokens.push(token, text);
        template = template.replace(format.f, token);
      }
    });
    if (!hasText) {
      return '';
    }
    for (let i = 0; i < tokens.length; i += 2) {
      template = template.replace(tokens[i], tokens[i + 1]);
    }
    return template;
  }

}
