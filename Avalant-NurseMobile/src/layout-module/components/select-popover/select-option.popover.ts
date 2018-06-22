/**
 * @author Bundit.Ng
 * @since  Tue May 23 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
import { Component, Input } from "@angular/core";
import { ViewController } from "ionic-angular";

@Component({
  template: `
    <ion-list style="margin:0" >
      <button ion-item (click)="close(item?.code)" *ngFor="let item of itemList">{{item?.name}}</button>
      <button ion-item *ngIf="itemList.length == 0">No data</button>
    </ion-list>`
})
export class SelectOptionsListPopoverPage {
  @Input('data')
  private itemList: Array<SelectOptionsPopoverModel> = [];
  constructor(public viewCtrl: ViewController) {
    this.itemList = this.viewCtrl.data != null ? this.viewCtrl.data : [];
  }
  public close(val) {
    this.viewCtrl.dismiss(val);
  }
}
export class SelectOptionsPopoverModel {
  private code: string;
  private name: string;
  constructor(_code: string, _name: string) {
    this.code = _code;
    this.name = _name;
  }
}