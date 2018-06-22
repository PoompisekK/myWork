import { Pipe, PipeTransform } from '@angular/core';

/**
 * Cart Pipe
 * @author NorrapatN
 * @since Mon Jun 05 2017
 */
@Pipe({
  name: 'cart',
  pure: false
})
export class CartPipe implements PipeTransform {

  public transform(cartItems: any[], fieldToFilter: string, value: any): any {
    return cartItems && cartItems.filter((cartItem) => cartItem && cartItem && cartItem.product && cartItem.product[fieldToFilter] == value);
  }

}
