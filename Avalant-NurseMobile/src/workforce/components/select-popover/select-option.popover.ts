/**
 * @author Bundit.Ng
 * @since  Tue May 23 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
import { Component, Input } from "@angular/core";
import { ViewController } from "ionic-angular";

@Component({
  selector: 'select-option-popover',
  templateUrl: 'select-option-popover.html',
})
export class SelectOptionsListPopoverPage {
  @Input('data')
  private itemList: Array<SelectOptionsPopoverModel> = [];
  constructor(public viewCtrl: ViewController) {
    this.itemList = this.viewCtrl.data != null ? this.viewCtrl.data : [];
  }
  private close(val) {
    this.viewCtrl.dismiss(val);
  }
}
export class SelectOptionsPopoverModel {
  public code: string;
  public name: string;
  constructor(_code: string, _name: string) {
    this.code = _code;
    this.name = _name;
  }
}