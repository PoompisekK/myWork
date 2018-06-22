import { Directive, HostListener, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { StringUtil } from '../../utilities/string.util';
import { NumberUtil } from '../../utilities/number.util';
import { ObjectsUtil } from '../../utilities/objects.util';
import { AlertController } from "ionic-angular";

@Directive({ selector: 'ion-input[validate-input]' })
export class ValidateInputDirective {

  @Output('validate-result')
  public validateEmitter: EventEmitter<NgForm> = new EventEmitter();

  @Input('formInput') private formInput: NgForm;
  @Input('name') private inputName: string;
  @Input('input-type') private inputType: InputTypeConst;
  @Input('maxlength') private inputMaxlength: number = 0;
  @Input('required') private inputRequired: any;
  @Input('limit-value') public inputLimitValue: any;

  @HostListener("input", ["$event", "$event.target"])
  public onInput(event: any, evenTarget: any): void {
    this.validateField(event);

    this.loggingField(event, evenTarget);
  }

  @HostListener("ionFocus", ["$event", "$event.target"])
  public onFocus(event: any, evenTarget: any): void {
    let _formM = this.formInput;
    let _inputName = this.inputName;
    let _inputType = this.inputType;
    if (_formM) {
      if (_inputType == InputTypeConst.NUMBER || _inputType == InputTypeConst.NUMBER_DIGIT) {
        let textValue = _formM.controls[_inputName].value;
        _formM.controls[_inputName].patchValue((textValue || '').replace(/[^0-9\.]+/g, ''));
      }
    }
    // this.loggingField(event, evenTarget);
  }

  private isThisFieldRequired(): boolean {
    let isRequired = this.inputRequired !== null && (this.inputRequired === '' || this.inputRequired === true);
    // console.log("isThisFieldRequired [" + this.inputType + "] isRequired:", isRequired, ' attribute value:', this.inputRequired);
    return isRequired;
  }

  private loggingField(event?: any, evenTarget?: any) {
    // console.log("[" + this.inputName + "] is required:", this.hasRequired());
  }

  @HostListener("ionBlur", ["$event", "$event.target"])
  public onBlur(event: any, evenTarget: any): void {
    let _inputTextValue: string;
    let _formM = this.formInput;
    let _inputType = this.inputType;
    let _inputName = this.inputName;
    let _inputMaxlength = this.inputMaxlength;

    if (_formM) {
      let ctrlInputName = _formM.controls[_inputName];
      if (ctrlInputName) {
        _inputTextValue = ctrlInputName.value || '';
        if (_inputType == InputTypeConst.NUMBER) {
          _formM.controls[_inputName].patchValue(NumberUtil.displayNumberFormatNoDigit(_inputTextValue));

        } else if (_inputType == InputTypeConst.CARD_ID) {
          if (!StringUtil.isEmptyString(_inputTextValue) || this.isThisFieldRequired()) {
            if (this.isRestrictId(_inputTextValue) || this.isErrorLastDigitLogic(_inputTextValue)) {
              _formM.controls[_inputName].setErrors({ 'id': true });
            }
          } else {
            _formM.controls[_inputName].setErrors(null);
          }

        } else if (_inputType == InputTypeConst.EMAIL) {
          if (!StringUtil.isEmptyString(_inputTextValue) || this.isThisFieldRequired()) {
            let emailCheck = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailCheck.test(_inputTextValue)) {
              _formM.controls[_inputName].setErrors({ 'emailError': true });
            }
          } else {
            _formM.controls[_inputName].setErrors(null);
          }

        } else if (_inputType == InputTypeConst.NUMBER_DIGIT) {
          let strRes = NumberUtil.displayNumberFormat2Digit(_inputTextValue);
          _formM.controls[_inputName].patchValue(strRes);

        } else if (_inputType == InputTypeConst.MOBILE || _inputType == InputTypeConst.PHONE) {
          if (!StringUtil.isEmptyString(_inputTextValue) || this.isThisFieldRequired()) {
            if (this.isValidNumber(_inputTextValue) == false) {
              console.error("_inputTextValue ", _inputType, ":", _inputTextValue);
              _formM.controls[_inputName].setErrors({ 'telNumber': true });
            }
          } else {
            _formM.controls[_inputName].setErrors(null);
          }

        }
        else if (_inputType == InputTypeConst.TELEPHONE) {
          if (!StringUtil.isEmptyString(_inputTextValue) || this.isThisFieldRequired()) {
            if (this.isValidNumberForTelephone(_inputTextValue) == false) {
              console.error("_inputTextValue ", _inputType, ":", _inputTextValue);
              _formM.controls[_inputName].setErrors({ 'telNumber': true });
            }
          } else {
            _formM.controls[_inputName].setErrors(null);
          }

        }
        else if (_inputType == InputTypeConst.CARD_ID) {
          if (!StringUtil.isEmptyString(_inputTextValue) || this.isThisFieldRequired()) {
            let validCardID = _inputMaxlength > 0 && _inputTextValue.length != _inputMaxlength;
            if (validCardID) {
              ctrlInputName.setErrors({ 'cardIdError': true });
            }
          } else {
            _formM.controls[_inputName].setErrors(null);
          }

        }
      }
    }

    this.loggingField(event, evenTarget);
  }

  private isValidNumber(number: string): boolean {
    let regStr = new RegExp('');
    let _inputType = this.inputType;
    if (_inputType == InputTypeConst.MOBILE) {
      regStr = /^[0]{1,1}[6,8,9]{1,1}[0-9]{4,4}[0-9]{4,4}$/;// 10 หลัก
    } else if (_inputType == InputTypeConst.PHONE) {
      regStr = /^[0]{1}[2-5,7]{1}[0-9]{4}[0-9]{3}$/;// 9 หลัก
    }
    return regStr.test(number) == true;
  }

  private isValidNumberForTelephone(number: string): boolean {
    let regStr = new RegExp('');
    let _inputType = this.inputType;
    let result = false;
    if (/^[0]{1,1}[6,8,9]{1,1}[0-9]{4,4}[0-9]{4,4}$/.test(number)) {
      result = true;
    } else if (/^[0]{1}[2-5,7]{1}[0-9]{4}[0-9]{3}$/.test(number)) {
      result = true;
    }
    else if (/^[+]\d{2}[6,8,9]{1,1}[0-9]{4,4}[0-9]{4,4}$/.test(number)) {
      result = true;
    }
    return result;
  }

  private isRestrictId(_instr: string): boolean {
    if (_instr === '1234567890123' || _instr === '0000000000001') {
      console.error('Match restrict Input:', _instr);
      return true;
    } else {
      return false;
    }
  }
  private isErrorLastDigitLogic(_idStr: string): boolean {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseFloat(_idStr.charAt(i)) * (13 - i);
    }
    let lastDigit = (11 - sum % 11) % 10;
    let isErrorLastDigit = lastDigit != parseFloat(_idStr.charAt(12));
    if (isErrorLastDigit) {
      // console.log('isErrorLastDigit [' + lastDigit + '!=' + parseFloat(_idStr.charAt(12)) + ' ]:', isErrorLastDigit);
      console.error("Incorrect input format !!!! last index should be :", lastDigit);
      return true;
    } else {
      return false;
    }
  }

  constructor(
    public element: ElementRef,
    private alertCtrl: AlertController
  ) { }

  public ngOnInit(): void {
    this.validateField();

    this.loggingField();
  }

  private patchLength(formM, inputName, inputTextValue, inputMaxlength) {
    if (inputMaxlength > 0 && inputTextValue.length > inputMaxlength) {
      inputTextValue = inputTextValue.substring(0, inputMaxlength);
      console.warn("Over input Maxlength:", inputMaxlength);
    }
    formM.controls[inputName].patchValue(inputTextValue);
  }

  private validateField(event?: Event): void {
    let _inputTextValue: string;
    let _formM = this.formInput;
    let _inputType = this.inputType;
    let _inputName = this.inputName;
    let _inputMaxlength = this.inputMaxlength;
    let limitValue = this.inputLimitValue;

    if (_formM) {
      let regNo = new RegExp(/^([0-9]*.[0-9]*){0,1}$/);
      if (_formM.controls[_inputName]) {
        _inputTextValue = _formM.controls[_inputName].value || '';//if null set to empty string ''
        if (_inputType == InputTypeConst.TEXT) {
          this.patchLength(_formM, _inputName, _inputTextValue, _inputMaxlength);

        } else if (_inputType == InputTypeConst.CARD_ID) {
          _inputTextValue = _inputTextValue.replace(/[^0-9]+/g, ''); //replace all exclude 0-9
          this.patchLength(_formM, _inputName, _inputTextValue, _inputMaxlength);

        } else if (_inputType == InputTypeConst.PASSPORT_NO) {
          _inputTextValue = _inputTextValue.replace(/[^0-9-]+/g, ''); // replace all exclude 0-9 and -[dash]
          this.patchLength(_formM, _inputName, _inputTextValue, _inputMaxlength);

        } else if (_inputType == InputTypeConst.MOBILE || _inputType == InputTypeConst.PHONE) {
          _inputTextValue = _inputTextValue.replace(/[^0-9]+/g, ''); //replace all exclude 0-9
          if (!regNo.test(_inputTextValue)) {
            _formM.controls[_inputName].patchValue(_inputTextValue.replace(/[^0-9]+/g, ''));
          }
          this.patchLength(_formM, _inputName, _inputTextValue, _inputMaxlength);

        } else if (_inputType == InputTypeConst.TELEPHONE) {
          if (/[^+\d]/g.test(_inputTextValue)) {
            _inputTextValue = _inputTextValue.replace(/.$/, "");
          }
          if ((/^[0]{1}[2-5,7]{1}/).test(_inputTextValue)) {
            if (_inputTextValue.length > 9) {
              // console.log("telephone")
              _inputTextValue = _inputTextValue.replace(/.$/, "");
            }
          } else if ((/^[+]\d{2}[6,8,9]{1,1}/).test(_inputTextValue)) {
            if (_inputTextValue.length > 12) {
              // console.log("foreign")
              _inputTextValue = _inputTextValue.replace(/.$/, "");
            }
          }
          else {
            if (_inputTextValue.length > 10) {
              // console.log("mobile")
              _inputTextValue = _inputTextValue.replace(/.$/, "");
            }
          }
          _formM.controls[_inputName].patchValue(_inputTextValue);
        }
        else if (_inputType == InputTypeConst.POST_CODE) {
          // if (!regNo.test(_inputTextValue)) {
          _formM.controls[_inputName].patchValue(NumberUtil.catchNumberString(_inputTextValue).substring(0, 5));
          // }
          // this.patchLength(_formM, _inputName, _inputTextValue, _inputMaxlength);
        } else if (_inputType == InputTypeConst.EXT) {
          if (_inputTextValue) {
            let tmpInput = NumberUtil.catchNumberOnly(_inputTextValue) + '';
            if (tmpInput == '0') {
              _formM.controls[_inputName].patchValue('');
            }
            else {
              _formM.controls[_inputName].patchValue(tmpInput);
            }
          }
        } else if (_inputType == InputTypeConst.NUMBER_DECIMAL) {
          let pattern = "0.00";
          let preValue = "";
          let value = _inputTextValue.toString();
          if (value == '-') {
            _formM.controls[_inputName].patchValue('');
            return;
          }
          if (value == "-0.00") {
            value = pattern;
          }
          let result = "";
          let minus = value.match(/-/g);
          value = value.replace(/[^\d]/g, "");
          value = parseInt(value).toString();
          if (value.length > 10) {
            value = value.replace(/\d$/, "");
          }
          if (_inputTextValue) {
            let decimal = value.match(/\d\d$|\d$/).toString();
            let number = value.replace(decimal, "").toString();

            if (number == "") {
              number = "0";
            }
            if (decimal.length == 1) {
              decimal = "0" + decimal;
            }
            number = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            if (minus == null) {
              result = number + "." + decimal;
            } else {
              result = minus[0] + number + "." + decimal;
            }
            preValue = result;
            _formM.controls[_inputName].patchValue(result);
          }
        } else if (_inputType == InputTypeConst.NUMBER_DIGIT) {
          let regNo = new RegExp(/^\d*\.?\d*$/);
          _inputTextValue = _inputTextValue.replace(/[^0-9\.]+/g, '');
          if (!regNo.test(_inputTextValue)) {
            let result = 0;
            let onlyDigitStr = _inputTextValue.replace(/[^0-9\.]+/g, '');
            if (!StringUtil.isEmptyString(onlyDigitStr)) {
              result = parseFloat(onlyDigitStr);
            }
            _formM.controls[_inputName].patchValue(result);
          }
          if (!StringUtil.isEmptyString(limitValue)) {
            limitValue = NumberUtil.string2number(limitValue);
            if (NumberUtil.string2number(_inputTextValue) > limitValue) {
              // let limitValueStr = limitValue - 0.01;
              this.alertCtrl.create({
                message: 'ค่าที่ระบุไม่ถูกต้อง กรุณาระบุค่าใหม่อีกครั้ง ค่าที่ระบุจะต้องไม่เกิน 999.99',
              }).present();

              _inputTextValue = "";
            }
          }
          this.patchLength(_formM, _inputName, _inputTextValue, _inputMaxlength);

        } else if (_inputType == InputTypeConst.CHAR_ONLY) {
          let pattern = /[\d]+/g;
          if (pattern.test(_inputTextValue)) {
            _formM.controls[_inputName].patchValue((_inputTextValue || '').replace(/[\d]+/g, ''));
          } else {
            _formM.controls[_inputName].updateValueAndValidity();
          }
        }

        else if (_inputType == InputTypeConst.ENGLISH_ONLY) {
          // let regex = /\._|_\.|__|\.\.|@@|_@|\.@|@_|@\./g;
          if (/\._|_\.|__|\.\.|@@|_@|\.@|@_|@\./g.test(_inputTextValue)) {
            _inputTextValue = _inputTextValue.substring(0, _inputTextValue.length - 1);
          }
          else {
            let allowUserNameIsEmail = true;
            if (!allowUserNameIsEmail && (_inputName == "regisUsername" || _inputName == "username")) {
              _inputTextValue = _inputTextValue.replace(/[^A-Za-z0-9_\.\-]|^_|^\./g, '');
            }
            else {
              _inputTextValue = _inputTextValue.replace(/[^A-Za-z0-9_@\.]|^_|^\.|^@/g, '');
            }
          }
          _formM.controls[_inputName].patchValue(_inputTextValue);
        }

      } else {
        // console.log(_inputName);
        // console.warn(`Error missing ctrl Input Name for [${_inputName}] !!!!: ${_formM.controls[_inputName]}`);
      }
    } else {
      // console.error("Error missing ngFrom !!!!:", _formM);
    }
  }
}

export class InputTypeConst {
  public static NUMBER_DIGIT = "numberdigit";
  public static NUMBER = "number";
  public static PHONE = "phone";
  public static EXT = 'extphone';
  public static MOBILE = "mobile";
  public static CARD_ID = "cardid";
  public static PASSPORT_NO = "passportno";
  public static TEXT = "text";
  public static EMAIL = "email";
  public static NUMBER_DECIMAL = 'numberdecimal';
  public static CHAR_ONLY = 'char';
  public static POST_CODE = 'postcode';
  public static TELEPHONE = 'telephone';
  public static ENGLISH_ONLY = 'englishonly';
}