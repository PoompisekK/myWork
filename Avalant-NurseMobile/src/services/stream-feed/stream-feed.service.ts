import { Injectable } from '@angular/core';
// import { AuthenticationResponseModel } from '../../model/authentication/authentication-response.model';
// import { Observable } from 'rxjs';
import { HttpService } from '../http-services/http.service';
@Injectable()
export class StreamFeedService {
  constructor(
    private httpService: HttpService
  ) { 

  }
  
}
