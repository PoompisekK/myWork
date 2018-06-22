import { Injectable, OnDestroy } from '@angular/core';
import { Platform } from 'ionic-angular/platform/platform';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { HeaderBarComponent } from './header-bar.component';
import { Events } from 'ionic-angular';

/**
 * Header Bar Controller
 * 
 * @author NorrapatN
 * @since Wed Jun 07 2017
 */
@Injectable()
export class HeaderBarController implements OnDestroy {

  private allowClose: boolean;

  private headerBarStack: HeaderBarComponent[];

  private unregisterBackButtonFn: Function;

  constructor(
    private platform: Platform,
    private toastCtrl: ToastController,
    private events: Events,
  ) {
    this.headerBarStack = [];

    this.overridePhysicalBackButton();
  }

  public ngOnDestroy(): void {
    // Stop listening back button for this service.
    this.unregisterBackButtonFn();
  }

  /**
   * Register Header bar Component instance to Header bar Controller.
   * 
   * @param instance Header bar Component instance.
   * @returns Function of Unregister (destroy).
   * 
   * @private Internal use
   */
  public _registerHeaderBar(instance: HeaderBarComponent): Function {
    if (this.headerBarStack.indexOf(instance) < 0) {
      this.headerBarStack.push(instance);
    }

    return () => {
      this.headerBarStack.splice(this.headerBarStack.indexOf(instance), 1);
    };
  }

  public getActiveInstance(): HeaderBarComponent {
    return this.headerBarStack[this.headerBarStack.length - 1];
  }

  public getHeaderBars(): HeaderBarComponent[] {
    return this.headerBarStack;
  }

  public closingApp(): void {
    if (!this.allowClose) {
      // console.log("setAllowClose");
      this.allowClose = true;
      let toast = this.toastCtrl.create({
        message: 'Press again to exit.',
        duration: 2000,
        dismissOnPageChange: true
      });
      //after 2 millisec toast will close
      toast.onDidDismiss(() => {
        this.allowClose = false;
      });
      toast.present();

      // return this.allowClose;
    } else {
      this.platform.exitApp();
      // return true;
    }
  }

  public broadcastBackButtonActivated(): void {
    console.debug('💭 Broadcast that back button is activated.');

    this.events.publish('app:goBack');
    // this.getActiveInstance().backButtonFn(null);
  }

  private overridePhysicalBackButton(): void {
    console.debug('💭 Starting override physical back button on HeaderBarController...');

    // TODO: Subscribe for Notifications
    // console.debug('Header Bar got NavParams :', this.navParams.data);
    // console.debug('Header Bar got Organization ID : ', this.appState.currentOrganizationId);

    // if (this.isCustomBackButton) {
    //   this.registeredBackButton = this.platform.registerBackButtonAction(this.backButtonClick.bind(this), 100); // Return unregister function
    // }
    this.unregisterBackButtonFn = this.platform.registerBackButtonAction(() => {
      this.broadcastBackButtonActivated();
    });

  }

}
