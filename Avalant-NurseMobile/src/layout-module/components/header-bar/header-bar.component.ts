import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TranslationService } from 'angular-l10n';
import {
  AlertController,
  Events,
  IonicApp,
  MenuController,
  NavController,
  NavParams,
  Platform,
  ViewController,
} from 'ionic-angular';
import { Navbar } from 'ionic-angular/components/toolbar/navbar';
import { Subscription } from 'rxjs';

import { AnimateCss } from '../../../animations/animate-store';
import { AppState } from '../../../app/app.state';
import { AppConstant } from '../../../constants/app-constant';
import { AppBridge } from '../../../services/app-bridge/app-bridge.service';
import { MessengerService } from '../../../services/messenger/messenger.service';
import { HeaderBarController } from './header-bar.controller';

/**
 * @author Bundit.Ng
 * @since  Fri May 19 2017 1:50:22 PM
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@Component({
  selector: '[header-bar]',
  templateUrl: 'header-bar.component.html',
  styleUrls: ['/header-bar.component.scss'],
  animations: [
    AnimateCss.bounce(500),
  ]
})
export class HeaderBarComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input('logo')
  private isShowLogo: boolean = true;

  @Input('marquee')
  private marquee: boolean = false;

  @Input()
  private title: string;

  /**
   * @deprecated Listen on "back-click" event instead -OR- Input "backButtonCallback".
   */
  @Input('custom-back-button')
  private isCustomBackButton: boolean = false;

  @Input('search')
  private isShowSearchButton: boolean = false;

  @Input('notification')
  private isShowNotiButton: boolean = false;

  @Input('message')
  private isShowMessageButton: boolean = false;

  @Input('cart')
  private isShowCartButton: boolean = true;

  @Input('cart-enabled')
  @Input('cartEnabled')
  public isCartButtonEnabled: boolean = true;

  @Input('noti-enabled')
  @Input('notiEnabled')
  private isNotificationButtonEnabled: boolean = true;

  @Input()
  private backButtonCallback: () => boolean | Promise<boolean>;

  @Output('back-click')
  @Output('backClick')
  private backButtonClickEmitter: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('navbar')
  private navBar: Navbar;

  private registeredBackButton: Function;

  // Messenger Service
  private messageUnreadCount: number;
  private messageEvent$: Subscription;

  // Cart Service
  private cartProductQuantityCount: number;
  private oldCartProductQtyCount: number;
  private cartEvent$: Subscription;
  private allowClose: boolean = false;

  private unregisterHeaderber: Function;
  private originalBackButtonCallback: (ev: UIEvent) => void;

  constructor(
    private headerBarCtrl: HeaderBarController,
    private platform: Platform,
    private navCtrl: NavController,
    private navParams: NavParams,
    private messengerService: MessengerService,
    private appBridge: AppBridge,
    private appState: AppState,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private ionicApp: IonicApp,
    private menuCtrl: MenuController,
    private translateService: TranslationService,
    private events: Events,
  ) {
    // Register with Controller.
    this.unregisterHeaderber = headerBarCtrl._registerHeaderBar(this);
  }

  public ngOnInit(): void {
    // console.log(this.navCtrl.getActive().component);

    // Subscribe to Messenger service
    this.messageUnreadCount = this.messengerService.messageUnreadCount; // Get current unread count
    this.messageEvent$ = this.messengerService.messageUnreadCount$.subscribe((data) => {
      this.messageUnreadCount = data;
    }, error => {
      console.warn('Error => ', error);
    });

    // this.cartProductQuantityCount = this.oldCartProductQtyCount = this.cartService.cartProductQuantityCount;
    // this.cartEvent$ = this.cartService.cartEvent$.subscribe((cartEvent) => {
    //   // console.debug('Cart Event :', cartEvent);
    //   if (this.cartService.cartProductQuantityCount != this.oldCartProductQtyCount) {
    //     this.cartProductQuantityCount = this.oldCartProductQtyCount = this.cartService.cartProductQuantityCount;
    //     this.appState.cartButtonBouncing = 'animate';
    //   }
    // }, error => {
    //   console.warn('Error => ', error);
    // });

    if (this.platform.is('ios')) {
      this.translateBackButton();
      this.events.subscribe('translation:changed', () => this.translateBackButton());
    }

    if (!this.appState.businessUser) {
      this.isShowNotiButton = false;
    }

  }

  public ngOnDestroy(): void {
    this.messageEvent$ && this.messageEvent$.unsubscribe();
    this.cartEvent$ && this.cartEvent$.unsubscribe();

    this.unregisterHeaderber();
    this.unhookBackButtonFn();
  }

  public ngAfterViewInit(): void {
    this.hookBackButtonFn();
  }

  private backButtonFn(ev: UIEvent) {
    console.info(`Hi, I'm back button :)`);
    this.backButtonClickEmitter.emit();

    // Check back btn callback.
    if (typeof this.backButtonCallback === 'function') {

      // Get result from Callback and then check type (Boolean / Promise).
      let backButtonCallbackResult = this.backButtonCallback();
      if (backButtonCallbackResult instanceof Promise) {
        backButtonCallbackResult.then((result) => {
          if (result) {
            // Go back (Pop page) when true.              
            this.originalBackButtonCallback.call(this.navBar, ev);
          }
        });
      } else {
        // Assume result as boolean.
        if (backButtonCallbackResult) {
          // Go back (Pop page) when true.
          this.originalBackButtonCallback.call(this.navBar, ev);
        }
      }
    } else {
      this.originalBackButtonCallback.call(this.navBar, ev);
    }
  }

  /**
   * Override Header Back button.
   */
  private hookBackButtonFn(): void {
    this.originalBackButtonCallback = this.navBar.backButtonClick;
    this.navBar.backButtonClick = (ev) => this.backButtonFn(ev);
  }

  /**
   * Undo change of backButtonClick callback.
   */
  private unhookBackButtonFn(): void {
    this.navBar.backButtonClick = this.originalBackButtonCallback;
  }

  private translateBackButton(): void {
    const subscriber = this.translateService.translateAsync('COMMON.BUTTON.BACK').subscribe((translated: string) => {
      this.viewCtrl.setBackButtonText(translated);
      setTimeout(() => {
        subscriber.unsubscribe();
      });
    });
  }

  /* private registerBackButton(): void {

    if (!this.allowClose) {
      // console.log("setAllowClose");
      this.allowClose = true;
      this.isRootPageApp = true;
      let toast = this.toastCtrl.create({
        message: 'Press again to exit.',
        duration: 2000,
        dismissOnPageChange: true
      });
      //after 2 millisec toast will close
      toast.onDidDismiss(() => {
        this.allowClose = false;
        this.isRootPageApp = false;
      });
      toast.present();
    } else {
      //if allowClose and in 2 millisec app will exit
      this.platform.exitApp();
    }
  } */

  /**
   * @deprecated
   */
  private backButtonClick(): void {
    this.backButtonClickEmitter.emit();
  }

  private notiClick(): void {
    if (this.isNotificationButtonEnabled) {
      this.navCtrl.push('NotificationPage');
    }
  }

  private searchClick(): void {
    // let navOp: NavOptions = {
    //   animate: true,
    //   // animation: "string",
    //   direction: "forward",
    //   duration: 750,
    //   easing: "fade",
    //   keyboardClose: true,
    //   progressAnimation: true,
    // };
    let paramsData = {};
    paramsData[AppConstant.NavParamsKey.ORGANIZATION_ID] = this.appState.currentOrganizationId;
    // this.keyboard.show();
    this.navCtrl.push('SearchPage', paramsData);
  }

  private chatClick(): void {
    this.clearUnread();

    this.appBridge.switchToMessenger((data) => {
      console.info('Switched application');
    }, (error) => {
      console.warn("Can't switch application : " + error);
      this.alertCtrl.create({
        title: 'Switch to messenger',
        message: error,
        buttons: ['OK'],
      }).present();
    });
  }

  private cartClick(): void {
    // if (this.isCartButtonEnabled) {
    //   this.navCtrl.push(this.cartService.cartPageName);
    // }
  }

  private clearUnread(): void {
    this.messageUnreadCount = this.messengerService.messageUnreadCount = 0;

  }

}
