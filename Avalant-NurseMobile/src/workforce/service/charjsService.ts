import { ElementRef, Injectable } from '@angular/core';
import * as Chart from 'chart.js';
import * as moment from 'moment';

@Injectable()
export class ChartJSService {
    private _data: any[];
    constructor(
    ) {

    }

    public setChartValue(_inData: ChartValueModel[]) {
        this._data = _inData;
    }

    public getChartValue(): ChartValueModel[] {
        return this._data || [];
    }

    private getDataChartList(filedKey: string): any[] {
        let resp: any[] = [];
        this.getChartValue().forEach(itm => {
            resp.push(itm[filedKey]);
        });
        return resp;
    }

    public getDoughnutChart(elmCanvas: ElementRef) {
        return new Chart(elmCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                labels: this.getDataChartList("labels"),
                datasets: [{
                    label: "My doughnut chart",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: this.getDataChartList("bdColor"),
                    data: this.getDataChartList("data"),
                    spanGaps: false,
                }]
            }
        });
    }

    public getLineChart(elmCanvas: ElementRef) {
        return new Chart(elmCanvas.nativeElement, {
            type: 'line',
            data: {
                labels: this.getDataChartList("labels"),
                datasets: [{
                    label: "My First dataset",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.getDataChartList("data"),
                    spanGaps: false,
                }]
            }
        });
    }

    public getBarChart(elmCanvas: ElementRef) {
        return new Chart(elmCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: this.getDataChartList("labels"),
                datasets: [{
                    label: "",
                    data: this.getDataChartList("data"),
                    backgroundColor: this.getDataChartList("bgColor"),
                    borderColor: this.getDataChartList("bdColor"),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
}
export class ChartValueModel {
    public labels: string;
    public data: string | number;
    public bgColor: string;
    public bdColor: string;
}
