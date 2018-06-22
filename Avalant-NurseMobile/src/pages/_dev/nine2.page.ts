import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'nine2-page',
  templateUrl: 'nine2.page.html'
})

export class NinePage2 implements OnInit {

  private dataList: any[];
  private backUpList: any[];
  private dataName: string;
  private dataCode: string;
  private showDataList: any[];
  private searchValue: string;

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController
  ) {
    this.dataList = this.params.get('dataList');
    this.dataName = this.params.get('dataName');
    this.dataCode = this.params.get('dataCode');

    this.showDataList = [];
    for (let i of this.dataList) {
      let data = {
        name: i[this.dataName],
        code: i[this.dataCode],
      };
      this.showDataList.push(data);
    }
    this.backUpList = this.showDataList;
  }

  public ngOnInit() { }

  private runSearch(e: any) {

    if (!this.searchValue) {
      this.showDataList = this.backUpList;
    }
    else {
      this.showDataList = this.backUpList.filter(value => value.name.indexOf(this.searchValue) > -1);
    }
  }

  private selectItem(item: any) {
    this.viewCtrl.dismiss(item);
  }
}