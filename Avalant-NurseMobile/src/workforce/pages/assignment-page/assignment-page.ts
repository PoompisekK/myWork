import 'rxjs/add/operator/debounceTime';

import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';

import { AnimateCss } from '../../../animations/animate-store';
import { AppConstant } from '../../../constants/app-constant';
import { toRaw, isDev } from '../../../constants/environment';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { StringUtil } from '../../../utilities/string.util';
import { AssignmentModel } from '../../model/assignment.model';
import { AssignmentService } from '../../service/assignmentService';
import { AssignmentCreateEventPage } from './assignment-event-pages/assignment-createEvent-page/assignment-createEvent-page';
import { AssignmentViewEventPage } from './assignment-event-pages/assignment-viewEvent-page/assignment-viewEvent-page';
import { AppServices } from '../../../services/app-services';

@Component({
  selector: 'assignment-page',
  templateUrl: 'assignment-page.html',
  animations: [
    AnimateCss.peek(),
  ]
})
export class AssignmentPage {

  private KEY_INBOX: string = "inbox";
  private KEY_OUTBOX: string = "outbox";

  private inputSearch: Subject<string> = new Subject();
  private selectInbox: boolean = true;
  private selectOutbox: boolean = false;
  private selectedAssign: string = this.KEY_INBOX;

  constructor(
    public modalController: ModalController,
    public navCtrl: NavController,
    private assignmentService: AssignmentService,
    private appServices: AppServices,
    private appLoadingService: AppLoadingService,
  ) {

  }
  public ngOnInit() {
    this.inputSearch.debounceTime(AppConstant.APP_DEBOUNCE_SEARCH_TIME).subscribe((messageInput) => {
      this.assignmentService.searchAssignment(messageInput).subscribe((res) => {
        this.allAssignmentsTask = res;
      });
    });
  }

  private isLoading = true;
  public ionViewWillEnter() {
    this.isLoading = true;
    // this.getInboxTask();
    this.selectAssign(this.selectedAssign);
  }

  private doRefresh(refresher) {
    // refresher
    this.appLoadingService.showLoading();
    this.selectAssign(this.selectedAssign, () => {
      refresher.complete();
    });
  }

  private clickSelectAssign(type: string, cb?: () => void) {
    this.isLoading = true;
    this.selectAssign(type);
  }

  private selectAssign(type: string, cb?: () => void) {
    if (type == this.KEY_INBOX) {
      this.selectInbox = true;
      this.selectOutbox = !this.selectInbox;
      this.selectedAssign = this.KEY_INBOX;
      this.getInboxTask(cb);
    } else if (type == this.KEY_OUTBOX) {
      this.selectInbox = false;
      this.selectOutbox = !this.selectInbox;
      this.selectedAssign = this.KEY_OUTBOX;
      this.getOutboxTask(cb);
    } else {
      console.error("type :", type);
    }
  }
  private allGroupAssignTask: any[] = [];
  private allAssignmentsTask: any[] = [];
  private getInboxTask(cb?: () => void) {
    this.assignmentService.getResponsibletTask().subscribe((inbotResult) => {
      this.sortTask(inbotResult, cb);
    });
  }
  private getOutboxTask(cb?: () => void) {
    this.assignmentService.getAssignmenetTask().subscribe((outboxResult) => {
      this.sortTask(outboxResult, cb);
    });
  }

  private sortTask(_taskResultList: any[], callback?: () => void) {
    this.allAssignmentsTask = [];
    setTimeout(() => {
      this.allAssignmentsTask = _taskResultList || [];
      this.allGroupAssignTask = this.assignmentService.collapsedToGroup(this.allAssignmentsTask);
      console.log("allGroupAssignTask :", toRaw(this.allGroupAssignTask));
      console.log("allAssignmentsTask :", toRaw(this.allAssignmentsTask));
      this.appLoadingService.hideLoading().then(() => {
        this.isLoading = false;
        callback && callback();
      });
    }, 750);
  }

  private goToCreateEventAsssignment() {
    this.appServices.openModal(AssignmentCreateEventPage, {});
  }

  private goToViewEventAsssignment(assign: AssignmentModel) {
    let selectedAssign;
    if (this.selectInbox) {
      selectedAssign = "inbox";
      this.assignmentService.getResponsiblet(assign.responsibleCode).subscribe((detailAssign) => {
        console.log("getResponsiblet :", detailAssign);
        this.navCtrl.push(AssignmentViewEventPage, {
          assign: detailAssign,
          selectedAssign: selectedAssign
        });
      });
    } else {
      selectedAssign = "outbox";
      this.assignmentService.getAssignmenet(assign.assignmentCode).subscribe((detailAssign) => {
        console.log("getAssignmenet :", detailAssign);
        this.navCtrl.push(AssignmentViewEventPage, {
          assign: detailAssign,
          selectedAssign: selectedAssign
        });
      });

    }
  }
  private currDateString: string = moment(new Date()).format("D MMMM YYYY");
  private getThisWeekTask(_isNextWeek?: boolean): number {
    let totalTaskOfWeek = 0;
    let currDateTmp = new Date();
    isDev() && console.log("Curr Date :", moment(currDateTmp).format("dddd D MMMM YYYY"));
    let firstDateOfWeek = new Date();
    firstDateOfWeek.setDate(firstDateOfWeek.getDate() - currDateTmp.getDay() + (_isNextWeek ? 7 : 0));
    isDev() && console.log("firstDateOfWeek Date :", moment(firstDateOfWeek).format("dddd D MMMM YYYY"));
    for (let idx = 0; idx <= 6; idx++) {
      let thatDateTmp = new Date(firstDateOfWeek);
      thatDateTmp.setDate(thatDateTmp.getDate() + idx);
      isDev() && console.log("start :[" + idx + "] Curr Date :", moment(thatDateTmp).format("dddd D MMMM YYYY"));
      totalTaskOfWeek = totalTaskOfWeek + this.getTaskThatDate(thatDateTmp);
    }
    return totalTaskOfWeek;
  }

  private getTaskThatDate(_thatDate: Date): number {
    const currDayString = moment(_thatDate).format("D MMMM YYYY");
    const langTodayStr = this.assignmentService.getFirstCalendarText();
    let thatDateTask = (this.allGroupAssignTask || []).find((task) => task.date == currDayString);
    return thatDateTask ? (thatDateTask.task || []).length : 0;
  }

  private getTodayTask(): number {
    let currDateTask = (this.allGroupAssignTask || []).find((task) => task.date == this.currDateString);
    return currDateTask ? (currDateTask.task || []).length : 0;
  }
}
