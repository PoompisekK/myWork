import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OrganizationModel } from '../../model/organization/organization.model';
/**
 * Motor Home Header component
 * 
 * @author NorrapatN
 * @since Mon Sep 25 2017
 */
@Component({
  selector: 'motor-home-header',
  templateUrl: './motor-home-header.component.html',
})
export class MotorHomeHeaderComponent {

  @Input()
  public organizationData: OrganizationModel;

  @Output()
  private searchClick: EventEmitter<any> = new EventEmitter();

  /**
   * @param ev InputEvent type that extended UIEvent.
   */
  /* onSearchBarInput(ev: any): void {
    console.debug('onSearchBarInput :', ev.data);

    this.searchClick.emit(ev.data);
  } */

  /**
   * Search Bar click event.
   */
  public onSearchBarClick(e: MouseEvent): void {
    this.searchClick.emit(e);
  }

}
