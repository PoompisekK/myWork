import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslationService } from 'angular-l10n';
import { NavController } from 'ionic-angular';
import * as moment from 'moment';

import { AppState } from '../../../app/app.state';
import { EAFRestApi } from '../../../constants/eaf-rest-api';
import { HCMRestApi } from '../../../constants/hcm-rest-api';
import { LoginPage } from '../../../pages/login-page/login.page';
import { TasksPage } from '../../../pages/tasks-page/tasks-page';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../../services/app-services';
import { EAFRestService } from '../../../services/eaf-rest/eaf-rest.service';
import { PictureService } from '../../../services/picture-service/picture.service';
import { AssignmentService } from '../../service/assignmentService';
import { CheckInOutService } from '../../service/checkInOutService';
import { WorkforceHttpService } from '../../service/workforceHttpService';
import { WorkforceService } from '../../service/workforceService';
import { ApproveTabPage } from '../approve-tabs-page/approve-tabs-page';
import { CalendarPage } from '../calendar-page/calendar-page';
import { CheckInOut } from '../check-in&out.page/check-in&out.page';
import { DashboardsPage } from '../dashboards-page/dashboards-page';
import { LeavePage } from '../leave-page/leave-page';
import { MenuPage } from '../menu-page/menu-page';
import { PatientAcuityEvaluationPage } from '../patients-acuity-evaluation/patients-acuity-evaluation.page';
import { ShiftPage } from '../shift-page/shift-page';
import { UserProfileDetailPage } from '../user-profile-detail/user-profile-detail';
import { AppConstant } from '../../../constants/app-constant';

@Component({
    selector: 'workforce-home',
    templateUrl: 'workforce-home.page.html'
})
export class WorkForceHomePage {

    private isLoggedIn: boolean = false;
    private statusCheckInOut: any = [];
    private checkTime: any = [];
    private AmPm: any = [];

    constructor(
        private appLoadingService: AppLoadingService,
        private appServices: AppServices,
        private appState: AppState,
        private assignmentService: AssignmentService,
        private checkInOutService: CheckInOutService,
        private eafRestService: EAFRestService,
        public navCtrl: NavController,
        private pictureService: PictureService,
        private translationService: TranslationService,
        private wfHttpService: WorkforceHttpService,
        private sanitizer: DomSanitizer,
        private workforceService: WorkforceService,
    ) {
    }

    public ionViewWillEnter() {
        this.isLoggedIn = this.appState.isLoggedIn;
        this.isLoggedIn && this.wfHttpService.handshakeWithHCM_Auth().subscribe(resp => resp);
        this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.RELOAD_IMAGE_PROFILE, this.appState.businessUser && this.appState.businessUser.employeeCode);
        this.getLastChecknOutLessCode();
    }

    private checkInTime: any;
    private checkOutTime: any;
    private isDateLoading: boolean = true;
    public getLastChecknOutLessCode() {
        let toDayList: any[] = [];
        const toDayStr = moment(new Date()).format("YYYY-MM-DD");
        this.checkInOutService.getCheckInOutHistory().subscribe((resp) => {
            if (resp) {
                toDayList = (resp || []).filter(itm => toDayStr.equals(itm.recorderDate));
                console.log("itm.recorderDate: ", resp);
                console.log("getLastChecknOutLessCode toDayList :", toDayList);
                if (toDayList && toDayList.length > 0) {
                    let currDate = toDayList[0];
                    this.checkInTime = moment(currDate.recorderDate + "T" + currDate.recorderIn);
                    if (currDate.recorderOut) {
                        this.checkOutTime = moment(currDate.recorderDate + "T" + currDate.recorderOut);
                    }
                    this.isDateLoading = false;
                } else {
                    this.isDateLoading = false;
                }
            } else {
                this.isDateLoading = false;
            }
        }, (err) => {
            this.isDateLoading = false;
        });
    }

    private translateCheckInOut(_words: string): void {
        const subscriber = this.translationService.translate(_words);
        return subscriber;
    }

    private PAGE_COMP = {
        "CalendarPage": CalendarPage,
        "CheckInOut": CheckInOut,
        "MenuPage": MenuPage,
        "Userprofile": UserProfileDetailPage,
        "LeavePage": LeavePage,
        "ApprovePage": ApproveTabPage,
        "My Profile": UserProfileDetailPage,
        "Task": TasksPage,
        "Shift": ShiftPage,
        "Dashboard": DashboardsPage,
        "Patient Acuity Eevaluation": PatientAcuityEvaluationPage,
    };

    private goRoot(pageName: any) {
        if (!this.isLoggedIn) {
            console.warn("User did not login,please login !!!! ");
            this.navCtrl.push(LoginPage);
            return;
        }
        const pageComponent = this.PAGE_COMP[pageName];
        this.navCtrl.push(pageComponent, {}, { animate: true, direction: "forward" });
    }

    public uploadUserProfileImageWF() {
        if (this.appServices.isServeChrome()) {
            let fileElem = document.getElementById('userImageFileInputIdWF');
            console.log("fileElem :", fileElem);
            fileElem && fileElem.click();
        } else {
            this.pictureService.requestPicture((imagePath) => {
                this.appLoadingService.showLoading(this.translationService.translate('COMMON.USERPROFILE.UPDATING_PROFILE') + '...');
                this.eafRestService.uploadFileV2(imagePath).subscribe((uploadResponse) => {
                    this.pictureService.getFileDirectory(imagePath).subscribe(fileItem => {
                        console.log("getFileDirectory fileItem:", fileItem);
                        this.assignmentService.hcmUploadProfileImage([fileItem], "UserImageProfiles").subscribe((resp) => {
                            console.log("hcmUploadProfileImage :", resp);
                            this.getReLoadUserProfileImage();
                            this.hideLoading();
                        });
                    });
                });
            });
        }
    }

    private rawImageUser = HCMRestApi.getHCMImageUrl(this.appState.businessUser && (this.appState.businessUser.employeeCode || this.appState.businessUser.userCode)) + '&' + moment().format("YYYYMMDDHmm");
    private sanitizedImageUser = this.sanitizer.bypassSecurityTrustStyle("url('" + this.rawImageUser + "')");

    private getReLoadUserProfileImage(): void {
        this.rawImageUser = HCMRestApi.getHCMImageUrl(this.appState.businessUser && (this.appState.businessUser.employeeCode || this.appState.businessUser.userCode));
        this.sanitizedImageUser = this.sanitizer.bypassSecurityTrustStyle("url('" + this.rawImageUser + "')");
    }

    private getAttachmentsWF() {
        let inputFileField = document.getElementById("userImageFileInputIdWF");
        let filesList = [];
        if (inputFileField != null) {
            filesList = inputFileField['files'];
        }
        if (filesList.length > 0) {
            const fileItem = filesList[0];
            const pathFile = this.workforceService.getFilePath(fileItem);
            console.log("pathFile :", pathFile);

            this.appLoadingService.showLoading(this.translationService.translate('COMMON.USERPROFILE.UPDATING_PROFILE') + '...');
            try {
                let _targetUrl = EAFRestApi.URL_UPLOAD;
                let formData: any = new FormData();
                let xmlHttpRequest = new XMLHttpRequest();
                xmlHttpRequest.open("POST", _targetUrl, true);

                xmlHttpRequest.setRequestHeader("clientId", this.eafRestService.eafSession.clientId);
                xmlHttpRequest.setRequestHeader("authorization", this.eafRestService.eafSession.idToken || this.eafRestService.eafSession.id_token);

                let fileName = fileItem.name || '';
                xmlHttpRequest.setRequestHeader('Content-Disposition', 'form-data; name="file" filename="' + fileName + '"');
                console.log("fileObj:", fileItem);
                formData.append("file", fileItem, fileName);

                for (var pair of formData.entries()) {
                    console.log(`FormData :'${pair[0]}'`, pair[1]);
                }
                xmlHttpRequest.onloadend = () => {
                    const respJson = JSON.parse(xmlHttpRequest.response);
                    console.log("xmlHttpRequest.onloadend :", respJson.data);
                    this.assignmentService.hcmUploadProfileImage([fileItem], "UserImageProfiles").subscribe((resp) => {
                        console.log("hcmUploadProfileImage :", resp);
                        this.getReLoadUserProfileImage();
                        this.hideLoading();
                    });
                };
                xmlHttpRequest.send(formData);
            } catch (error) {
                console.error("xmlHttpRequest.error :", error);
                this.hideLoading();
            }
        }
    }

    private hideLoading(cb?: () => void) {
        this.appLoadingService.hideLoading().then(() => {
            cb && cb();
        });
    }
}
