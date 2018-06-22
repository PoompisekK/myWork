import { Pipe, PipeTransform } from '@angular/core';
import { CartItem } from '../../services/cart/cart-item.model';
import { OrganizationModel } from '../../model/organization/organization.model';
import { OrganizationImage } from '../../model/organization/organization-image.model';
import { OrganizationHeader } from '../../pages/organization-page/organization-header/organization-header';

@Pipe({
  name: 'imgSlide',
  pure: false
})
export class ImgSlidePipe implements PipeTransform {
  public transform(organImg: OrganizationImage[]): OrganizationImage[] {
    if(organImg!=null){ 
      return organImg.filter(img=>img.isLogo=='N');
    }
  }

}
