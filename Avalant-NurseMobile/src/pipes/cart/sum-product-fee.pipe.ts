import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumproductfee',
  pure: false
})

export class SumProductFeePipe implements PipeTransform {
  public transform(cartDetail: any, cartItem: any): number {
    let sumPrice = cartDetail.shippingCost;

    if (cartDetail.itemQuantity > 1) {
      sumPrice = sumPrice + cartDetail.shippingCostAbove * (cartDetail.itemQuantity - 1);
    }
    return sumPrice;
  }

}