import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, Content, Events, IonicPage, NavController, Slides } from 'ionic-angular';
import { Subject } from 'rxjs';

import { AppState } from '../../app/app.state';
import { UearnFabsController } from '../../layout-module/components/fabs/fabs.controller';
import { StepBarComponent } from '../../layout-module/components/step-bar/step-bar.component';
import { StepItem } from '../../layout-module/components/step-bar/step-item';
import { PaymentSuccessPage } from '../../pages/payment-page/payment-success.page';
import { MotorShippingComponent } from '../components/motor-shipping.component';
import { MotorOrderSummary } from '../components/order-summary/motor-order-summary.component';
import { MotorPaymentMethodComponent } from '../components/payment-method/motor-payment-method.component';

interface FooterStepButtonText {
  prevText?: string;
  prevFn?: () => boolean | Promise<boolean>;
  nextText?: string;
  nextFn?: () => boolean | Promise<boolean>;
}

/**
 * Motor's Cart page
 * 
 * @author NorrapatN
 * @since Wed Nov 01 2017
 */
@IonicPage({
  segment: 'motor-cart',
})
@Component({
  selector: 'motor-cart-page',
  templateUrl: 'motor-cart.page.html',
})
export class MotorCartPage implements OnInit, OnDestroy {

  @ViewChild('pageSlide')
  private pageSlide: Slides;

  @ViewChild(Content)
  public content: Content;

  @ViewChild('stepBar')
  private stepBar: StepBarComponent;

  @ViewChild(MotorShippingComponent)
  public motorShipping: MotorShippingComponent;

  @ViewChild(MotorPaymentMethodComponent)
  public motorPaymentMethod: MotorPaymentMethodComponent;

  @ViewChild(MotorOrderSummary)
  private orderSummary: MotorOrderSummary;

  public carts: any[];

  private ngUnSubscriber: Subject<boolean> = new Subject();

  private stepItems: StepItem[];

  private slideContentMaxHeight: number;

  private customBackButtonFnDelegate: () => boolean;

  private footerStepButtonTextList: FooterStepButtonText[];

  private isDisabledFooterStepButton: boolean;

  constructor(
    private navCtrl: NavController,
    private appState: AppState,
    private fabCtrl: UearnFabsController,
    private events: Events,
    private alertCtrl: AlertController,
  ) {

  }

  public ngOnInit(): void {
    // Hide FAB
    this.fabCtrl.hide();

    // console.log("SHOP_TYPE_MS => STORE:", this.carts)

    // Mockup for Step items
    this.stepItems = [
      new StepItem({
        text: 'Cart',
        icon: 'cart',
      }),
      new StepItem({
        text: 'Shipping',
        icon: 'cube',
      }),
      new StepItem({
        text: 'Payment',
        icon: 'card',
      }),
      new StepItem({
        text: 'Checkout',
        icon: 'md-checkmark-circle-outline',
        isNoWrap: true,
      }),
    ];

    /**
     * Mocked up Footer step buttons.
     */
    this.footerStepButtonTextList = [
      { // Cart
        prevText: 'Go back shopping',
        nextText: 'Shipping',
        nextFn: () => {
          // Currently I can't check out with multiple Shop type.
          // It necessary to pick one Shop type -- Cart.
          if (!this.carts.length) {
            this.alertCtrl.create({
              title: 'Error',
              message: 'ไม่มีสินค้าในตระกร้า',
              buttons: ['OK'],
            }).present();

            this.isDisabledFooterStepButton = false;
            return false;
          }
          // this.cartService.selectCart = this.carts && this.carts[0];
          this.motorShipping.reloadShippingList();
          return true;
        }
      },
      { // Shipping Address
        prevText: 'Cart', // Not need to show ?
        nextText: 'Payment',
        nextFn: () => {
          if (this.motorShipping.getSelectedAddress()) {
            return true;
          } else {
            this.alertCtrl.create({
              title: 'Error',
              message: `You must select your shipping address.`,
              buttons: ['Sure']
            }).present();
            this.isDisabledFooterStepButton = false;

            return false;
          }
        },
      },
      { // Payment method
        prevText: 'Shipping',
        nextText: 'Proceed Order',
        nextFn: () => {
          if (!this.motorPaymentMethod.selectedPaymentMethod) {
            this.alertCtrl.create({
              message: 'Please select payment method',
              buttons: ['OK'],
            }).present();

            this.isDisabledFooterStepButton = false;

            return false;
          }

          this.orderSummary.loadCarts();

          return new Promise<boolean>((resolve, reject) => {
            this.motorShipping.proceed().then((result) => {
              this.isDisabledFooterStepButton = false;
              resolve(result);
            });
          });
        },
      },
      { // Summary & Checkout
        // prevText: 'Payment',
        nextText: 'Confirm Order',
        // Merge shipping & payment to this. By using nested promise.
        nextFn: () => new Promise<boolean>((resolve, reject) => {

          // This Credit card will take process when selected payment is "CREDIT".
          let creditCartPaymentResult = this.motorPaymentMethod.proceedCreditCardPayment();
          if (creditCartPaymentResult instanceof Promise) {
            creditCartPaymentResult.then((creditCartResult) => {
              if (!creditCartResult) {
                this.navCtrl.setRoot(PaymentSuccessPage, {}, { animate: true });
                resolve(creditCartResult);
                return;
              }

            });
          } else {
            // Transfer money method will make this return true.

            this.navCtrl.setRoot(PaymentSuccessPage, {}, { animate: true });
            resolve(creditCartPaymentResult);
            return;
          }

        }),
        prevFn: () => false,
      },
    ];

    this.customBackButtonFnDelegate = () => this.customBackButtonFn();
    this.loadOrCalculateCarts();

  }

  public ngOnDestroy(): void {
    this.ngUnSubscriber.unsubscribe();

    // Then Show FAB when exit cart.
    this.fabCtrl.show();
  }

  public ionViewDidEnter(): void {
    this.pageSetup();
    this.loadOrCalculateCarts();

  }

  /**
   * Like a Angular's "canDeactivate" (Router).
   * 
   * But this on Ionic. Use to catch before Back function is invoked.
   * I will you this for make it slide back to first cart page before pop this view out.
   * 
   * @returns boolean True is can leave this view.
   */
  private customBackButtonFn(): boolean {
    console.debug('💭 Custom Callback for back button is invoked.');

    if (this.pageSlide.getActiveIndex() > 0) {

      // Slide to previous.
      this.prevPage();

      // IMPORTANT thing is returning boolean.
      return false;
    } else {
      return true;
    }
  }

  private onNextClick(): void {
    this.isDisabledFooterStepButton = true;

    let nextFnResult = this.getCurrentFooterStepButton().nextFn();

    if (nextFnResult instanceof Promise) {
      nextFnResult.then((ret) => {
        if (ret) {
          this.nextPage();
        }
        this.isDisabledFooterStepButton = false;
      }).catch((error) => {
        console.error('⛔️️ Error :', error);
        this.isDisabledFooterStepButton = false;
      });
    } else if (nextFnResult) {
      this.nextPage();
    }
  }

  private onBackClick(): void {
    this.isDisabledFooterStepButton = true;

    let backFn = () => {
      // Call Custom back button manually.
      if (this.customBackButtonFn()) {
        if (this.navCtrl.canGoBack()) {
          this.navCtrl.pop();
        } else {
          this.navCtrl.goToRoot({ animate: true });
        }
      }
      this.isDisabledFooterStepButton = false;
    };

    let prevFnResult = this.getCurrentFooterStepButton().prevFn();
    if (typeof prevFnResult === 'boolean') {
      if (!prevFnResult) {
        this.isDisabledFooterStepButton = false;
        return;
      } else {
        backFn();
      }
    } else {
      prevFnResult.then((ret) => {
        if (ret) {
          backFn();
        }
      });
    }
  }

  /**
   * NorrapatN's Note : 
   *   Should unlock page slider first to let it slide. And then lock it again.
   */
  public nextPage(): void {
    this.pageSlide.lockSwipes(false);
    this.pageSlide.slideNext();
    this.pageSlide.lockSwipes(true);
    this.isDisabledFooterStepButton = false;
  }

  /**
   * Similar to {@link nextPage}
   */
  public prevPage(): void {
    this.pageSlide.lockSwipes(false);
    this.pageSlide.slidePrev();
    this.pageSlide.lockSwipes(true);
    this.isDisabledFooterStepButton = false;
  }

  private onSlideNextStart(): void {
    this.stepBar.nextStep();
  }

  private onSlidePrevStart(): void {
    this.stepBar.prevStep();
  }

  private pageSetup(): void {

    // EXPERIMENTAL : STOP PROPAGATION.
    this.pageSlide.touchMoveStopPropagation = false;

    // Lock swiper
    this.pageSlide.lockSwipes(true);

    // this.pageSlide.autoHeight = true;
    let pageSlideElement: HTMLElement = this.pageSlide.getNativeElement();
    let contentHeight: number = this.content.contentHeight;
    let slideOffsetTop: number = pageSlideElement.offsetTop;
    this.slideContentMaxHeight = (contentHeight - slideOffsetTop);

    // Accessing to inner of Slides component
    let innerChildren = pageSlideElement.children[0].children[0].children;
    for (let i = 0; i < innerChildren.length; i++) {
      (<HTMLElement>innerChildren[i]).style.maxHeight = this.slideContentMaxHeight + 'px';
    }
  }

  private loadOrCalculateCarts(): void {
    if (this.appState.businessUser) {
      // this.cartService.loadCartData();
    } else {
      // this.cartService.reCalFromCart();
    }

    let cartFilterFn = (response?) => {
      // this.carts = this.cartService.filterCartByOrganization(this.appState.currentOrganizationId);
    };

    cartFilterFn();

    // this.cartService.cartEvent$.takeUntil(this.ngUnSubscriber).subscribe((response) => cartFilterFn(response), error => {
    //   console.warn('Error => ', error);
    // });
  }

  private getCurrentFooterStepButton(): FooterStepButtonText {
    let currentFooterStepButton = this.footerStepButtonTextList[this.pageSlide.getActiveIndex()];
    if (!currentFooterStepButton) {
      return currentFooterStepButton;
    }

    if (!currentFooterStepButton.nextFn || typeof currentFooterStepButton.nextFn !== 'function') {
      currentFooterStepButton.nextFn = () => true;
    }

    if (!currentFooterStepButton.prevFn || typeof currentFooterStepButton.prevFn !== 'function') {
      currentFooterStepButton.prevFn = () => true;
    }

    return currentFooterStepButton;
  }

}
