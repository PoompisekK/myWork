import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AdminViewEventPage } from './admin-viewEvent-page/admin-viewEvent-page';
import { UserModel } from '../../../model/user/user.model';
import { WorkforceHttpService } from '../../service/workforceHttpService';

declare var google;

@Component({
  selector: 'admin-page',
  templateUrl: 'admin-page.html'
})
export class AdminPage implements OnInit {
  private userList: UserModel[] = new Array<UserModel>();

  constructor(
    public navCtrl: NavController,
    private wfHttpService: WorkforceHttpService,

  ) {

  }

  //Definition for the map component to take care of generating a new map
  public ionViewDidEnter() {
    this.wfHttpService.getListUserForVerify().subscribe((res) => {
      this.userList = res;
      console.log("getListUserForVerify :", res);
    });
  }

  public ngOnInit() {
  }

  private goToProfile(userProfile: UserModel) {
    this.navCtrl.push(AdminViewEventPage, {
      userProfile: userProfile
    });
  }

}
