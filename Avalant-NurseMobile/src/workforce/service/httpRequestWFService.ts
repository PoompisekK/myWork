import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../app/app.state';
import { isDev } from '../../constants/environment';
import { HCMRestApi } from '../../constants/hcm-rest-api';
import { PictureService } from '../../services/picture-service/picture.service';
import { WorkforceHttpService } from './workforceHttpService';

@Injectable()
export class HttpRequestWFService {
    constructor(
        private wfHttpService: WorkforceHttpService,
        private appState: AppState,
        private pictureService: PictureService,
        private http: Http,

    ) {
    }
    // private httpTimeOut: number = 30000;
    private mapResult(res: any): any {
        if (res.messageCode == 0) {
            if (res.data != null) {
                return res.data.data || res.data;
            } else if (res.message != null) {
                return res.message;
            } else {
                return "success";
            }
        } else {
            console.error("res.message :", res);
            if (res.message != null) {
                throw new Error(res.message);
                // return res.message;
            } else {
                return null;
            }
        }
    }

    private getCommonParams(): object {
        return {
            "projectId": 1,
            "employeeCode": this.wfHttpService.employeeCode,
            "organizationId": this.appState.currentOrganizationId,
            "organizeId": this.appState.currentOrganizationId,
            "lang": this.appState.language,
        };
    }
    private serialize(obj) {
        return '?' + Object.keys(obj).reduce((a, k) => {
            a.push(k + '=' + encodeURIComponent(obj[k]));
            return a;
        }, []).join('&');
    }
    public postParamsService(contextService: string, addtionalParam?: { [key: string]: any }, isFormData?: boolean | false): Observable<any> {
        let reqBody = new URLSearchParams();
        if (addtionalParam) {
            Object.keys(addtionalParam).forEach(paramKey => {
                reqBody.set(paramKey, addtionalParam[paramKey]);
            });
        }
        const importantParams = this.getCommonParams();
        Object.keys(importantParams).forEach(paramKey => {
            reqBody.set(paramKey, importantParams[paramKey]);
        });

        const reqUrl = HCMRestApi.URL + contextService + this.serialize(importantParams);
        let observerReq: Observable<any> = null;
        if (isFormData) {
            addtionalParam = {
                ...addtionalParam,
                ...importantParams,
            };
            isDev() && console.log("postParamsService[" + contextService + "] addtionalParam :", addtionalParam);
            observerReq = this.wfHttpService.httpFormDataPost<any>(reqUrl, addtionalParam);
        } else {
            isDev() && console.log("postParamsService[" + contextService + "] reqBody :", reqBody.toString());
            observerReq = this.wfHttpService.httpJSONPost<any>(reqUrl, reqBody);
        }
        return Observable.create((observer) => {
            observerReq
                // .timeout(this.httpTimeOut)
                .map((res) => this.mapResult(res))
                .subscribe((resp) => {
                    observer.next(resp);
                    observer.complete();
                }, (errMsg) => {
                    observer.error(errMsg);
                    observer.complete();
                });
        });
    }

    public getParamsService(contextService: string, addtionalParam?: { [key: string]: any }): Observable<any[]> {
        let reqBody = new URLSearchParams();
        const importantParams = this.getCommonParams();
        Object.keys(importantParams).forEach(paramKey => {
            reqBody.set(paramKey, importantParams[paramKey]);
        });
        if (addtionalParam) {
            Object.keys(addtionalParam).forEach(paramKey => {
                reqBody.set(paramKey, addtionalParam[paramKey]);
            });
        }

        isDev() && console.log("getParamsService[" + contextService + "] reqBody :", reqBody.toString());
        return Observable.create((observer) => {
            this.wfHttpService.httpGet<any>(HCMRestApi.URL + contextService, reqBody)
                // .timeout(this.httpTimeOut)
                .map((res) => this.mapResult(res))
                .subscribe((resp) => {
                    observer.next(resp);
                    observer.complete();
                }, (errMsg) => {
                    observer.error(errMsg);
                    observer.complete();
                });
        });
    }

    public postUploadFileTransfer(fieldName: string, fileItm: any): Observable<any> {
        return Observable.create((obersver) => {
            this.wfHttpService.handshakeWithHCM_Auth().subscribe(() => {
                try {
                    const formData = new FormData();
                    formData.append("file", fileItm);
                    formData.append("filename", fieldName);
                    formData.append("employeeCode", this.wfHttpService.employeeCode);
                    formData.append("organizationId", this.appState.currentOrganizationId);
                    formData.append("type", "assignment");
                    const req = new XMLHttpRequest();
                    req.open("POST", HCMRestApi.URL + "/file/upload");
                    req.setRequestHeader("HCM-Access", this.wfHttpService.HCMAccessToken);
                    req.onload = (event: any | { target: any }) => {
                        obersver.next(JSON.parse(event.target.response));
                        obersver.complete();
                    };
                    req.onerror = (error) => {
                        obersver.error(error.target);
                        obersver.complete();
                    };
                    req.send(formData);
                } catch (e) {
                    console.error("postUploadFileTransfer :", e);
                    obersver.error(e);
                    obersver.complete();
                }
            });

        });
    }

}