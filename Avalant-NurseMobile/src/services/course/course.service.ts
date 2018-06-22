import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { EAFRestService } from '../eaf-rest/eaf-rest.service';
import { ICourseStatusResponse } from '../../model/course/course-status.interface';
/**
 * Course Services
 * 
 * @author Bundit.Ng
 * @author Edit 2 - NorrapatN
 * @since  Thu May 18 2017 4:22:34 PM
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@Injectable()
export class CourseService {

  constructor(
    private eafRest: EAFRestService,
  ) { }

  public getIsCourseAvailable(shopId: string, productId: string, productItemId: string, userId: string, vipCode: string, orgId: string): Observable<boolean> {
    return this.eafRest.getManualServlet<ICourseStatusResponse>('CourseEventQuotaChecker', null, {
      shopId, productId, productItemId,
      userId, vipCode, orgId
    }).map((response) => response.status);
  }

}
