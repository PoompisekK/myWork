import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpService } from '../http-services/http.service';
import { Observable, Observer } from 'rxjs';
/**
 * DMP Social Service
 * @author NorrapatN
 * @since Wed May 17 2017
 */
@Injectable()
export class DMPSocialService {

  constructor(
    private authService: AuthenticationService,
    private httpService: HttpService,

  ) { }

}
