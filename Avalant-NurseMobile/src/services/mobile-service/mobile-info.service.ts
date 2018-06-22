import { Injectable } from '@angular/core';
import { MobileInfoModel } from '../../model/mobile/mobile-info.model';
import { EAFRestService } from '../eaf-rest/eaf-rest.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MobileInfoService {

  constructor(
    private eafRestService: EAFRestService
  ) { }

  public saveMobileInformation(mobileInfo: MobileInfoModel): Observable<any> {
    return this.eafRestService.postManualServlet('MobileHello', null,
      {
        params: {
          iWantTo: 'sayHi',
        },
        body: mobileInfo
      }
    );
  }
}