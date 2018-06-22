import { IonicPage, NavController, Slides } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { AppState } from '../../app/app.state';
import { VehicleDataModel } from '../../model/vehicle/vehicle.model';

/**
 * Select Car page
 * 
 * @author NorrapatN
 * @since Fri Oct 06 2017
 */
@IonicPage({
  segment: 'select-car-page',
  defaultHistory: ['MotorHomePage']
})
@Component({
  selector: 'select-car-page',
  templateUrl: './select-car.page.html',
})
export class SelectCarPage {

  @ViewChild('vehicleSlide')
  private vehicleSlide: Slides;

  private userVehicleList: VehicleDataModel[];
  private selectedVehicle: VehicleDataModel;

  constructor(
    private navCtrl: NavController,
    private appState: AppState,
  ) {
    this.userVehicleList = appState.userVehicleList;
    this.selectedVehicle = this.appState.userSelectedVehicle;

    console.debug('userVehicleList :', this.userVehicleList);
  }

  /**
   * This method will be invoked everytime when come back.
   */
  public ionViewDidEnter(): void {
    // Just set it again. <!! DO NOT REMOVE THIS LINE !!>
    this.selectedVehicle = this.appState.userSelectedVehicle;

    if (this.userVehicleList && this.userVehicleList.length && this.selectedVehicle) {
      // This will make Slides move to Selected vehicle.
      const vehicleIndex = this.userVehicleList.indexOf(this.selectedVehicle);
      this.vehicleSlide.slideTo(vehicleIndex || 0);
    }
  }

  private selectCar(car: any): void {
    // Set current car into App state.
    this.selectedVehicle = this.appState.userSelectedVehicle = car;

    // And then pop this page out.
    // this.navCtrl.pop(); // OR it not need to pop this page out.?
  }

  public addVehicle(): void {
    this.navCtrl.push('AddCarPage');
  }

}
