import { Component, OnInit } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { GarageModel } from '../model/garage.model';
import { MotorService } from '../services/motor.service';

/**
 * Garage Selection page
 * 
 * @author NorrapatN
 * @since Fri Nov 03 2017
 */
@IonicPage({
  segment: 'garage',
})
@Component({
  selector: 'garage-selection-page',
  templateUrl: 'garage-selection.page.html',
})
export class GarageSelectionPage implements OnInit {

  private GARAGE_SHOP_ID: string = '540';
  private CATEGORY_TYPE: string = '204';

  private selectedGarage: GarageModel;
  private garageList: GarageModel[];

  private cartDetail: any;

  /**
   * Use to determine state for button.
   */
  private selectedCondition: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private motorService: MotorService,
  ) {
    this.cartDetail = navParams.get('cartDetail');
  }

  public ngOnInit(): void {

  }

  /* ionViewCanLeave(): Promise<boolean> | boolean {
    if (!this.selectedGarage) {
      // Exit with no garage add to cart.
      return true;
    }

    return new Promise((resolve, reject) => {

    });

  } */

  private loadGarages(condition: string): void {
    console.debug(`User prefer ${condition}.`);

    if (condition === 'inexpensive') {
      this.selectedCondition = 'inexpensive';
      // Query something...
    } else if (condition === 'nearest') {
      this.selectedCondition = 'nearest';
      // Query something...
    } else {
      console.warn('No condition specified.');
    }

    /* this.productService.getProductsByShop(this.GARAGE_SHOP_ID, this.CATEGORY_TYPE).subscribe((garageList) => {
      console.debug('💭 Garage response :', garageList);

      // Get each products detail
      if (garageList && (Array.isArray(garageList) && garageList.length)) {
        garageList.forEach(garage => {
          this.productService.getProductMediaInfoById(garage.id).subscribe((garageMedia) => {
            garage.productDetailList = garageMedia.productDetailList;

          }, (error) => {
            console.warn('⚠️ Error getting Garage (Product media info) :', error);
          });
        });
      }

      this.garageList = garageList;
    }, (error) => {
      console.warn('Error getting Garage List :', error);
    }); */

    this.motorService.searchGarageByProductItemId(this.cartDetail.productItemId).subscribe((response) => {
      console.debug('Response : ', response);
      this.garageList = response;
    });
  }

  public selectGarage(garage: GarageModel): void {
    /* if (this.selectedGarage === garage) {
      this.selectedGarage = void 0;
    } else {
    } */
    this.selectedGarage = garage;

    // let addToCartResult = this.cartService.addToCart(this.selectedGarage.serviceProductItemId + '', 1);

    // if (typeof addToCartResult === 'boolean') {
    //   this.navCtrl.pop();
    //   return;
    // }

    // addToCartResult.subscribe((response) => {
    //   console.debug('💭 Add to cart response :', response);

    //   if (response.responseStatus == "FAIL") {
    //     // reject('Fail to add to cart :' + JSON.stringify(response));
    //     this.selectedGarage = void 0;
    //     this.alertCtrl.create({
    //       title: 'Error',
    //       message: 'Error while adding garage : ' + JSON.stringify(response),
    //       buttons: ['OK']
    //     }).present();
    //     return;
    //   }

    //   this.navCtrl.pop();
    //   return;
    // });
  }

}
