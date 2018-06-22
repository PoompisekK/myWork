import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppServices } from '../../../../services/app-services';
import { WorkforceHttpService } from '../../../service/workforceHttpService';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { ChartJSService } from '../../../service/charjsService';
@Component({
    selector: 'dashboard-chart',
    templateUrl: 'dashboard-chart.html'
})
export class DashboardChartPage {

    @ViewChild('barCanvas') private barCanvas: ElementRef;
    @ViewChild('lineCanvas') private lineCanvas: ElementRef;
    @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;

    private barChart: any;
    private lineChart: any;
    private doughnutChart: any;

    constructor(
        public navCtrl: NavController,
        public wfHttpService: WorkforceHttpService,
        public appServices: AppServices,
        public chartService: ChartJSService,

    ) {
    }
    private _dChart = [
        { bdColor: "rgba(255, 99, 132, 1)", bgColor: "rgba(255, 99, 132, .5)", data: 12, labels: moment().format("MMM/DD") },
        { bdColor: "rgba(54, 162, 235, 1)", bgColor: "rgba(54, 162, 235, .5)", data: 24, labels: moment().add(1, 'days').format("MMM/DD") },
        { bdColor: "rgba(255, 206, 86, 1)", bgColor: "rgba(255, 206, 86, .5)", data: 51, labels: moment().add(2, 'days').format("MMM/DD") },
        { bdColor: "rgba(75, 192, 192, 1)", bgColor: "rgba(75, 192, 192, .5)", data: 77, labels: moment().add(3, 'days').format("MMM/DD") },
        { bdColor: "rgba(153, 102, 255, 1)", bgColor: "rgba(153, 102, 255, .5)", data: 43, labels: moment().add(4, 'days').format("MMM/DD") },
        { bdColor: "rgba(255, 159, 64, 1)", bgColor: "rgba(255, 159, 64, .5)", data: 26, labels: moment().add(5, 'days').format("MMM/DD") },
    ];

    public ionViewDidLoad() {
        this.chartService.setChartValue(this._dChart);
        this.barChart = this.chartService.getBarChart(this.barCanvas);
        this.lineChart = this.chartService.getLineChart(this.lineCanvas);
        this.doughnutChart = this.chartService.getDoughnutChart(this.doughnutCanvas);
    }
}
