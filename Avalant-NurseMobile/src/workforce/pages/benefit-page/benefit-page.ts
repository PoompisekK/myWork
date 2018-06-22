import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { Loading } from 'ionic-angular/components/loading/loading';

import { AnimateCss } from '../../../animations/animate-store';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { BenefitService } from '../../service/benefitService';
import { BenefitDetailPage } from '../benefit-detail-page/benefit-detail-page';

@Component({
  selector: 'benefit-page',
  templateUrl: 'benefit-page.html',
  animations: [
    AnimateCss.peek(),
  ]
})
export class BenefitPage
// implements OnInit 
{
  private benefitsList: any[] = [];
  private isBenefitsLoading: boolean = false;
  private summaryDetailType: any = {};
  constructor(
    public navCtrl: NavController,
    public appLoadingService: AppLoadingService,
    public benefitService: BenefitService,
  ) {

  }

  @ViewChild(Slides) private slides: Slides;

  private ionSlideWillChange() {
    if (this.summaryDetailType.show) {
      let currentIndex = this.slides && this.slides.getActiveIndex();
      console.log("currentIndex:", currentIndex);
      let itmDtlM = this.benefitsList.length && this.benefitsList[currentIndex];
      this.showDetail(itmDtlM);
    }
  }

  private seeDetail(index: number) {
    this.navCtrl.push(BenefitDetailPage, {
      type: index,
      data: this.benefitsList || []
    });
  }

  private doRefresh(refresher) {
    // refresher
    this.appLoadingService.showLoading();
    // this.benefitsList = [];
    this.getBenefitSummarry(() => {
      refresher.complete();
    });
  }

 public ionViewWillEnter() {
    this.getBenefitSummarry();
  }

  private closeDetail(clickItem) {
    this.benefitsList && this.benefitsList.forEach((item) => {
      item.show = true;
      item.selfShow = false;
    });
    this.summaryDetailType.show = false;
  }

  private getBenefitSummarry(cb?: () => void) {
    this.isBenefitsLoading = true;
    this.benefitService.getBenefitSummaryList().subscribe((resp) => {
      this.benefitsList = resp;
      this.isBenefitsLoading = false;
      console.log("this.benefitsList:", this.benefitsList);
      this.appLoadingService.hideLoading().then(() => {
        cb && cb();
      });
    }, (errResp) => {
      this.isBenefitsLoading = false;
      console.error("errResp:", errResp);
      this.appLoadingService.hideLoading().then(() => {
        cb && cb();
      });
    });
  }

  private getPercentAmt(benefitItm): number | string {
    let amt = parseInt(benefitItm.amount || 0);
    let userAmt = parseInt(benefitItm.user || 0);
    if (amt == 0 && amt == userAmt) {
      return 100;
    } else {
      return ((userAmt / amt) * 100);
    }
  }

  private showDetail(clickItem) {
    if (clickItem && !clickItem.selfShow) {
      this.summaryDetailType.show = false;
      this.benefitsList && this.benefitsList.forEach((item) => {
        if (clickItem !== item) {
          clickItem.selfShow = false;
        } else {
          clickItem.selfShow = true;
          this.appLoadingService.showLoading();
          this.benefitService.getBenefitSummaryDetail({ "benefitType": clickItem.benefitType }).subscribe(resp => {
            this.summaryDetailType.dataList = resp;
            console.log("postBenefitSummaryDetail:", resp);
            this.appLoadingService.hideLoading().then(() => {
              this.summaryDetailType.show = true;
            });
          });
        }
      });
    }
  }

}
