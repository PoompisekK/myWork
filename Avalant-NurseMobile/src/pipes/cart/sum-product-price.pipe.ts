import { Pipe, PipeTransform } from '@angular/core';

/**
 * Summation products price
 * Use in Cart page
 * 
 * @author NorrapatN
 * @since Tue Jul 11 2017
 */
@Pipe({
  name: 'sumproductprice',
  pure: false
})
export class SumProductPricePipe implements PipeTransform {

  public transform(cartItem: any): any {
      let sumPrice = cartItem.cartDetails.reduce((prevSum, current) => {
      let sumShip = current.shippingCost;
      if(current.itemQuantity>1){
          sumShip = sumShip+(current.shippingCostAbove*(current.itemQuantity-1));
      }
      return prevSum + (current.itemPrice*current.itemQuantity) + sumShip;
    }, 0);
    return sumPrice;
  }

}
