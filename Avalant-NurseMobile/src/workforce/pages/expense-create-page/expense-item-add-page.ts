import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';

import { AnimateCss } from '../../../animations/animate-store';
import { AppServices } from '../../../services/app-services';
import { ExpenseService } from '../../service/expenseService';
import { WorkforceService } from '../../service/workforceService';
import { CalendarDatePickerService } from '../../../services/calendar-date-picker-service/calendar-date-picker-service';

@Component({
  selector: 'expense-item-add-page',
  templateUrl: 'expense-item-add-page.html',
  animations: [
    AnimateCss.peek()
  ]
})
export class ExpenseItemAddPage {
  private callback: any;
  private expItm: { [key: string]: any } = {};
  private expenseTypeLists: any[] = [];

  constructor(
    private appService: AppServices,
    private expenseService: ExpenseService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private calendarDatePickerService: CalendarDatePickerService,
    private viewCtrl: ViewController,
    private workforceService: WorkforceService,
  ) {
  }
  private ionViewDidEnter() {
    this.callback = this.navParams.get("callback");
    this.expItm = this.navParams.get("expenseItemData") || {};
    this.expenseService.getExpenseType().subscribe((resp) => {
      console.log("getExpenseType :", resp);
      this.expenseTypeLists = (resp && resp).filter(existItm => existItm.expenseGroupCode == 'EXPENSE');
      console.log("expenseTypeLists :", this.expenseTypeLists);
    });
  }

  private attachFile() {
    if (this.appService.isServeChrome()) {
      let fileElem = document.getElementById('attachmentsInputId');
      console.log("fileElem :", fileElem);
      fileElem && fileElem.click();
    } else {
      this.workforceService.requestPicture().then((file) => {
        if (!this.expItm || !this.expItm.files) {
          this.expItm.files = [];
        }
        this.expItm.files.push(file);
        console.log("requestPicture :", file);
      });
    }
  }

  private getAttachments() {
    let inputFileField = document.getElementById("attachmentsInputId");
    let filesList = [];
    if (inputFileField != null) {
      filesList = inputFileField['files'];
    }
    if (this.expItm && !this.expItm.files) {
      this.expItm.files = [];
    }
    for (let idx = 0; idx < filesList.length; idx++) {
      let fileObj = filesList[idx];
      this.expItm.files.push(fileObj);
      console.warn('this.expItm.fileObj:', fileObj);
    }
  }

  private showDateTimePicker(_field: any, _picker: string) {
    console.log("showDateTimePicker :", this.expItm);
    this.calendarDatePickerService.getDisplayDateTimePicker(this.expItm[_field] || new Date(), _picker).subscribe((dateResult) => {
      this.expItm[_field] = dateResult;
    });
  }

  private getFileExtension(filename: string): string {
    return ((/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined || '').toLowerCase();
  }
  private isFileType(fileItm: any, index: number): boolean {
    let fileIx = (fileItm.name || fileItm.fileName);
    if (index == 1 && "log txt text doc ppt xls docx pptx xlsx".indexOf(this.getFileExtension(fileIx)) > -1) {
      return true;
    } else if (index == 2 && "pdf".indexOf(this.getFileExtension(fileIx)) > -1) {
      return true;
    } else if (index == 3 && "png jpg jpeg gif bmp svg".indexOf(this.getFileExtension(fileIx)) > -1) {
      return true;
    } else {
      return false;
    }
  }

  private addExpenseType() {
    if (this.callback) {
      let cbParams = {
        _expenseItemIndex: (this.expItm._expenseItemIndex != null ? this.expItm._expenseItemIndex : -1),
        object: this.expItm
      };
      console.log("this.callback(data) :", cbParams);
      this.callback(cbParams).then(() => {
        this.backToExpense();
      });
    } else {
      console.warn("this.callback :", this.callback);
      this.backToExpense();
    }
  }
  private cancelAddExpenseType() {
    this.backToExpense();
  }
  private backToExpense() {
    this.viewCtrl && this.viewCtrl.dismiss(null, null, { animate: true, animation: 'transition', duration: 450, direction: 'back' });
  }
}
