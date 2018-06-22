import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MockRestApi } from '../../constants/mock-rest-api';
import { HttpService } from '../http-services/http.service';

/**
 * Store / Product Service
 * 
 * @author NorrapatN
 * @since Tue May 16 2017
 */
@Injectable()
export class StoreService {

  constructor(
    private httpService: HttpService,
  ) { }

}
