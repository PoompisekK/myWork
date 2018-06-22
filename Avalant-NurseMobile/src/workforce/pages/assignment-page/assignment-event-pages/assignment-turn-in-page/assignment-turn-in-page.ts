import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { AppLoadingService } from '../../../../../services/app-loading-service/app-loading.service';

@Component({
  selector: 'assignment-turn-in-page',
  templateUrl: 'assignment-turn-in-page.html'
})
export class AssignmentTurnInPage
  implements OnInit {
  constructor(
    public viewCtrl: ViewController,
    public navParam: NavParams,
    public appLoadingService: AppLoadingService,
  ) {

  }
  public ngOnInit(): void {

  }

}
