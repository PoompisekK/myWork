import { Injectable } from "@angular/core";
import { VerifyOTPModel, RequestOTPModel } from '../../model/authentication/otp-service.model';
import { ObjectsUtil } from '../../utilities/objects.util';
import { Observable } from "rxjs/Observable";

@Injectable()
export class OTPVerificationService {
  public referKey: String;
  constructor() {

  }

  private static readonly OnSMSArrive = 'onSMSArrive';
  private events;

  public addEventListenerOTP(reqM: RequestOTPModel, callback): void {
    this.events = (result: any) => {
      console.log("onSMSArrive");
      this.detectSMSArrived(reqM, result).subscribe(resp => {
        callback(resp);
        this.stopWatchingOTP();
      }, (err) => {
        console.error("detectSMSArrived error:", err);
        this.stopWatchingOTP();
        callback(err);
      });
    };
    document.addEventListener(OTPVerificationService.OnSMSArrive, this.events);

    let SMSPlugin = window['SMS'];
    console.log("startWatch SMSPlugin:", SMSPlugin);
    if (!ObjectsUtil.isEmptyObject(SMSPlugin)) {
      SMSPlugin.startWatch((resp) => { console.log("startWatch resp :", resp); }, (error) => { console.error("startWatch error :", error); });
    }
  }

  public stopWatchingOTP() {
    document.removeEventListener(OTPVerificationService.OnSMSArrive, this.events);
    let SMSPlugin = window['SMS'];
    console.log("startWatch SMSPlugin:", SMSPlugin);
    if (!ObjectsUtil.isEmptyObject(SMSPlugin)) {
      SMSPlugin.stopWatch((resp) => { console.log("stopWatch resp :", resp); }, (error) => { console.error("stopWatch error :", error); });
    }
  }

  private detectSMSArrived(reqM: RequestOTPModel, result: any): Observable<any> {
    let smsData = result.data;
    //en-pattern : Your OTP is 721334 (Ref Code: 300161). This password will be expired within 20 minutes.
    //th-pattern : รหัส OTP: 450873 (เลขอ้างอิง : 288075). รหัสจะหมดอายุใน 20 นาที.
    let delim_TH = "รหัส otp:", delim_EN = "your otp is";
    console.log("matching referKey :", this.referKey);
    console.log("detected SMSArrived Data :", smsData);
    let smsBody = (smsData.body || '').toLowerCase();
    return Observable.create((observer) => {
      if (!ObjectsUtil.isEmptyObject(smsData) && smsBody.indexOf(this.referKey) > -1) {
        let delim = reqM.language == 'EN' ? delim_EN : delim_TH;
        let tmpBody = (smsBody.substr(smsBody.indexOf(delim) + delim.length + 1)).trim();
        let otpCode = tmpBody.split(' ')[0];
        console.log("otpCode:", otpCode);
        observer.next(otpCode);
      } else {
        observer.next(null);
      }
    });
  }

}