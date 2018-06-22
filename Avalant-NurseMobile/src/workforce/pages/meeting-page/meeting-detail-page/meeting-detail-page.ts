import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppLoadingService } from '../../../../services/app-loading-service/app-loading.service';
import { StringUtil } from '../../../../utilities/string.util';
import { ContsVariables } from '../../../global/contsVariables';
import { MeetingModel } from '../../../model/meeting.model.ts';
import { MeetingService, MeetingUpdateStatusModel } from '../../../service/meetingService';
import { TasksPage } from '../../../../pages/tasks-page/tasks-page';
import { HCMConstant } from '../../../../constants/hcm/hcm-constant';
import { AppState } from '../../../../app/app.state';

@Component({
    selector: 'meeting-detail-page',
    templateUrl: 'meeting-detail-page.html',
    animations: [
        AnimateCss.peek(),
    ]
})
export class MeetingDetailPage implements OnInit {

    private meeting: any = {};
    constructor(
        private navCtrl: NavController,
        private meetingService: MeetingService,
        private appLoadingService: AppLoadingService,
        private appState: AppState,
        private navParams: NavParams,
    ) {

    }

    public ngOnInit(): void {
        this.meeting = this.navParams.get("meetingData");
        console.log("this.meeting :", this.meeting);
    }

    public ionViewDidEnter() {

    }

    public ionViewWillEnter() {

    }

    private clicked(_meeting: any): void {
        console.log("_meeting :", _meeting);
    }
    private getMeetingClassStatus(_taskStatus: string): string {
        if (HCMConstant.AssignmentStatus.OPEN.equals(_taskStatus)) {
            return 'open';
        } else if (HCMConstant.AssignmentStatus.ONPROCESS.equals(_taskStatus)) {
            return 'onprocess';
        } else if (HCMConstant.AssignmentStatus.ACCEPTED.equals(_taskStatus)) {
            return 'accepted';
        } else if (HCMConstant.AssignmentStatus.DENIED.equals(_taskStatus)) {
            return 'denied';
        } else if (HCMConstant.AssignmentStatus.CANCEL.equals(_taskStatus)) {
            return 'cancel';
        } else if (HCMConstant.AssignmentStatus.COMPLETE.equals(_taskStatus)) {
            return 'complete';
        } else {
            return null;
        }
    }

    private isHasLatLngParams(_assign: any): boolean {
        let lat, lng;
        lat = ((_assign || {}).latitude || "");
        lng = ((_assign || {}).longitude || "");
        return !StringUtil.isEmptyString(lat + lng);
    }
    private getLatLngParams(_assign: any) {
        let latlng = null, lat, lng;
        lat = ((_assign || {}).latitude || "");
        lng = ((_assign || {}).longitude || "");
        latlng = [lat, lng].join(",");
        return latlng;
    }

    private acceptAssign(meeting: MeetingModel) {
        this.appLoadingService.showLoading();
        const acceptM: MeetingUpdateStatusModel = new MeetingUpdateStatusModel;
        acceptM.status = ContsVariables.StatusAssigment.ACCEPTED;
        acceptM.responsibleCode = meeting.responsibleCode;
        acceptM.organizationId = this.appState.currentOrganizationId;
        acceptM.userId = this.appState.employeeCode;
        this.meetingService.updateStatusResponsible(acceptM).subscribe((res) => {
            console.log("acceptAssign res:", res);
            this.appLoadingService.hideLoading().then(() => {
                this.navCtrl.pop();
            });
        });
    }

    private rejectAssign(meeting: MeetingModel) {
        this.appLoadingService.showLoading();
        const rejectM: MeetingUpdateStatusModel = new MeetingUpdateStatusModel;
        rejectM.status = ContsVariables.StatusAssigment.DENIED;
        rejectM.responsibleCode = meeting.responsibleCode;
        rejectM.organizationId = this.appState.currentOrganizationId;
        rejectM.userId = this.appState.employeeCode;
        this.meetingService.updateStatusResponsible(rejectM).subscribe((res) => {
            console.log("rejectAssign res:", res);
            this.appLoadingService.hideLoading().then(() => {
                this.navCtrl.pop();
            });
        });
    }
}