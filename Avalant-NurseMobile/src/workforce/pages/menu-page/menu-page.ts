import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TasksPage } from '../../../pages/tasks-page/tasks-page';
import { AppServices } from '../../../services/app-services';
import { WorkforceHttpService } from '../../service/workforceHttpService';
import { ApproveTabPage } from '../approve-tabs-page/approve-tabs-page';
import { CalendarPage } from '../calendar-page/calendar-page';
import { DashboardsPage } from '../dashboards-page/dashboards-page';
import { LeavePage } from '../leave-page/leave-page';
import { MeetingPage } from '../meeting-page/meeting-page';
import { ShiftPage } from '../shift-page/shift-page';
import { PatientAcuityEvaluationPage } from '../patients-acuity-evaluation/patients-acuity-evaluation.page';

@Component({
  selector: 'menu-page',
  templateUrl: 'menu-page.html'
})
export class MenuPage {
  private menuList: any[] = [];
  constructor(
    public navCtrl: NavController,
    public wfHttpService: WorkforceHttpService,
    public appServices: AppServices,
  ) {
    this.menuList = [
      { page: ApproveTabPage, name: "Approve", iconSrc: "assets/img/svg/menu/approve_menu.svg" },
      { page: LeavePage, name: "Leave", iconSrc: "assets/img/svg/menu/leave_menu.svg" },
      { page: TasksPage, name: "Tasks", iconSrc: "assets/img/svg/menu/assignment_menu.svg" },
      { page: CalendarPage, name: "Calendar", iconSrc: "assets/img/svg/menu/calendar_menu.svg" },
      { page: ShiftPage, name: "Shift", iconSrc: "assets/img/svg/menu/expense_menu.svg" },
      { page: DashboardsPage, name: "Dashboard", iconSrc: "assets/img/svg/menu/chart-bar.png" },

      { page: PatientAcuityEvaluationPage, name: "Patient Acuity Eevaluation", iconSrc: "assets/img/svg/menu/payslip_menu.svg" },
      // { page: NewHomeLoanPage, name: "Loan", iconSrc: "assets/img/svg/menu/loan_menu.svg" }
    ];
  }
  public goRoot(ComponentType: any) {
    if (ComponentType) {
      this.navCtrl.pop().then(() => {
        this.navCtrl.push(ComponentType, {}, { animate: true, animation: "", direction: "forward" });
      });
    }
  }
}
