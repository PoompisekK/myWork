import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { convertEnumToColumn } from 'ion-multi-picker';
import { SlideMenuItem } from '../../layout-module/components/slide-menu/model/slide-menu-item.model';
import { IVehicleModelResponse, IVehicleModel } from '../../model/vehicle/vehicle-model-response.interface';
import { AppState } from '../../app/app.state';
import { VehicleDataModel } from '../../model/vehicle/vehicle.model';
import { MotorModelModel } from '../../model/vehicle/motor-model.model';
import { MotorSubModelModel } from '../../model/vehicle/motor-sub-model.model';

type MultiValuePickerOptions = { name: string, options: { text: string, value: string }[] };

/**
 * Select Car page
 * 
 * @author NorrapatN
 * @since Tue Sep 26 2017
 */
@IonicPage({
  segment: 'add-vehicle',
  defaultHistory: ['MotorHomePage']
})
@Component({
  selector: 'add-car-page',
  templateUrl: './add-car.page.html',
})
export class AddCarPage {

  // public simpleColumns: any[];

  private readonly VEHICLE_PLACEHOLDER_IMG_PATH: string = 'assets/img/cars/placeholder-car2.png';

  // Data
  private vehiclePreviewImg: string = '';
  private models: Array<MultiValuePickerOptions>;
  private subModels: Array<MultiValuePickerOptions>;
  private brands: SlideMenuItem[] = [];

  // Selected data
  private userSelectedVehicle: VehicleDataModel;
  // selectedBrand: string;
  // selectedModel: string;
  // selectedSubModel: string;
  // selectedYear: string;

  public isBrandLoading: boolean;
  public isModelLoading: boolean;
  private isSubModelLoading: boolean;
  public isDetailLoading: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private appState: AppState,
  ) {
    // this.hondaModels = convertEnumToColumn(HondaModel);

    /* this.simpleColumns = [
      {
        name: 'col1',
        options: [
          { text: '1', value: '1' },
          { text: '2', value: '2' },
          { text: '3', value: '3' }
        ]
      }
    ]; */

    this.userSelectedVehicle = navParams.get('vehicleData') || new VehicleDataModel();

    this.loadBrandList();

  }

  public loadBrandList(): void {
    /* this.brands = [
      {
        name: 'Honda',
        iconUrl: '/assets/icon/honda2.png',
        value: 'accordion-2017',
      },
      {
        name: 'Mitsubishi',
        iconUrl: '/assets/icon/misubishi.png',
        value: 'mitsubishi-triton',
      },
      {
        name: 'Chevrolet',
        iconUrl: '/assets/icon/chevrolet.png',
        value: 'chevrolet-camaro',
      }
    ]; */

    this.isBrandLoading = true;

    // Get brand list from service.
    // this.vehicleService.getBrandList().subscribe((response) => {
    //   if (!response || !response.length) {
    //     console.warn('⚠️ Response is empty');
    //   }

    //   // Map to Slide Menu item model.
    //   if (response.length > 0) {
    //     this.brands = response.map((brand) => {
    //       return new SlideMenuItem({
    //         id: brand.brandId,
    //         name: brand.brandName,
    //         iconUrl: `assets/icon/${brand.brandId.toLowerCase()}.png`,
    //         value: brand.brandId,
    //       });
    //     }).sort(this.sortFn('name'));
    //   }

    //   this.isBrandLoading = false;
    // }, (error) => {
    //   this.isBrandLoading = false;
    //   console.warn('Error : ', error);
    // });
  }

  public selectBrand(brandCode: string): void {
    // console.log('brandCode :', brandCode);

    this.models = [];
    this.userSelectedVehicle.modelId = void 0;
    this.selectModel();
    this.selectSubmodel();
    // this.selectYear();

    // Stop when no Brand code.
    if (!brandCode) {
      return;
    }

    this.isModelLoading = true;

    // Set value from brand code & get brand name.
    this.userSelectedVehicle.brandId = brandCode;

    // Just Continue search models by Brand ID.
    // this.vehicleService.getModelListByBrandCode(brandCode).subscribe((response) => {

    //   if (!response) {
    //     console.warn('No repsonse data.');
    //     return;
    //   }

    //   // Building Options for Multi Picker
    //   const modelOptions = [];

    //   modelOptions[0] = {
    //     name: 'modelList',
    //     options: response.map((model) => ({
    //       text: model.modelName || model.modelName,
    //       value: model.modelId,
    //     })).sort(this.sortFn('text'))
    //   };

    //   this.models = modelOptions.sort(this.sortFn('modelName'));

    //   this.isModelLoading = false;
    // }, (error) => {
    //   this.isModelLoading = false;
    //   console.warn('Error : ', error);
    // });
  }

  public selectModel(modelId?: string): void {
    this.userSelectedVehicle.subModelId = void 0;

    // Stop when no Model.
    if (!modelId) {
      return;
    }

    this.isSubModelLoading = true;

    this.userSelectedVehicle.modelId = modelId;

    // this.vehicleService.getSubModelListByModelId(modelId).subscribe((response) => {

    //   if (!response) {
    //     console.warn('No repsonse data.');
    //     return;
    //   }

    //   // Building Options for Multi Picker
    //   const subModelOptions = [];

    //   subModelOptions[0] = {
    //     name: 'subModelList',
    //     options: response.map((model) => ({
    //       text: model.subModelName,
    //       value: model.modelId,
    //     })).sort(this.sortFn('text'))
    //   };

    //   this.subModels = subModelOptions;

    //   this.isSubModelLoading = false;
    // }, (error) => {
    //   this.isSubModelLoading = false;
    //   console.warn('Error : ', error);
    // });
  }

  public selectSubmodel(submodelId?: string): void {

    this.userSelectedVehicle.subModelId = submodelId;

    // Get car picture
    this.vehiclePreviewImg = !!submodelId ? `assets/img/cars/${submodelId}.png` : null;
  }

  /* selectYear(year?: string): void {
  } */

  public isSelectionValid(): boolean {
    return !!this.userSelectedVehicle.brandId && !!this.userSelectedVehicle.modelId && !!this.userSelectedVehicle.subModelId;
  }

  public confirmSelectedVehicle(): void {

    this.userSelectedVehicle.brandName = this.brands.find((brand) => brand.id === this.userSelectedVehicle.brandId).name;
    this.userSelectedVehicle.modelName = this.models[0].options.find((options) => options.value == this.userSelectedVehicle.modelId).text;
    this.userSelectedVehicle.subModelName = this.subModels[0].options.find((options) => options.value == this.userSelectedVehicle.subModelId).text;

    this.appState.userSelectedVehicle = this.userSelectedVehicle;

    this.appState.userVehicleList.push(this.appState.userSelectedVehicle);

    this.navCtrl.pop();
  }

  private sortFn(fieldName: string) {
    return (a, b) => {
      const aVal = a[fieldName];
      const bVal = b[fieldName];

      if (aVal < bVal) {
        return -1;
      } else if (aVal > bVal) {
        return 1;
      } else {
        return 0;
      }
    };
  }

}

// enum HondaModel {
//   /*โปรดเลือก,*/ '2.0 i-VTEC', '2.1 i-VTEC', '2.2 i-VTEC', '2.3 i-VTEC', '2.4 i-VTEC',
// }
