import { Pipe, PipeTransform } from '@angular/core';
import { OrderHeadModel } from '../../model/my-order/order-head.model';

@Pipe({
  name: 'thaiDate',
  pure: false
})
export class thaiDatePipe implements PipeTransform {
  public transform(order: OrderHeadModel[]): string {
    let result ="";
    if(order){
      order.forEach(element => {
        result = (parseInt(element.orderDate.match(/\d{4}/)[0])+543).toString();
        result = element.orderDate.replace(/\d{4}/,result);
      });
    }
    return result;
  }
 
}