import { Injectable, Inject, forwardRef } from '@angular/core';
import { MenuController, Events } from 'ionic-angular';
import { Observable } from 'rxjs';

import { AuthenticationResponseModel } from '../../model/authentication/authentication-response.model';
import { SocialComRegisterRequestModel } from '../../model/authentication/authentication-request.model';
import { HttpService, RequestContentType } from '../http-services/http.service';
import { EAFRestService } from '../eaf-rest/eaf-rest.service';
import { SCMRestApi } from '../../constants/scm-rest-api';
import { UserModel } from '../../model/user/user.model';
import { ObjectsUtil } from '../../utilities/objects.util';
import { StringUtil } from '../../utilities/string.util';
import { AppState } from '../../app/app.state';
import { EAFModelWithMethod } from '../../model/eaf-rest/eaf-model-with-method.model';
import { ResponseBaseModel } from '../../model/rest/response-base.model';
import { SecurityUtil } from '../../utilities/security.util';
import { Md5 } from 'ts-md5/dist/md5';
import { EAFRestApi } from '../../constants/eaf-rest-api';
import { AppConstant } from '../../constants/app-constant';
import { SMSOTPWebservice } from '../../constants/sms-otp-webservice';
import { RequestOTPModel, VerifyOTPModel } from '../../model/authentication/otp-service.model';
import { EAFRestUtil } from '../eaf-rest/eaf-rest.util';
import { WorkforceHttpService } from '../../workforce/service/workforceHttpService';

@Injectable()
export class AuthenticationService {

  public static SCM_URL = {
    LOGIN_STREAM_DO: SCMRestApi.URL + '/loginStream.do',
    LOGIN_DMP_DO: SCMRestApi.URL + '/loginDMP.do',

    LOGIN: SCMRestApi.URL + '/loginStream.do?m=signInFromSCM',
    // REGISTER: SCMRestApi.URL + '/loginDMP.do?m=', // m = dmpRegistration
    AVA_DMP_API: SCMRestApi.URL + '/avaDMPapi.do', // 
  };

  private SCM_URL = AuthenticationService.SCM_URL;
  protected saltPwd: string = "Cyo8;k,0eglnjv,";
  protected saltPwd_2: string = "ihv'wsh0ow,j,uohe9k";
  protected costForgotPassword: number = 69;
  protected saltForgotPassword: string = "]n,isyl";
  protected costUID: number = 37;
  protected saltUID: string = "Vy]Fs]aviN,fbvvgmviNw:fN";

  constructor(
    private events: Events,
    private httpService: HttpService,
    private appState: AppState,
    @Inject(forwardRef(() => EAFRestService)) private eafRestService: EAFRestService,
    private menuCtrl: MenuController,
    private wfHttpService: WorkforceHttpService,
  ) { }

  public loginRest(userModel: UserModel): Observable<UserModel> {
    userModel.memberEmail = (userModel.memberEmail || '').toLowerCase();
    if (ObjectsUtil.isEmptyObject(userModel) || (StringUtil.isEmptyString(userModel.memberEmail) || StringUtil.isEmptyString(userModel.password))) {
      console.error("Email or Password is incorrect [memberEmail]:", userModel.memberEmail, ", [password]:", userModel.password);
      return Observable.create(observer => {
        setTimeout(() => {
          observer.next(null);
        }, 50);
      });
    }

    // Encode password
    let encodedPassword = SecurityUtil.encodePassword(userModel.memberEmail, userModel.password);
    return this.eafRestService.searchEntity(UserModel, UserModel.ENTITY_ID, {
      MEMBEREMAIL: userModel.memberEmail,
      SCMPWD: encodedPassword,
      // LANGUAGE: this.appState.language
    }, { page: '1', volumePerPage: '20' }).map(resp => {
      // console.log("resp:", resp);
      let dataResp;
      if (!ObjectsUtil.isEmptyObject(resp) && resp.length > 1) {
        dataResp = resp.find(item => item.memberEmail == userModel.memberEmail && item.password == encodedPassword);
      } else {
        dataResp = resp && resp[0];
      }
      // console.log("loginRest dataResp:", dataResp);
      return dataResp;
    });
  }

  // public loginSocialRest(userModel: UserModel): Observable<UserModel> {
  //   console.log('loginSocialRest1')
  //   if (ObjectsUtil.isEmptyObject(userModel) ||
  //     (StringUtil.isEmptyString(userModel.memberEmail) || StringUtil.isEmptyString(userModel.signinType))) {
  //     console.error("Member Email incorrect [SigninType]:", userModel.signinType, ", [memberEmail]:", userModel.memberEmail);
  //     return Observable.create(observer => {
  //       setTimeout(() => {
  //         observer.next(null);
  //       }, 50);
  //     });
  //   }
  //   return this.eafRestService.searchEntity(UserModel, UserModel.ENTITY_ID, {
  //     MEMBEREMAIL: userModel.memberEmail,
  //     SIGNINTYPE: userModel.signinType,
  //     // LANGUAGE: this.appState.language
  //   }, { page: '1', volumePerPage: '20' }).map(resp => {
  //     console.log("loginSocialRest resp:", resp);
  //     let dataResp = resp && resp[0];
  //     //  console.log("searchEntity [UserModel:" + UserModel.ENTITY_ID + "]resp:", resp);
  //     // let dataResp;
  //     if (!ObjectsUtil.isEmptyObject(resp) && resp.length > 1) {
  //       dataResp = resp.find(item => item.memberEmail == userModel.memberEmail && item.signinType == userModel.signinType);
  //     } else {
  //       dataResp = resp && resp[0];
  //     }
  //     // console.log("dataResp:", dataResp);
  //     console.log("loginSocialRest dataResp[0]:", dataResp);
  //     return dataResp;
  //   });
  // }

  public getUserSignInSocial(userSocialModel: UserModel): Observable<UserModel> {
    userSocialModel.memberEmail = (userSocialModel.memberEmail || '').toLowerCase();
    return this.httpService.httpPost<AuthenticationResponseModel>(this.SCM_URL.LOGIN_DMP_DO, {
      m: 'signInFacebook'
    }, {
        fb_memberEmail: userSocialModel.memberEmail,
        fb_socialUserId: userSocialModel.socialUserId,
        fb_socialPicProfile: userSocialModel.socialPicProfile,
        fb_socialUsername: userSocialModel.socialUsername,
        fb_custFname: userSocialModel.custFname,
        fb_custLname: userSocialModel.custLname,
      },
      RequestContentType.APPLICATION_JSON).map(resp => {
        if (resp && AppConstant.EAF_RESPONSE_CONST.isSuccess(resp.status)) {

          this.events.publish('app:login');

          let userModel = new UserModel();
          return Object.assign(userModel, resp.object);
        }
      });
  }
  public getUserLoginDmp(authenticationRequest: UserModel): Observable<UserModel> {
    authenticationRequest.scmUserName = (authenticationRequest.scmUserName || '').toLowerCase();
    authenticationRequest.memberEmail = (authenticationRequest.memberEmail || '').toLowerCase();
    let encodedPassword = SecurityUtil.encodePassword(authenticationRequest.scmUserName, authenticationRequest.password);

    return Observable.create((observer) => {
      const scmUserObject = {
        scm_username: authenticationRequest.scmUserName,
        scm_pwd: encodedPassword
      };
      this.wfHttpService.HCMUserAuth = Object.assign({}, scmUserObject);
      this.eafRestService.renewSession(() => {
        let loginObserver = this.httpService.httpPost<AuthenticationResponseModel>(this.SCM_URL.LOGIN_DMP_DO, {
          m: 'signInFromSCM'
        }, scmUserObject, RequestContentType.APPLICATION_JSON, { clientId: this.eafRestService.eafSession.clientId }).map(resp => {
          console.log("httpPost getUserLoginDmp resp:", resp);
          if (resp && resp.message === 'Ok') {
            let userModel = new UserModel();
            userModel = Object.assign(userModel, resp.object);
            userModel.userStatus = userModel['user_status'];

            this.events.publish('app:login');

            return userModel;
          } else if (resp && resp.message == "Need Email Activated") {
            console.warn('Fail loggin in : ', JSON.stringify(resp, null, 2));
            // throw new Error(SCMRestApi.ERROR_CODES.NEED_EMAIL_ACTIVATED);
            let userModel = new UserModel();
            userModel.userStatus = SCMRestApi.ERROR_CODES.NEED_EMAIL_ACTIVATED;
            return Object.assign(userModel, resp.object);
          } else {
            // throw new Error(resp.message || JSON.stringify(resp));
            console.warn('Error loggin in : ', JSON.stringify(resp, null, 2));
            // throw new Error(SCMRestApi.ERROR_CODES.INVALID_CREDIENTIAL);
            let userModel = new UserModel();
            userModel.userStatus = SCMRestApi.ERROR_CODES.INVALID_CREDIENTIAL;
            return Object.assign(userModel, resp.object);
          }
        });
        loginObserver.subscribe((respData) => {
          observer.next(respData);
        });
      });
    });

  }

  public activeEmailBySocialCom(registerM: UserModel): Observable<ResponseBaseModel> {
    return this.httpService.httpGet<any>(AuthenticationService.SCM_URL.LOGIN_DMP_DO, {
      m: 'emailActivate',
      uid: registerM.id
    });
  }

  public registerBySocialCom(registerM: UserModel): Observable<ResponseBaseModel> {
    let registerRequestModel = new SocialComRegisterRequestModel();
    registerM.scmUserName = (registerM.scmUserName || '').toLowerCase();
    registerM.memberEmail = (registerM.memberEmail || '').toLowerCase();
    let encodedPassword = SecurityUtil.encodePassword(registerM.scmUserName, registerM.password);
    registerRequestModel.signUp_Pwd = encodedPassword;
    registerRequestModel.signUp_Email = registerM.memberEmail;
    registerRequestModel.signUp_Language = this.appState.language;
    // let custName = !StringUtil.isEmptyString(registerM.custFname) ? registerM.custFname : '';
    // custName = custName + (!StringUtil.isEmptyString(registerM.custLname) ? ' ' + registerM.custLname : '');
    // registerRequestModel.signUp_Username = custName;
    registerRequestModel.signUp_Username = registerM.scmUserName;
    registerRequestModel.signUp_custNickName = registerM.nickName;
    registerRequestModel.signUp_custFname = registerM.custFname;
    registerRequestModel.signUp_custLname = registerM.custLname;
    registerRequestModel.signUp_signinType = registerM.signinType;
    registerRequestModel.signUp_companyCode = registerM.companyCode;
    return this.httpService.httpPost<ResponseBaseModel>(AuthenticationService.SCM_URL.LOGIN_DMP_DO, {
      m: "dmpRegistration",
    }, registerRequestModel, RequestContentType.APPLICATION_JSON);
  }

  public getRequestOTP(reqM: RequestOTPModel): Observable<any> {
    return this.httpService.httpGet<any>(SMSOTPWebservice.GENERATE_OTP, {
      smsType: reqM.smsType,
      language: reqM.language,
      orgID: reqM.orgID,
      mobileNo: reqM.mobileNo,
      sendType: reqM.sendType
    }, this.eafRestService.makeAuthHeader(this.eafRestService.eafSession));
  }

  public getVerifyOTP(verM: VerifyOTPModel): Observable<any> {
    return this.httpService.httpGet<any>(SMSOTPWebservice.VERIFY_OTP, {
      messageTransactionID: verM.messageTransactionID,
      referKey: verM.referKey,
      otpCode: verM.otpCode
    }, this.eafRestService.makeAuthHeader(this.eafRestService.eafSession));
  }

  public logout(): Observable<any> {
    // Clear auth model
    this.appState.businessUser = null;

    // Broadcast event
    this.events.publish('app:logout');

    return this.httpService.httpPost<any>(this.SCM_URL.LOGIN_DMP_DO, {
      m: 'logout',
    });
  }

  public forgotPassword(forgot_email: String): Observable<any> {
    forgot_email = (forgot_email || '').toLowerCase();
    return this.httpService.httpPost<AuthenticationResponseModel>(SCMRestApi.URL + '/avaDMPapi.do', {
      m: 'forgotPassword'
    }, {
        username: forgot_email,
        email: forgot_email
      }).map((response: any) => {
        let authRespM = new AuthenticationResponseModel();
        let regisResp = Object.assign(authRespM, response);
        return regisResp;
      });
  }

  public resetPassword(hashKey: String, hashUID: String, email: String, newPassword: String): Observable<any> {
    email = (email || '').toLowerCase();
    return this.httpService.httpPost<AuthenticationResponseModel>(this.SCM_URL.AVA_DMP_API + '?m=resetPassword', {}, {
      hashKey: hashKey,
      hashUID: hashUID,
      username: email,
      email: email,
      newPassword: newPassword
    }).map((response: any) => {
      let authRespM = new AuthenticationResponseModel();
      let regisResp = Object.assign(authRespM, response);
      return regisResp;
    });

  }

  /**
   * Send Confirmation email (Temporary use before merge into register completed)
   * @see http://gitavalant/wichaya/CrowdFunding/issues/1680#note_9387 (visarut.s)
   * @param mail an email
   */
  public sendRegisterConfirmationEmail(mail: string): Observable<any> {
    mail = (mail || '').toLowerCase();
    return this.httpService.httpGet<any>(this.SCM_URL.AVA_DMP_API, {
      m: 'get_sendEmail',
      mail,
    });
  }

  public hashPassword(email, password): string {
    let combineText = this.saltPwd + email;
    let inputHash: string = String(Md5.hashStr(combineText));
    let hash: string = String(Md5.hashStr(inputHash + password + this.saltPwd_2));
    return hash;
  }
  public hashKeyForgotPassword(email, userID): string {
    let hashUserID: string = String(Number(userID) + this.costForgotPassword);
    let combineText = hashUserID + this.saltForgotPassword + email;
    let inputHash: string = String(Md5.hashStr(combineText));
    let hash: string = String(Md5.hashStr(inputHash));
    return hash;
  }
  public encodeUID(userID): string {
    try {
      return btoa(btoa(String(Number(userID) * this.costUID)) + btoa(this.saltUID));
    } catch (e) {
      /** return Error Msg if base64's format invalid */

    }
  }

}
