import { Component, Input, HostBinding } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '../../../layout-module/components/form-control-base/value-accessor-base';
import { SlideMenuItem } from './model/slide-menu-item.model';

/**
 * Slide Menu Item Component
 * @author NorrapatN
 * @since Tue Sep 26 2017
 */
@Component({
  selector: 'slide-menu-item',
  templateUrl: './slide-menu-item.component.html',
  providers: [
    // Custom NG Value provider
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SlideMenuItemComponent,
      multi: true
    }
  ]
})
export class SlideMenuItemComponent extends ValueAccessorBase<SlideMenuItem> {

  @HostBinding('class.selected')
  @Input()
  public selected: boolean;

  private makeAltText(value: string): string {
    if (!value) {
      return '';
    }

    return value.substr(0, 2);
  }

}
