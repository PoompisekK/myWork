import { Component, Directive, HostListener, Input, OnInit } from '@angular/core';
import { Events, NavController, ViewController } from 'ionic-angular';

import { AnimateCss } from '../../animations/animate-store';
import { isDev } from '../../constants/environment';
import { NotiPage } from '../../workforce/pages/noti-page/noti-page';

/**
* @author Bundit.Ng
* @since  Mon Feb 19 2018
* Copyright (c) 2018 Avalant Co.,Ltd.
*/

@Component({
  selector: 'app-nav-header',
  templateUrl: 'app-nav-header.component.html',
  animations: [
    AnimateCss.peek()
  ]
})
export class AppNavHeaderComponent implements OnInit {
  @Input("pageName") private pageName: string;
  @Input("buttonCfg") private buttonCfg: AppNavConfig;

  private isHideNotiBtn: boolean = false;
  private buttons: AppNavButtonConfig[] = [];
  constructor(
    private navCtrl: NavController,
  ) {

  }

  public ngOnInit(): void {
    isDev() && console.log("this.buttonCfg :", this.buttonCfg);
    if (this.buttonCfg) {
      this.isHideNotiBtn = this.buttonCfg.hideNoti;
      this.buttons = this.buttonCfg.buttons;
    }
  }

  public goNotiPage() {
    const activeName: string = this.navCtrl.getActive().name;
    if (activeName != NotiPage.name) {
      this.navCtrl.push(NotiPage, {}, { animate: true, direction: "forward" });
    }
  }
}

export class AppNavButtonConfig {
  public name: string;
  public icon: string;
  public click: () => void;
}

export class AppNavConfig {
  public hideNoti: boolean = false;
  public buttons: AppNavButtonConfig[] = [];
}

/**
 * @author Bundit.Ng
 * @since  Mon Mar 19 2018
 * Copyright (c) 2018 Avalant Co.,Ltd.
 */
@Directive({
  selector: '[click-goto-notipage]'
})
export class GotoNotiPageDirective {
  constructor(
    private navCtrl: NavController,
  ) {
  }

  @HostListener('click', ['$event']) public onClick($event) {
    const activeName: string = this.navCtrl.getActive().name;
    if (activeName != NotiPage.name) {
      this.navCtrl.push(NotiPage, {}, { animate: true, direction: "forward" });
    }
  }
}

/**
 * @author Bundit.Ng
 * @since  Wed Mar 28 2018
 * Copyright (c) 2018 Avalant Co.,Ltd.
 */
@Directive({
  selector: '[close-modal-view]'
})
export class CloseModalViewCtrlDirective {
  constructor(
    private events: Events,
    private viewCtrl: ViewController,
  ) {
  }

  @HostListener('click', ['$event']) public onClick($event) {
    console.log("this.viewCtrl:", this.viewCtrl.name || this.viewCtrl);
    this.viewCtrl && this.viewCtrl.dismiss().then(() => {
      this.events.publish("modal:dismiss");
    });
  }
}