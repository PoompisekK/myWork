import { Component, Input, Output, EventEmitter, AfterViewInit, HostBinding } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '../form-control-base/value-accessor-base';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { TimeoutDebouncer } from "ionic-angular/util/debouncer";
import { TranslationService } from 'angular-l10n';
/**
 * Number Spinner
 * 
 * @see http://blog.rangle.io/angular-2-ngmodel-and-custom-form-components/
 * @author NorrapatN
 * @since Thu May 25 2017
 */
@Component({
  selector: 'number-spinner',
  templateUrl: './number-spinner.component.html',
  providers: [
    // Custom NG Value provider
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumberSpinnerComponent,
      multi: true
    }
  ]
})
export class NumberSpinnerComponent extends ValueAccessorBase<number> implements AfterViewInit {

  private prev;
  private disableInput: boolean = false;

  private _inputDebouncer: TimeoutDebouncer = new TimeoutDebouncer(0);

  @Input('width')
  private width: string = '100px';

  @Output('add-click')
  private addClickEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Output('remove-click')
  private removeClickEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Output('event-click')
  private eventClickEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Input('nameCart')
  private nameCart: string;

  @Input('personLimit')
  public personLimit: number;

  @Input()
  set disabled(value: string) {
    if ((value + '').toLowerCase() === 'false') {
      this.disableInput = false;
    } else {
      this.disableInput = true;
    }
  }

  @Input()
  private min: number;

  @Input()
  private max: number;

  @Input()
  @HostBinding('class.round-button')
  public roundButton: boolean;

  @Input()
  get debounce(): number {
    return this._inputDebouncer.wait;
  }
  set debounce(val: number) {
    this._inputDebouncer.wait = val;
  }

  constructor(
    private alertCtrl: AlertController,
    private translationService: TranslationService,
    // private ngZone: NgZone,
  ) {
    super();
    this.registerOnChange((value) => {
      // this._value = value;
    });

  }

  public ngAfterViewInit(): void {
    this.prev = this.value;

    this.registerOnChange(() => this.checkValue());
  }

  // private updateValue(value: string): void {
  //   this.prev = this.value;

  //   if (value == '') {
  //     setTimeout(() => {
  //       this.value = this.prev;
  //     }, 0);
  //     return;
  //   }
  //   this.value = this.prev = Number(value);
  // }

  private addClick(e: MouseEvent): void {
    // use follow bussiness rule in cart types
    if (this.nameCart !== undefined) {
      if (this.nameCart == "course_event") {
        if (Number(this.value) < this.personLimit) {
          this.prev = this.value;
          this.value = Number(this.value) + 1;
          this.checkValue();
          this.eventClickEmitter.emit(this.value);
          this.addClickEmitter.emit(this.value);
        } else {
          this.alertCtrl.create({
            cssClass: "alertMessageUserProfile",
            message: 'ไม่สามารถสมัครปฏิบัติธรรมเกินจำนวนที่กำหนดได้',
            buttons: [{
              text: this.translationService.translate("COMMON.BUTTON.DONE"),
              role: 'cancel',
            }]
          }).present();
          // this.disableInput = true;
        }

      } else if (this.nameCart == "group_event") {
        this.disableInput = true;
      }
    } else {
      this.prev = this.value;
      this.value = Number(this.value) + 1;

      this.checkValue();

      this._inputDebouncer.debounce(() => {
        this.eventClickEmitter.emit(this.value);
        this.addClickEmitter.emit(this.value);
      });
    } 

  }

  private removeClick(e: MouseEvent): void {
    this.prev = this.value;
    if (Number(this.value) > 1) {
      this.value = Number(this.value) - 1;
    }
    this.checkValue();
    this._inputDebouncer.debounce(() => {
      this.eventClickEmitter.emit(this.value);
      this.removeClickEmitter.emit(this.value);
    });
  }

  private checkValue(): void {

    // Skip when empty
    if (this.value == null) {
      return;
    }

    setTimeout(() => {
      if (this.value > this.max) {
        this.value = this.max;
      } else if (this.value < this.min) {
        this.value = this.min;
      }
    });

  }

  private checkOnBlur(): void {

    if (this.prev == null) {
      this.prev = this.min || 0;
    }

    if (this.value == null) {
      this.value = this.prev;
    }

    this.checkValue();
  }
}
