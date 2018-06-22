import { Component, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '../form-control-base/value-accessor-base';
import { OrganizationModel } from '../../../model/organization/organization.model';

/**
 * Brand Item Component
 * 
 * @author NorrapatN
 * @since Thu Sep 28 2017
 */
@Component({
  selector: 'brand-item',
  template: `
  <div class="brand-border">
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=" 
  [style.background-color]="value?.background" 
  [style.background-image]="'url(' + (value?.logo | imagekey) + ' )'" class="brand-image" />
  </div>
  <div class="content">
      <div class="title ellipsis">{{value?.name}}</div>
      <div class="sub-title ellipsis">{{value?.category}}</div>
  </div>
`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BrandItemComponent,
      multi: true,
    }
  ]
})
export class BrandItemComponent extends ValueAccessorBase<OrganizationModel> implements AfterViewInit {

  public ngAfterViewInit(): void {
    // console.debug('💭 AfterViewInit', this);
    
    this.registerOnChange((value) => {
      // console.debug(' Value :', value);
      // this.value = value;
    });
  }

}
