import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppState } from '../../../app/app.state';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../../services/app-services';
import { PaySlipService } from '../../service/paySlipService';
import { WorkforceHttpService } from '../../service/workforceHttpService';

@Component({
  selector: 'payroll-page',
  templateUrl: 'payroll-page.html'
})
export class PayRollPage {
  private currentEmpCode: string = this.wfHttpService.employeeCode;
  private businesUser = null;
  private paySlipDataM: any = {};
  private paySlipM: any = {};
  private sumpayslip: number = 0;
  private payslipans: number = 0;

  constructor(
    public navCtrl: NavController,
    public appService: AppServices,
    public appLoadingService: AppLoadingService,
    public appState: AppState,
    public wfHttpService: WorkforceHttpService,
    public paySlipService: PaySlipService,
  ) {

  }

  private doRefresh(refresher) {
    this.loadPayslip(() => {
      refresher.complete();
    });
  }
  public ionViewWillEnter() {
    this.businesUser = this.appState.businessUser || {};
    this.loadPayslip();
  }

  private loadPayslip(cb?: (_data?: any) => void) {
    this.appLoadingService.showLoading();
    this.paySlipService.getPayRollPeriod().subscribe((resp) => {
      console.log("getPayRollPeriod :", resp);
      const slipPeriod = resp && resp.length > 0 && resp[0];
      console.log("slipPeriod :", slipPeriod);
      if (slipPeriod) {
        this.paySlipDataM = slipPeriod;
        if (slipPeriod.businessPeriodNo) {
          this.paySlipService.getPayRollSlip(slipPeriod.businessPeriodNo)
            .subscribe((respSlip) => {
              console.log("getPayRollSlip :", respSlip);
              this.appLoadingService.hideLoading().then(() => {
                if (respSlip) {
                  this.paySlipM = respSlip;

                  let incomList: any[] = this.paySlipM.incomeList || [];
                  incomList.forEach((itm: any) => {
                    this.sumpayslip += itm.amount;
                  });

                  let totalDeuction: any = this.paySlipM.totalDeuction;
                  this.payslipans = this.sumpayslip - totalDeuction.amount;
                }
              }).then(() => {
                cb && cb(respSlip);
              });
            }, error => {
              console.error("getPayRollSlip :", error);
              this.appLoadingService.hideLoading().then(() => {
                cb && cb();
              });
            });
        } else {
          this.appLoadingService.hideLoading().then(() => {
            cb && cb();
          });
        }
      } else {
        this.appLoadingService.hideLoading().then(() => {
          cb && cb();
        });
      }
    }, (error) => {
      console.error("getPayRollPeriod :", error);
      this.appLoadingService.hideLoading().then(() => {
        cb && cb();
      });
    });
  }
}