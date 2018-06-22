import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams } from 'ionic-angular';

import { AnimateCss } from '../../animations/animate-store';
import { AppState } from '../../app/app.state';
import { AppConstant } from '../../constants/app-constant';
import { OrderAddressModel } from '../../model/my-order/order-address.model';
import { OrderHeadModel } from '../../model/my-order/order-head.model';
import { OrderLineModel } from '../../model/my-order/order-line.model';
import { ShippingModel } from '../../model/user/shipping.model';
import { EAFRestUtil } from '../../services/eaf-rest/eaf-rest.util';
import { PaymentService } from '../../services/payment-services/payment-service';
import { ShippingService } from '../../services/shipping-services/shipping.service';
import { ObjectsUtil } from '../../utilities/objects.util';

/**
 * Motor's Shipping Component
 * 
 * Copied from {@link CartDetailShippingComponent}
 * 
 * @author NorrapatN
 * @since Mon Nov 13 2017
 */
@Component({
  selector: 'shipping',
  templateUrl: './motor-shipping.component.html',
  animations: [
    AnimateCss.peek(300),
  ]
})
export class MotorShippingComponent {

  private addressList: any[] = [];
  private shippingList: any[] = [];

  private selectedAddress: ShippingModel;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private appState: AppState,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private paymentService: PaymentService,
    private shippingService: ShippingService,
  ) {
    // console.log(this.parentPage);
    // console.log(this.cartService.selectCart);
    // console.log(this.paymentService);
    this.reloadShippingList();
    // console.log("this.shippingList:", this.shippingList);
  }

  public reloadShippingList(): void {
    if (this.appState.shippingList) {
      this.shippingList = this.appState.shippingList;
    }
  }

  public proceed(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.selectedAddress) {
        this.alertCtrl.create({
          title: 'Error',
          message: `You must select your shipping address.`,
          buttons: ['Sure']
        }).present();
        resolve(false);
        return;
      }

      this.shippingService.selectAddress = this.selectedAddress;
      this.shippingService.shippingProduct(AppConstant.ORDER_STATUS.WAITING_FOR_PAYMENT, response => {
        if (response.responceCode == 'ERROR') {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: response,
            buttons: ['Dismiss']
          });
          alert.present();
          resolve(false);
          // reject(response);
        } else {
          this.shippingService.couponCode = null;//clear value coupon
          this.paymentService.order = EAFRestUtil.mapEAFResponseModel(OrderHeadModel, response.orderhead);
          this.paymentService.orderLines = EAFRestUtil.mapResponseList(OrderLineModel, response.orderlines);
          this.paymentService.orderAddresses = EAFRestUtil.mapResponseList(OrderAddressModel, response.orderAddresses);
          // this.cartService.removeAllItemFromCart(this.cartService.selectCart);

          resolve(true);
        }
      }, (error) => {
        // resolve(false);
        resolve(true); // TODO: Ignore this error for DEMO !!. Remember to change it back to false.
      });
    });
  }

  public getSelectedAddress(): ShippingModel {
    return this.selectedAddress;
  }

  private canEditThisAddress(userAddressShipping: ShippingModel): boolean {
    return ObjectsUtil.isEmptyObject(this.appState.businessUser) || (userAddressShipping.addressTypeId && userAddressShipping.addressTypeId == AppConstant.ADDRESS_TYPE.SHIPPING);
  }

  private gotoAddNewAddress() {
    // this.navCtrl.push(AddShippingComponent, {}, { animate: true, animation: 'transition', direction: 'forward' });
  }

  private gotoPayment(shippingModel: ShippingModel) {
    this.shippingService.selectAddress = shippingModel;//=ObjectsUtil.assign(shippingModel,AddressModel);
    // console.log(this.shippingService.selectAddress);
    this.shippingService.shippingProduct(AppConstant.ORDER_STATUS.WAITING_FOR_PAYMENT, response => {
      if (response.responceCode == 'ERROR') {
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: response,
          buttons: ['Dismiss']
        });
        alert.present();
      } else {
        this.shippingService.couponCode = null;//clear value coupon
        this.paymentService.order = EAFRestUtil.mapEAFResponseModel(OrderHeadModel, response.orderhead);
        this.paymentService.orderLines = EAFRestUtil.mapResponseList(OrderLineModel, response.orderlines);
        this.paymentService.orderAddresses = EAFRestUtil.mapResponseList(OrderAddressModel, response.orderAddresses);
        // console.log('(ﾟДﾟ)ﾉ => ', this.paymentService.order);
        // this.cartService.removeAllItemFromCart(this.cartService.selectCart);
        // this.parentPage.gotoPayment();
        // TODO: Goto payment page
      }
    });
    //this.parentPage.gotoPayment();
  }

  private delete(index: number, shippingModel: ShippingModel) {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this address?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel clicked');
        }
      }, {
        text: 'Confirm',
        handler: () => {
          let loading = this.loadingCtrl.create({
            content: `Deleting address...`,
          });
          loading.present();

          if (this.appState.businessUser) {
            this.shippingService.deleteShippingAddress(shippingModel).subscribe(resp => {
              this.shippingList.splice(index, 1);
              this.appState.shippingList = this.shippingList;
              // console.log('Delete resp => ', resp);
            }, error => {
              console.warn('Error => ', error);
            });
          } else {
            this.appState.shippingList.splice(index, 1);
          }
          loading.dismiss();
        }
      }
      ]
    });
    alert.present();
  }

  private edit(address) {
    // this.navCtrl.push(AddShippingComponent, { address });
  }

  private selectAddress(shippingModel: ShippingModel): void {
    this.selectedAddress = shippingModel;
  }

}