import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, Events, IonicPage } from 'ionic-angular';

import { AnimateCss } from '../../animations/animate-store';
import { NotificationModel } from '../../model/notification/notification.model';

@IonicPage({
  segment: 'notifications'
})
@Component({
  selector: 'notification-page',
  templateUrl: 'notification.page.html',
  animations: [
    AnimateCss.peek(300),
  ]
})
export class NotificationPage implements OnInit, OnDestroy {

  private notificationList: NotificationModel[] = [];

  constructor(
    private events: Events,
    private alertCtrl: AlertController,
  ) {

    events.subscribe('notification:push', () => { });

  }

  public ngOnInit() {

  }

  public ngOnDestroy(): void {
    // Unsubscribe when unused.
    this.events.unsubscribe('notification:push', () => { });
  }

}