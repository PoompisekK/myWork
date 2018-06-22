import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EAFRestService } from '../../services/eaf-rest/eaf-rest.service';
import { GarageModel } from '../model/garage.model';

/**
 * Motor Service
 * 
 * @author NorrapatN
 * @since Thu Nov 09 2017
 */
@Injectable()
export class MotorService {

  constructor(
    private eafRest: EAFRestService,
  ) {

  }

  public searchGarageByProductItemId(PRODUCT_ITEM_ID: number): Observable<GarageModel[]> {
    return this.eafRest.searchEntity(GarageModel, GarageModel.ENTITY_ID, {
      PRODUCT_ITEM_ID,
    });
  }

}
