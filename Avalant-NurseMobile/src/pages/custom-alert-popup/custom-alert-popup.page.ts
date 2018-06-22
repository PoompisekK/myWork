import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { NavParams, ViewController } from 'ionic-angular';

import { AppConstant } from '../../constants/app-constant';
import { toRaw } from '../../constants/environment';

@Component({
  selector: 'custom-alert-popup-page',
  templateUrl: 'custom-alert-popup.page.html',
  styleUrls: ['/custom-alert-popup.page.scss']
})

export class CustomAlertPopupPage implements OnInit {

  public readonly FLAG_ERROR: string = AppConstant.Status.ERROR;
  public readonly FLAG_WARNING: string = AppConstant.Status.WARNING;
  public readonly FLAG_SUCCESS: string = AppConstant.Status.SUCCESS;
  public readonly FLAG_INFO: string = AppConstant.Status.INFO;

  private alertData: AlertParamsM = new AlertParamsM();

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
  ) {

  }
  public ngOnInit() {
    this.alertData = this.navParams.data;
    console.log("public ngOnInit this.alertData :", toRaw(this.alertData));
  }
  public ngAfterViewInit() {
    this.alertData = this.navParams.data;
    console.log("ngAfterViewInit this.alertData :", toRaw(this.alertData));
  }
 public ionViewWillEnter() {
    this.alertData = this.navParams.data;
    console.log("ionViewWillEnter this.alertData :", toRaw(this.alertData));
  }

  private okClick() {
    console.log("Ok Cliked");
    this.viewCtrl.dismiss();
  }

  private appButtonClick(_btns: AlertButtonOpt) {
    console.log("appButtonClick :", _btns);
    this.viewCtrl.dismiss();
    _btns && _btns.handler();
  }

  private cancelClick() {
    console.log("Cancel Cliked");
    this.viewCtrl.dismiss();
  }
}
export class AlertButtonOpt {
  public name: string;
  public type?: "success" | "error" | "info" | "warning";
  public handler: (data?) => void;
}
export class AlertParamsM {
  public status: string;
  public description?: string;
  public title: string;
  public buttons: string[] | AlertButtonOpt[];
}