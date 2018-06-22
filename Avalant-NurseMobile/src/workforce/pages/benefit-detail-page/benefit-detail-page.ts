import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AnimateCss } from '../../../animations/animate-store';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { BenefitService } from '../../service/benefitService';

@Component({
  selector: 'benefit-detail-page',
  templateUrl: 'benefit-detail-page.html',
  animations: [
    AnimateCss.peek(),
  ]
})
export class BenefitDetailPage {
  private benefitsList: any[] = [];
  private displayTypeIndex: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appLoadingService: AppLoadingService,
    public benefitService: BenefitService,
  ) {

  }
  private currentTime = new Date();
  
  public ionViewWillEnter() {
    this.benefitsList = this.navParams.get("data");
    this.displayTypeIndex = this.navParams.get("index");
  }

  private ionSlideWillChange() {

  }
}