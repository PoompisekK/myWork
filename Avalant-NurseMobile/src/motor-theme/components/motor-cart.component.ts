import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppConstant } from '../../constants/app-constant';

/**
 * Motor Cart Component
 * 
 * @author NorrapatN
 * @since Mon Nov 13 2017
 */
@Component({
  selector: 'motor-cart',
  templateUrl: './motor-cart.component.html',
})
export class MotorCartComponent {

  @Input()
  public carts: any[];

  private SHOP_TYPES = AppConstant.SHOP_TYPE_MS;

  constructor(
    private navCtrl: NavController,
  ) {

  }

  public trackByCart(index: number, cart: any): number {
    // console.debug('💭 Track by trackByCart :', index, cart);
    return cart.cartId;
  }

  private confirmRemoveCartItem(shopId, cartDetail: any) {
    // this.cartService.removeFromCart(shopId, cartDetail.productItemId)
  }

  private handleUpdatedItem(event, cart, i) {
    // this.cartService.reCalFromCart();
  }

  private onServiceClick(cartDetail: any): void {
    this.navCtrl.push('GarageSelectionPage', {
      cartDetail,
    });
  }

}
