import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';

@IonicPage({
  // segment: 'index',
  priority: 'high',
})
@Component({
  selector: 'tab-page',
  templateUrl: 'tab.page.html',
})
export class TabPage {

  @ViewChild('tabs')
  private superTabs: SuperTabs;

  private brandPage: any = 'BrandPage';
  private feedPage: any = 'FeedPage';

  // minePage: any = 'MinePage';
  // placePage: any = 'PlacePage';

  constructor(
    private ngZone: NgZone,
    private navCtrl: NavController,
    private navParams: NavParams,
    //private translation: TranslationService
  ) {
    //let translationProviders = this.translation.configuration.providers;
    //console.log('translation providers :', translationProviders);
    //this.translation.init();
  }

  public ionViewDidLoad() {
    console.log('ionViewDidLoad TabPage');

    /***
     * Preload each tabs
     */
    this.ngZone.run(() => {
      this.superTabs._tabs.forEach((tab) => tab.setActive(true));
    });

  }

}
