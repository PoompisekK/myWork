import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs';

import { AppState } from '../../app/app.state';
import { isChromeDev } from '../../constants/environment';
import { UserModel } from '../../model/user/user.model';
import { SecurityUtil } from '../../utilities/security.util';
import { HCMLoginParamsPOST, HCMUserAuthModel, WorkforceHttpService } from '../../workforce/service/workforceHttpService';
import { HttpService } from '../http-services/http.service';

@Injectable()
export class HCMAuthenticationService {

    constructor(
        private events: Events,
        private httpService: HttpService,
        private appState: AppState,
        private wfHttpService: WorkforceHttpService,
    ) {
        isChromeDev() && console.log(" HCMAuthenticationService Created !!!! ");
    }

    public getHCMLoginToDMP(authRequest: UserModel): Observable<UserModel> {
        // authRequest.scmUserName = (authRequest.scmUserName || '').toLowerCase();
        // authRequest.memberEmail = (authRequest.memberEmail || '').toLowerCase();
        let encodedPassword = SecurityUtil.encodePassword(authRequest.scmUserName, authRequest.password);
        encodedPassword = authRequest.password;//SecurityUtil.encodePassword(authRequest.scmUserName, authRequest.password);
        return Observable.create((observer) => {
            const hcmUserObject: HCMUserAuthModel = new HCMUserAuthModel();
            hcmUserObject.scm_username = authRequest.scmUserName;
            hcmUserObject.scm_pwd = encodedPassword;
            this.wfHttpService.HCMUserAuth = hcmUserObject;
            const authParams: HCMLoginParamsPOST = {
                username: authRequest.scmUserName,
                password: encodedPassword,
                clientId: new Date().getTime().toString()
            };
            this.wfHttpService.getObserveHCM(authParams).subscribe(resp => {
                console.log("HCMAuthenticationService :", resp);
                if (resp) {
                    let respUserM = this.wfHttpService.businessUser;
                    if (resp.employeeCode && !(resp.employeeCode || '').equals(respUserM.employeeCode)) {
                        console.warn("resp.employeeCode      :", resp.employeeCode);
                        console.warn("respUserM.employeeCode :", respUserM.employeeCode);
                        respUserM.employeeCode = resp.employeeCode;
                        console.warn("respUserM.employeeCode :", respUserM.employeeCode);
                    }
                    this.appState.businessUser = respUserM;
                    observer.next(respUserM);
                }
            }, (err) => {
                console.error("HCMAuthenticationService :", err);
                observer.error(err);
            });
        });
    }
}
