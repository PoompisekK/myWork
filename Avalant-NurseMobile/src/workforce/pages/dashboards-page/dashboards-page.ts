import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppServices } from '../../../services/app-services';
import { WorkforceHttpService } from '../../service/workforceHttpService';
import { DashboardChartPage } from './dashboard-chart/dashboard-chart';

@Component({
  selector: 'dashboards-page',
  templateUrl: 'dashboards-page.html'
})
export class DashboardsPage {
  private dashboardMenus: { iconSrc: string, page: any, name: string }[] = [];
  constructor(
    public navCtrl: NavController,
    public wfHttpService: WorkforceHttpService,
    public appServices: AppServices,
  ) {
    this.dashboardMenus.push({ page: DashboardChartPage, name: "Average of patient", iconSrc: "assets/img/svg/menu/chart-line.png" });
    this.dashboardMenus.push({ page: null, name: "Work Group Monthly Hour", iconSrc: "assets/img/svg/menu/chart-bar.png" });
    this.dashboardMenus.push({ page: null, name: "Department Monthly Hour", iconSrc: "assets/img/svg/menu/chart-bar.png" });
    this.dashboardMenus.push({ page: null, name: "Productivity", iconSrc: "assets/img/svg/menu/chart-line.png" });
  }

  public goRoot(ComponentType: any) {
    if (ComponentType) {
      this.navCtrl.pop().then(() => {
        this.navCtrl.push(ComponentType, {}, { animate: true, animation: "", direction: "forward" });
      });
    }
  }
}
