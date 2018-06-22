import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { EAFRestService } from '../eaf-rest/eaf-rest.service';
import { ICourseStatusResponse } from '../../model/course/course-status.interface';
import { PrivilegeModel } from '../../model/my-reward/privilege.model';
@Injectable()
export class MyRewardService {

  constructor(
    private eafRest: EAFRestService,
  ) { }

  public getVoucherMyReward(userId: string, orgId: string): Observable<any> {
    return this.eafRest.getManualServlet<any>('getMyReward', null, {
      orgId, userId
    }).map((response) => response);
  }
  public getPrivilegeMyReward(userId: string, orgId: string): Observable<PrivilegeModel[]> {
    return this.eafRest.searchEntity(PrivilegeModel, PrivilegeModel.ENTITY_ID,
      {
        USER_ID: userId,
        ORGID: orgId
      }).map((response) => response);
  }

}