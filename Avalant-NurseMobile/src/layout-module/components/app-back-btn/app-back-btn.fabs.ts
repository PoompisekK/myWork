import { Component, ViewChild } from '@angular/core';
import { App, Events, FabContainer } from 'ionic-angular';

import { AnimateCss } from '../../../animations/animate-store';
import { AppState } from '../../../app/app.state';

/**
 * @author Bundit.Ng
 * @since  Mon Feb 19 2018
 * Copyright (c) 2018 Avalant Co.,Ltd.
 */
@Component({
  selector: 'app-back-fabs-btn',
  templateUrl: 'app-back-btn.fabs.html',
  animations: [
    AnimateCss.fade(),
    AnimateCss.fadeFromBottom(),
  ]
})
export class AppBackButtonFabs {

  @ViewChild('appBackfab') private fab: FabContainer;

  private isHidden: boolean;

  constructor(
    private app: App,
    private appState: AppState,
    private events: Events,
  ) {
  }

}
