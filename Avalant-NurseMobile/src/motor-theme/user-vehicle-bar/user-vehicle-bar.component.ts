import { Component, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '../../layout-module/components/form-control-base/value-accessor-base';
import { VehicleDataModel } from '../../model/vehicle/vehicle.model';

/**
 * User Vehicle Bar Component
 * 
 * @author NorrapatN
 * @since Wed Sep 27 2017
 */
@Component({
  selector: 'user-vehicle-bar',
  templateUrl: './user-vehicle-bar.component.html',
  styles: [`
  :host {
    display: block;
  }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UserVehicleBarComponent,
      multi: true
    }
  ]
})
export class UserVehicleBarComponent extends ValueAccessorBase<VehicleDataModel> implements AfterViewInit {

  @Output()
  private carButtonClick: EventEmitter<VehicleDataModel> = new EventEmitter();

  @Output()
  private addButtonClick: EventEmitter<{ e: MouseEvent, vehicle: VehicleDataModel }> = new EventEmitter();

  /* constructor() {
    super();
  } */// Use constructor when need to initial some values.

  public ngAfterViewInit(): void {
    this.registerOnChange((value) => {
      // console.debug(' Value :', value);
      // this.value = value;
    });
  }

  private onCarButtonClick(e: MouseEvent, vehicle: VehicleDataModel): void {
    this.carButtonClick.emit(vehicle);
  }

  private onAddButtonClick(e: MouseEvent, vehicle: VehicleDataModel): void {
    this.addButtonClick.emit({ e, vehicle });
  }

}
