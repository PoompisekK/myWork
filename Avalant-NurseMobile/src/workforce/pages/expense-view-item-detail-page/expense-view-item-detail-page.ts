import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';

import { AnimateCss } from '../../../animations/animate-store';
import { ExpenseService } from '../../service/expenseService';

@Component({
  selector: 'expense-view-item-detail-page',
  templateUrl: 'expense-view-item-detail-page.html',
  animations: [
    AnimateCss.peek(),
  ]
})
export class ExpenseViewItemDetailPage {
  private expenseM: any = {};
  private expenseTypeLists: any[] = this.expenseService.expenseTypeList;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalController: ModalController,
    public expenseService: ExpenseService,
  ) {

  }

  public ionViewWillEnter() {
    console.clear();
    this.expenseM = this.navParams.get("expenseObject");
    console.log("getExpenseItemDetail :", this.expenseM);
  }
}
