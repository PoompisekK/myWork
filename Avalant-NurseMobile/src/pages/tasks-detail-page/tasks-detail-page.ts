import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

import { AppState } from '../../app/app.state';
import { AppConstant } from '../../constants/app-constant';
import { HCMConstant } from '../../constants/hcm/hcm-constant';
import { AppLoadingService } from '../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../services/app-services';
import { StringUtil } from '../../utilities/string.util';
import { AppAlertService } from '../../workforce/service/appAlertService';
import { AssignmentService } from '../../workforce/service/assignmentService';
import { TaskType } from '../tasks-page/tasks-page';

@Component({
    selector: 'page-tasks-detail-page',
    templateUrl: 'tasks-detail-page.html',
})

export class TasksDetailPage {

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private appState: AppState,
        private assignmentService: AssignmentService,
        private appLoadingService: AppLoadingService,
        private appAlertService: AppAlertService,
        private appServices: AppServices,
        private modalCtrl: ModalController,
    ) { }

    private assignTaskObj: any = {};
    private activeTaskTypeName: string;

    private latLngObject: any;

    public getTaskClassStatus(_taskStatus: string): string {
        return this.assignmentService.getTaskStatus(_taskStatus);
    }

    private isHasLatLngParams(_assign: any): boolean {
        let lat, lng;
        lat = ((_assign || {}).latitude || "");
        lng = ((_assign || {}).longitude || "");
        return !StringUtil.isEmptyString(lat + lng);
    }

    private getLatLngParams(_assign: any) {
        this.latLngObject = {
            lat: _assign.latitude,
            lng: _assign.longitude
        };
        return this.latLngObject;
    }

    public ngOnInit() {
        console.clear();
        this.assignTaskObj = this.navParams.get('allAssignmentsTask');
        this.activeTaskTypeName = this.navParams.get('activeTaskTypeName');
        console.log('assignTaskObj : ', this.assignTaskObj);
        console.log('this.isInbox() : ', this.isInbox());
        this.assignmentService.getMyTaskStatus(this.assignTaskObj.listAssignResponsible);
    }

    private dateTime(date) {
        const startdate = moment(date.startDate).format("DD MMMM YYYY");
        const todate = moment(date.targetDate).format("DD MMMM YYYY");

        if (startdate == todate) {
            return startdate + ' (' + date.startTime + '-' + date.targetTime + ')';
        } else {
            return startdate + '-' + todate + ' (' + date.startTime + '-' + date.targetTime + ')';
        }
    }

    public isInbox(): boolean {
        return TaskType.Inbox.equals(this.activeTaskTypeName);
    };
    public definingStatus(assignmentObj: any, assignStatus: string): boolean {
        if (this.isInbox()) {
            return this.isMyStatusEqualsWith(assignmentObj.listAssignResponsible, assignStatus);
        } else {
            return assignStatus.equals(assignmentObj.assignStatus);
        }
    }

    private isMyStatusEqualsWith(responsibleList: any[], assignStatus: string): boolean {
        return this.assignmentService.getMyTaskStatusEqualsWith(responsibleList, assignStatus);
    }

    private sumPeople(memberPe) {
        return memberPe - 4;
    }

    private ASSIGN_OPEN: string = HCMConstant.AssignmentStatus.OPEN;
    private ASSIGN_ACCEPTED: string = HCMConstant.AssignmentStatus.ACCEPTED;
    private ASSIGN_DONE: string = HCMConstant.AssignmentStatus.DONE;
    private ASSIGN_ONPROCESS: string = HCMConstant.AssignmentStatus.ONPROCESS;
    private ASSIGN_COMPLETE: string = HCMConstant.AssignmentStatus.COMPLETE;
    private ASSIGN_CANCEL: string = HCMConstant.AssignmentStatus.CANCEL;
    private ASSIGN_DENIED: string = HCMConstant.AssignmentStatus.DENIED;

    private assignmentUpdateStatus(_assign: any, _status: string) {
        this.processUpdateStatus(_assign, _status);
        // this.appServices.subscribe("SubmitUpdateTask", (resp) => {
        //     const modalTempData = this.appServices.modalTempData;
        //     console.log("modalTempData :", modalTempData);

        //     // this.processUpdateStatus(_assign, _status);
        // });

        // const EVENT_NAME = "SubmitUpdateTask";
        // const fieldData: any[] = [{
        //     label: "Reason",
        //     type: "input"
        // }];
        // const modalOptions: ModalOptions = {
        //     cssClass: "task-update-status",
        //     enableBackdropDismiss: false,
        //     showBackdrop: false
        // };
        // const taskUpdateStatus = this.modalCtrl.create(TaskUpdateStatusModal, {
        //     fieldData: fieldData,
        //     eventName: EVENT_NAME
        // }, modalOptions);
        // taskUpdateStatus.present();
    }
    private processUpdateStatus(_assign: any, _status: string) {
        let serviceHost = null;
        if (TaskType.Inbox.equals(this.activeTaskTypeName)) {
            serviceHost = this.assignmentService.updateStatusResponsible(_status, _assign);
        } else if (TaskType.Outbox.equals(this.activeTaskTypeName)) {
            serviceHost = this.assignmentService.updateStatusAssignment(_status, _assign);
        }
        if (serviceHost) {
            this.appLoadingService.showLoading();
            serviceHost.subscribe((resp) => {
                console.log("updateStatusResponsible:", resp);
                this.appLoadingService.hideLoading().then(() => {
                    this.appAlertService.successAlertPopup({ description: "Update assign status complete" }).subscribe(() => {
                        this.navCtrl.pop();
                        this.appServices.publish(AppConstant.EVENTS_SUBSCRIBE.CALENDAR_TASK_CREATE);
                    });
                });
            }, (err) => {
                this.appLoadingService.hideLoading().then(() => {
                    this.appAlertService.errorAlertPopup({ description: "Update assign status fail" }).subscribe(() => {
                        console.error("assignmentUpdateStatus error :", err);
                    });
                });
            });
        }
    }

}
