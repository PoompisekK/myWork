import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { App, Events, FabContainer, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { AnimateCss } from '../../../animations/animate-store';
import { AppState } from '../../../app/app.state';
import { AppConstant } from '../../../constants/app-constant';
import { FabButton } from './fab-button';
import { UearnFabsController } from './fabs.controller';
import { FabButtonRemover } from './fabs.type';

/**
 * FABs Component
 * 
 * @author NorrapatN
 * @since Fri Aug 25 2017
 */
@Component({
  selector: 'uearn-fabs',
  templateUrl: './fabs.component.html',
  animations: [
    AnimateCss.fade(),
    AnimateCss.fadeFromBottom(),
  ]
})
export class UearnFabsComponent implements OnInit, OnDestroy {

  @Output()
  private notificationClick: EventEmitter<any> = new EventEmitter();

  @Output()
  private searchClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('fab')
  private fab: FabContainer;

  /**
   * Use transparent backdrop to handle click event when FAB is opened.
   */
  // isShowBackdrop: boolean;
  get isShowBackdrop(): boolean {
    return this.fab && this.fab._listsActive;
  }

  private isHidden: boolean;

  private notificationCount: number;

  // Can't inject to Constructor  !!
  private navCtrl: NavController;

  // private cartProductQuantityCount: number;
  // private oldCartProductQtyCount: number;
  private cartEvent$: Subscription;
  private allNotiCount: number;

  private onNotificationUpdatedCallback = (ev) => this.onNotificationUpdated(ev);

  private additionalButton: boolean = false;

  private fabButtons: FabButton[];

  constructor(
    private app: App,
    private appState: AppState,
    private events: Events,
    private fabsCtrl: UearnFabsController,
  ) {
    this.navCtrl = <any>((app.getActiveNavs() && app.getActiveNavs()[0]) || null); // Get Nav Controller from App instead of Injection.
    // this.isShowBackdrop = false; // by default

    fabsCtrl.registerFabsComponent(this);

    this.notificationCount = 0;

    this.fabButtons = [];
    this.isHidden = false;
  }

  public ngOnInit(): void {
    // this.cartProductQuantityCount = this.oldCartProductQtyCount = this.cartService.cartProductQuantityCount;
    // this.cartEvent$ = this.cartService.cartEvent$.subscribe((cartEvent) => {
    //   // console.debug('Cart Event :', cartEvent);
    //   if (this.cartService.cartProductQuantityCount != this.oldCartProductQtyCount) {
    //     this.cartProductQuantityCount = this.oldCartProductQtyCount = this.cartService.cartProductQuantityCount;
    //     this.allNotiCount = this.cartProductQuantityCount + this.notificationCount;
    //     this.appState.cartButtonBouncing = 'animate';
    //   }
    // }, error => {
    //   console.warn('Error => ', error);
    // });
    this.events.subscribe('notification:push', this.onNotificationUpdatedCallback);
  }

  public ngOnDestroy(): void {
    this.events.unsubscribe('notification:push', this.onNotificationUpdatedCallback);
  }

  private onNotiClick(e): void {
    // console.log('active : ', this.navCtrl.getActive().component.name);

    // Check is it on NotificationPage ?
    if (this.navCtrl.getActive().component.name !== 'NotificationPage') {
      this.navCtrl.push('NotificationPage');
      this.notificationClick.emit(e);
    }

  }

  public onNotificationUpdated(e: any): void {
    this.notificationCount = e.unreadCount;
    this.allNotiCount = this.notificationCount;
  }

  private onSearchClick(e): void {
    // console.log('active : ', this.navCtrl.getActive().component.name);

    if (this.navCtrl.getActive().component.name !== 'SearchPage') {

      let paramsData = {};
      paramsData[AppConstant.NavParamsKey.ORGANIZATION_ID] = this.appState.currentOrganizationId;
      this.navCtrl.push('SearchPage', paramsData);
      this.searchClick.emit(e);
    }
  }

  public onCartClick(): void {
    if (this.navCtrl.getActive().component.name !== 'CartPage') {
      this.navCtrl.push('CartPage');
    }
  }

  /**
   * Backdrop click event
   * 
   * @param e Mouse event
   */
  private onBdClick(e: MouseEvent): void {
    this.fab.close();
  }

  private pushPage(pageName: string): void {
    this.navCtrl.push(pageName);
  }

  public setAdditionalButton(value: boolean): void {
    this.additionalButton = value;
  }

  public addButton(fab: FabButton): FabButtonRemover {
    if (!fab) {
      return () => { };
    }

    this.fabButtons.push(fab);

    // Return remove function
    return () => {
      this.fabButtons.splice(this.fabButtons.indexOf(fab), 1);
    };
  }

  private onCustomButtonClick(fab: FabButton): void {
    if (!fab) return;

    if (typeof fab.callback === 'function') {
      fab.callback(this.navCtrl, fab);
    }
  }

  /**
   * Show the FAB.
   */
  public show(): void {
    console.debug('💭 Show this FAB !!!');

    this.isHidden = false;
  }

  /**
   * Hide the FAB.
   */
  public hide(): void {
    console.debug('💭 Hide this FAB !!!');

    this.isHidden = true;
  }

  /**
   * Toggle the FAB.
   */
  public toggle(): void {
    this.isHidden = !this.isHidden;
  }

}
