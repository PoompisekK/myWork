import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

import { AnimateCss } from '../../animations/animate-store';
import { AppState } from '../../app/app.state';
import { AppConstant } from '../../constants/app-constant';
import { toRaw } from '../../constants/environment';
import { HCMConstant } from '../../constants/hcm/hcm-constant';
import { AppLoadingService } from '../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../services/app-services';
import {
    AssignmentCreateEventPage,
} from '../../workforce/pages/assignment-page/assignment-event-pages/assignment-createEvent-page/assignment-createEvent-page';
import { AppAlertService } from '../../workforce/service/appAlertService';
import { AssignmentService } from '../../workforce/service/assignmentService';
import { TasksDetailPage } from '../tasks-detail-page/tasks-detail-page';

export module TaskType {
    export const Inbox: string = "Inbox";
    export const Outbox: string = "Outbox";
    export const MyTask: string = "MyTask";
}

@Component({
    selector: 'page-tasks-page',
    templateUrl: 'tasks-page.html',
    animations: [
        AnimateCss.peek(),
    ]
})
export class TasksPage {
    private TaskType = TaskType;
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private appServices: AppServices,
        private appAlertService: AppAlertService,
        private assignmentService: AssignmentService,
        private appState: AppState,
        private appLoadingService: AppLoadingService,
    ) { }

    private allAssignmentsTask: any[] = [];
    private currentDate: Date = new Date();
    private isLoading: boolean;
    public ngOnInit() {
        this.isLoading = true;
        // this.loadInbox();
        // this.getOutboxTask();
        this.loadCurrentTaskType();

        this.appServices.subscribe(this.subscribeEventsName, () => {
            this.loadCurrentTaskType();
        });
    }

    private subscribeEventsName: string = AppConstant.EVENTS_SUBSCRIBE.CALENDAR_TASK_CREATE;
    public ionViewWillLeave() {
        this.appServices.unsubscribe(this.subscribeEventsName);
    }

    private activeTaskTypeName: string = TaskType.Inbox;

    private loadOutbox(cb?: () => void) {
        this.getOutboxTask((outboxResult) => {
            this.sortTask(outboxResult, (sortResp) => {
                this.allAssignmentsTask = sortResp;
                this.sumPassDue(sortResp);
                cb && cb();
            });
        });
    }

    private loadInbox(cb?: () => void) {
        this.getInboxTask((inboxResult) => {
            this.sortTask(inboxResult, (sortResp) => {
                this.allAssignmentsTask = sortResp;
                this.sumPassDue(sortResp);
                cb && cb();
            });
        });
    }

    private loadCurrentTaskType(cb?: () => void) {
        console.log("active-task-type-name:", this.activeTaskTypeName);
        if (TaskType.Inbox.equals(this.activeTaskTypeName)) {
            this.getOutboxTask(() => {
                this.loadInbox(() => { cb && cb(); });
            });
        } else if (TaskType.Outbox.equals(this.activeTaskTypeName)) {
            this.getInboxTask(() => {
                this.loadOutbox(() => { cb && cb(); });
            });
        }
    }

    private getActiveClass(_taskTypeName: string): string {
        return this.activeTaskTypeName.equalsIgnoreCase(_taskTypeName) ? 'active' : "";
    }

    private changeTaskType(_taskTypeName: string) {
        this.isLoading = true;
        this.activeTaskTypeName = _taskTypeName;
        if (TaskType.Inbox.equals(_taskTypeName) || TaskType.Outbox.equals(_taskTypeName)) {
            this.loadCurrentTaskType();
            // } else if (TaskType.Inbox.equals(_taskTypeName)) {
            //     this.loadInbox();
            // } else if (TaskType.Outbox.equals(_taskTypeName)) {
            //     this.loadOutbox();
        } else if (TaskType.MyTask.equals(_taskTypeName)) {
            this.allAssignmentsTask = [];
            setTimeout(() => {
                this.myTaskAmt = 0;
                this.isLoading = false;
            }, 1000);
        } else {

        }
    }

    private doRefresh(refresher) {
        this.appLoadingService.showLoading();
        this.loadCurrentTaskType(() => {
            this.appLoadingService.hideLoading().then(() => {
                refresher.complete();
            });
        });

        // this.loadInbox(() => {
        //     this.appLoadingService.hideLoading().then(() => {
        //         refresher.complete();
        //     });
        // });
    }

    private dateTime(date) {
        const startdate = moment(date.startDate).format("DD MMMM YYYY");
        const todate = moment(date.targetDate).format("DD MMMM YYYY");

        if (startdate == todate) {
            return startdate;
        } else {
            return startdate + '-' + todate;
        }
    }

    private createTask() {
        this.appServices.subscribe(AppConstant.EVENTS_SUBSCRIBE.CALENDAR_TASK_CREATE, () => {
            this.isLoading = true;

        });
        this.appServices.openModal(AssignmentCreateEventPage);
    }

    private sumPeople(people) {
        return people - 3;
    }

    private inboxTaskAmt: number = 0;
    private outboxTaskAmt: number = 0;
    private myTaskAmt: number = 0;

    private getInboxTask(cb?: (resp?: any[]) => void): void {
        this.allAssignmentsTask = [];
        this.assignmentService.getResponsibletTask().subscribe((inbotResult: any[]) => {
            this.inboxTaskAmt = inbotResult.length;
            cb && cb(inbotResult);
        });
    }

    private getOutboxTask(cb?: (resp?: any[]) => void) {
        this.allAssignmentsTask = [];
        this.assignmentService.getAssignmenetTask().subscribe((outboxResult: any[]) => {
            this.outboxTaskAmt = outboxResult.length;
            cb && cb(outboxResult);
        });
    }
    private passDueAmt: number = 0;
    private sumPassDue(_taskResultList: any[]) {
        this.passDueAmt = 0;
        (_taskResultList || []).forEach((task) => {
            if (moment(task.targetDate).toDate() < moment().toDate()) {
                this.passDueAmt++;
            }
        });
    }

    private getPassDueAmt(): number {
        return this.passDueAmt;
    }

    private sortTask(_taskResultList: any[], cb: (resp) => void) {
        (_taskResultList || []).sort((a, b) => {
            let aDate = moment(a.startDate).toDate();
            let bDate = moment(b.startDate).toDate();
            if (bDate == aDate) {
                return 0;
            } else {
                return bDate < aDate ? -1 : 1;
            }
        });
        setTimeout(() => {
            this.isLoading = false;
            console.log("sortTask _taskResultList :", toRaw(_taskResultList));
            cb && cb(_taskResultList || []);
        }, AppConstant.APP_DEBOUNCE_SEARCH_TIME);
    }
    private toTasksDetail(code) {
        this.navCtrl.push(TasksDetailPage, {
            allAssignmentsTask: code,
            activeTaskTypeName: this.activeTaskTypeName
        });
    }

    public getTaskClassStatus(_taskStatus: string): string {
        return this.assignmentService.getTaskStatus(_taskStatus);
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

    public isMyStatusEqualsWith(responsibleList: any[], assignStatus: string): boolean {
        return this.assignmentService.getMyTaskStatusEqualsWith(responsibleList, assignStatus);
    }

    private ASSIGN_OPEN: string = HCMConstant.AssignmentStatus.OPEN;
    private ASSIGN_ACCEPTED: string = HCMConstant.AssignmentStatus.ACCEPTED;
    private ASSIGN_ONPROCESS: string = HCMConstant.AssignmentStatus.ONPROCESS;
    private ASSIGN_COMPLETE: string = HCMConstant.AssignmentStatus.COMPLETE;
    private ASSIGN_CANCEL: string = HCMConstant.AssignmentStatus.CANCEL;
    private ASSIGN_DENIED: string = HCMConstant.AssignmentStatus.DENIED;

    private assignmentUpdateStatus(_assign: any, _status: string) {

        let serviceHost = null;
        if (TaskType.Inbox.equals(this.activeTaskTypeName)) {
            serviceHost = this.assignmentService.updateStatusResponsible(_status, _assign);
        } else if (TaskType.Outbox.equals(this.activeTaskTypeName)) {
            serviceHost = this.assignmentService.updateStatusAssignment(_status, _assign);
        }
        if (serviceHost) {
            this.appLoadingService.showLoading();
            serviceHost.subscribe((res) => {
                this.appLoadingService.hideLoading().then(() => {
                    this.appAlertService.successAlertPopup({ description: "Update assign status complete" }).subscribe(() => {
                        this.isLoading = true;
                        this.allAssignmentsTask = [];
                        setTimeout(() => {
                            // this.getInboxTask();
                            this.loadCurrentTaskType();
                        }, 750);
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
