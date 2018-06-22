import { Pipe, PipeTransform } from '@angular/core';

import { ShopTypeMasterModel } from '../../model/master-data/shop-type.master.model';

/**
 * Shop type Pipe
 * 
 * Shop type filter
 * 
 * @author NorrapatN
 * @since Mon Jun 05 2017
 */
@Pipe({
  name: 'shoptype',
})
export class ShopTypePipe implements PipeTransform {

  public transform(shopTypeList: ShopTypeMasterModel[], cartGroups: { [key: string]: any[] }, callback?: Function): any {
    let cartGroupsShopTypes: string[] = [];

    for (let key in cartGroups) {

      cartGroups[key] && cartGroups[key].forEach((cartItem) => {
        //console.log(cartItem)
        let shopTypeId = cartItem && cartItem.shopTypeId + '';
        //console.log(shopTypeId)
        if (shopTypeId && cartGroupsShopTypes.indexOf(shopTypeId) < 0) {
          cartGroupsShopTypes.push(shopTypeId);
        }
      });
    }
    //console.log(cartGroupsShopTypes)
    let filtered = shopTypeList.filter((shopType) => cartGroupsShopTypes.indexOf(shopType.shopTypeId) > -1);
    if (callback && typeof callback === 'function') {
      callback(filtered[0]);
    }
    return filtered;
  }

}
