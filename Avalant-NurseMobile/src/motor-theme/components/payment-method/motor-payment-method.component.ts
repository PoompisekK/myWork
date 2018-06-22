import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
// import { NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { InAppBrowserObject, InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { PaymentService } from '../../../services/payment-services/payment-service';
import { MyOrderService } from '../../../services/my-order-service/my-order.service';
import { AppState } from '../../../app/app.state';
import { PaymentMethodModel } from '../../../model/payment/payment-method.model';
import { OrgBankModel } from '../../../model/my-order/org-bank.model';
import { OrderHeadModel } from '../../../model/my-order/order-head.model';
import { EAFRestApi } from '../../../constants/eaf-rest-api';
import { AppConstant } from '../../../constants/app-constant';

/**
 * Motor's Payment method Component
 * 
 * @author NorrapatN
 * @since Tue Nov 21 2017
 */
@Component({
  selector: 'motor-payment-method',
  templateUrl: 'motor-payment-method.component.html',
})
export class MotorPaymentMethodComponent implements OnInit, OnDestroy {

  public paymentData = "";
  public order: OrderHeadModel;
  public url = EAFRestApi.URL_MANUAL_SERVLET_UNAUTH + '?key=PaymentServiceServlet';
  public selectedPaymentMethod: string = '';

  @Output('paymentSuccess')
  private paymentSuccessEmitter: EventEmitter<any> = new EventEmitter();

  private paymentMethodList: PaymentMethodModel[] = [];
  private bankList: OrgBankModel[];

  private browserSubscription: {
    load?: Subscription,
    stop?: Subscription,
    error?: Subscription,
    exit?: Subscription,
  } = {};

  private paymentGatewayBrowser: InAppBrowserObject;

  private resolve: (value?: boolean | PromiseLike<boolean>) => void;

  private isSucceed: boolean;

  constructor(
    // private navParams: NavParams,
    private paymentService: PaymentService,
    private myOrderService: MyOrderService,
    private appState: AppState,
    private iab: InAppBrowser,
  ) {

  }

  public ngOnInit(): void {
    this.getPaymentMethod();
    this.getBankToList();
  }

  public ngOnDestroy(): void {
    this.browserUnsubscribe();
  }

  public proceedCreditCardPayment(): Promise<boolean> | boolean {
    if (this.selectedPaymentMethod === 'BP') {
      return true;
    } else if (this.selectedPaymentMethod === 'CREDIT') {
      return new Promise((resolve, reject) => {
        this.isSucceed = false;
        this.resolve = resolve;

        this.order = this.paymentService.order;

        const data = {
          PAY_METHOD: 'KBANK',
          ORDER_ID: this.order.id,
          PATCHFORM: 'MOBILEx',
        };

        this.paymentData = JSON.stringify(data);

        const gatewayUrl: string = this.url + "&payment_data=" + encodeURIComponent(this.paymentData);

        let paymentGatewayBrowser = this.paymentGatewayBrowser = this.iab.create(gatewayUrl, '_blank', {
          location: 'yes',
          toolbar: 'yes',
          toolbarposition: 'top',
          clearcache: 'yes',
          clearsessioncache: 'yes',
        });

        this.browserSubscription = {
          load: paymentGatewayBrowser.on('loadstart').subscribe((e) => this.browserLoadStart(e)),
          stop: paymentGatewayBrowser.on('loadstop').subscribe((e) => this.browserLoadStop(e)),
          error: paymentGatewayBrowser.on('loaderror').subscribe((e) => this.browserLoadError(e)),
          exit: paymentGatewayBrowser.on('exit').subscribe((e) => this.browserExit(e)),
        };

        paymentGatewayBrowser.show();
      });
    }
  }

  private getPaymentMethod(): void {
    // This orgID for Ybat only
    this.paymentService.getPaymentMethodFromOrgID(this.appState.currentOrganizationId).subscribe((response) => {
      console.log('getPaymentMethodFromOrgID => ', response);
      this.paymentMethodList = response;
    }, (error) => {
      console.warn('error => ', error);
    });
  }

  private getBankToList(): void {
    this.myOrderService.getBankListFromOrgID().subscribe(resp => {
      console.log('getBankListFromOrgID => ', resp);
      this.bankList = resp;
    }, error => {
      console.warn('Error => ', error);
    });
  }

  private buildPaymentMethodIconUrl(paymentMethodCode: string): string {
    if (paymentMethodCode === 'BP') {
      return 'assets/img/payment-method/bank_transfer.png';
    } else if (paymentMethodCode === 'CREDIT') {
      return 'assets/img/payment-method/visa.png';
    } else {
      return '';
    }
  }

  private browserUnsubscribe(): void {
    if (this.browserSubscription) {
      for (let key in this.browserSubscription) {
        this.browserSubscription[key].unsubscribe();
      }
    }
  }

  private browserLoadStart(e: InAppBrowserEvent): void {
    // console.debug('💭 IAB Load start :', e);
  }
  private browserLoadStop(e: InAppBrowserEvent): void {
    // console.debug('💭 IAB Load stop :', e);

    // Catch success payment url to close IAB & continue.
    if (e.url && e.url.indexOf(AppConstant.PAYMENT.KBANK.URL.APPROVED) > -1) {
      this.paymentGatewayBrowser.close();
      this.paymentSuccessEmitter.emit();

      this.isSucceed = true;

      if (this.resolve) {
        this.resolve(this.isSucceed);
      }
      this.resolve = void 0;
      return;
    }

    // this.paymentGatewayBrowser.executeScript({
    //   code: `alert('hello'); document.body.innerHTML`
    // }).then((result) => {
    //   console.debug('Result from exec :', result);
    // });
  }
  private browserLoadError(e: InAppBrowserEvent): void {
    // console.debug('💭 IAB Load error :', e);
  }
  private browserExit(e: InAppBrowserEvent): void {
    // console.debug('💭 IAB Load exit :', e);
    if (this.resolve) {
      this.resolve(this.isSucceed);
    }
    this.resolve = void 0;
  }

}
