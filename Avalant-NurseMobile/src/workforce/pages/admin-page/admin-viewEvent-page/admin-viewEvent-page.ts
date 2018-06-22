import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingOptions } from 'ionic-angular';
import { userProfileModel } from '../../../model/workforce.model';
import { UserModel } from '../../../../model/user/user.model';
import { WorkforceHttpService } from '../../../service/workforceHttpService';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { message } from '../../../../layout-module/components/form-control-base/validate';

declare var google;

@Component({
  selector: 'admin-viewEvent-page',
  templateUrl: 'admin-viewEvent-page.html'
})
export class AdminViewEventPage implements OnInit {
  private userProfile: UserModel = new UserModel();

  constructor(
    public navCtrl: NavController,
    public navParam: NavParams,
    private wfHttpService: WorkforceHttpService,
    private alertCtrl: AlertController,
    private loadingCtr: LoadingController,
  ) {

  }

  //Definition for the map component to take care of generating a new map
  private ionViewDidLoad() {

  }
  public ngOnInit() {
    this.userProfile = this.navParam.get("userProfile");
  }

  private verify() {
    console.log("this.userProfile :", this.userProfile);
    let loading = this.loadingCtr.create({ content: "Loading..." });

    let custName = this.userProfile.custFname + ' ' + this.userProfile.custLname;
    let alerMsg = this.alertCtrl.create({
      message: "Verify user '" + custName + "' complete",
      buttons: ["Done"]
    });
    this.wfHttpService.getVerifiedWorkforceUser(this.userProfile).subscribe((resp) => {
      console.log("getVerifiedWorkforceUser resp:", resp);
      alerMsg.onDidDismiss(() => {
        this.navCtrl.pop();
      });
      loading && loading.dismiss().then(() => {
        alerMsg.present();
      });
    }, (err) => {
      console.error("verifyEmployee error :" + err);
      loading && loading.dismiss().then(() => {
        alerMsg = this.alertCtrl.create({
          message: "Verify user '" + custName + "' fail : " + err.message,
          buttons: ["Done"]
        });
        alerMsg.present();
      });
    });
  }

}
