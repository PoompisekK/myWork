import { Component, ViewChild } from '@angular/core';
import { Events, NavController, NavParams, Slides, ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import * as moment from 'moment';

import { AnimateCss } from '../../../animations/animate-store';
import { AppConstant } from '../../../constants/app-constant';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../../services/app-services';
import { CalendarDatePickerService } from '../../../services/calendar-date-picker-service/calendar-date-picker-service';
import { AppAlertService } from '../../service/appAlertService';
import { ExpenseModel, ExpenseService } from '../../service/expenseService';
import { WorkforceHttpService } from '../../service/workforceHttpService';
import { WorkforceService } from '../../service/workforceService';
import { PictureService } from '../../../services/picture-service/picture.service';

@Component({
  selector: 'expense-create-page',
  templateUrl: 'expense-create-page.html',
  animations: [
    AnimateCss.peek()
  ]
})
export class ExpenseCreatePage {

  private projectLists: any[] = [];
  private expenseTypeLists: any[] = this.expenseService.expenseTypeList;
  private _tmpExpenseItemList: any[] = [{}];

  private isDate: boolean = false;
  private expenseData: any = {
    startDateTime: new Date(),
    expenseItemList: null
  };

  constructor(
    public alertController: AlertController,
    public appAlertService: AppAlertService,
    public appLoadingService: AppLoadingService,
    public appService: AppServices,
    public calendarDatePickerService: CalendarDatePickerService,
    public events: Events,
    public expenseService: ExpenseService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public wfHttpService: WorkforceHttpService,
    public workforceService: WorkforceService,
    public pictureService: PictureService,
  ) { }

  public ionViewWillEnter() {
    let expenseDate = this.navParams.get("fromDate");
    let expenseM = this.navParams.get("expenseM");
    console.log("expenseM :", expenseM);
    if (expenseM) {
      this.expenseData = expenseM;
    }

    this.expenseService.getProjectList().subscribe((resp) => {
      this.projectLists = resp;
      console.log("projectLists :", this.projectLists);
    });

  }

  private getExpenseTypeName(_expenseTypeCode: string): string {
    return this.expenseService.getExpenseTypeName(_expenseTypeCode);
  }

  private getImageType(expenseTypeCode: any): string {
    return this.expenseService.getExpenseImageTypeByCode(expenseTypeCode);
  }

  private attachFile(_expItmIdx: number) {
    if (this.appService.isServeChrome()) {
      let fileElem = document.getElementById('attachmentsInputId');
      console.log("fileElem :", fileElem);
      fileElem && fileElem.click();
    } else {
      // this.workforceService.requestPicture().then((file) => {
      //   if (!this._tmpExpenseItemList[_expItmIdx] || !this._tmpExpenseItemList[_expItmIdx].files) {
      //     this._tmpExpenseItemList[_expItmIdx].files = [];
      //   }
      //   this._tmpExpenseItemList[_expItmIdx].files.push(file);
      //   console.log("requestPicture :", file);
      // });
      this.workforceService.openFile().subscribe(resp => {
        if (!this._tmpExpenseItemList[_expItmIdx] || !this._tmpExpenseItemList[_expItmIdx].files) {
          this._tmpExpenseItemList[_expItmIdx].files = [];
        }
        console.log("openFile resp :", resp);
        const pathFile = this.workforceService.getFilePath(resp);
        console.log("pathFile :", pathFile);
        this.pictureService.getFileDirectory(pathFile).subscribe((resp) => {
          console.log("getFileDirectory :", resp);
          this._tmpExpenseItemList[_expItmIdx].files.push(resp);
        });
      });
    }
  }

  private showAddExpenseItem: boolean = false;
  @ViewChild("expenseItemSlides") private expenseItemSlides: Slides;

  private addExpenseItem() {
    this.expenseItemSlides && this.expenseItemSlides.slideTo((this.expenseItemSlides.length() - 1 || 0));
    console.log("this.expenseItemSlides :", this.expenseItemSlides);
    this.showAddExpenseItem = !this.showAddExpenseItem;
    this.isEdit = false;
  }

  private removeItemAttachFile(_fileItm: any, _expItmIdx: number, _fileIdx: number) {
    this._tmpExpenseItemList[_expItmIdx] && this._tmpExpenseItemList[_expItmIdx].files.splice(_fileIdx, 1);
  }

  private getAttachments(_expItmIdx: number, _expItmObjt) {
    let inputFileField = document.getElementById("attachmentsInputId");
    let filesList = [];
    if (inputFileField != null) {
      filesList = inputFileField['files'];
    }
    if (this._tmpExpenseItemList[_expItmIdx] && !this._tmpExpenseItemList[_expItmIdx].files) {
      this._tmpExpenseItemList[_expItmIdx].files = [];
    }
    for (let idx = 0; idx < filesList.length; idx++) {
      let fileObj = filesList[idx];
      this._tmpExpenseItemList[_expItmIdx].files.push(fileObj);
      console.warn('this._tmpExpenseItemList[_expItmIdx].fileObj:', fileObj);
    }
  }

  private cancelAddExpenseItemType() {
    this._tmpExpenseItemList = [{}];
    this.isEdit = false;
    this.showAddExpenseItem = false;
  }

  private errorIndx: number = -1;
  private validateExpenseItemListHasError(_validateExpItms: any[]): boolean {
    this.errorIndx = -1;
    let hasError = false;
    for (let index = 0; index < (_validateExpItms || []).length; index++) {
      const expItm = (_validateExpItms || [])[index];
      if (!expItm || !expItm.invoiceDate || !expItm.expenseTypeCode || !expItm.amount || expItm.amount == 0) {
        hasError = true;

        if (this.errorIndx == -1) { this.errorIndx = index; }
      }
    }
    return hasError;
  }

  private saveAddExpenseItemType(_tmpExpenseItemList: any) {
    const tmp_expense_item: any[] = _tmpExpenseItemList || [];
    console.log("tmp_expense_item :", tmp_expense_item);

    if (this.validateExpenseItemListHasError(tmp_expense_item)) {
      let alert = this.alertController.create({
        title: 'Warning',
        subTitle: 'Please verify your input.',
        buttons: ['Done']
      });
      alert.present().then(() => {
        this.errorIndx > -1 && this.expenseItemSlides && this.expenseItemSlides.slideTo(this.errorIndx);
      });
      return false;
    }

    if (this.isEdit) {
      console.log("Edit Item !!!!!");
      this.expenseData.expenseItemList = tmp_expense_item;
    } else {
      console.log("Add New !!!!!");
      this.expenseData.expenseItemList = [...(this.expenseData.expenseItemList || []), ...(tmp_expense_item)];
    }
    console.log("this.expenseData.expenseItemList :", this.expenseData.expenseItemList);
    this.expenseData.totalAmount = this.sumTotal(this.expenseData.expenseItemList);
    this.cancelAddExpenseItemType();
  }

  private showDateTimePicker(_expItmIdx: number, _field: any, _picker: string) {
    console.log("showDateTimePicker :", this._tmpExpenseItemList[_expItmIdx]);
    this.calendarDatePickerService.getDisplayDateTimePicker(this._tmpExpenseItemList[_expItmIdx][_field] || new Date(), _picker).subscribe((dateResult) => {
      this._tmpExpenseItemList[_expItmIdx][_field] = dateResult;
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

  private sumTotal(_arrItm: any[]): number {
    let totalAmt: number = 0;
    (_arrItm || []).forEach((expItm) => {
      if (expItm) {
        totalAmt += parseInt(expItm.amount || 0);
      }
    });
    return totalAmt;
  }

  private checkItem(_tmpExpenseItemList) {
    console.log('_tmpExpenseItemList : ', _tmpExpenseItemList);
    let checkErr = false;
    for (let i = 0; i < _tmpExpenseItemList.length; i++) {
      document.getElementById("expenseType" + i).classList.remove('red');
      document.getElementById("expenseWhen" + i).classList.remove('red');
      document.getElementById("expenseAmount" + i).classList.remove('red');

      if (!_tmpExpenseItemList[i].expenseTypeCode) {
        console.log(_tmpExpenseItemList[i].expenseTypeCode);
        document.getElementById("expenseType" + i).classList.add('red');
        checkErr = true;
      }
      if (!_tmpExpenseItemList[i].invoiceDate) {
        document.getElementById("expenseWhen" + i).classList.add('red');
        checkErr = true;
      }
      if (!_tmpExpenseItemList[i].amount) {
        document.getElementById("expenseAmount" + i).classList.add('red');
        checkErr = true;
      }
    }
    if (checkErr != true) {
      this.saveAddExpenseItemType(_tmpExpenseItemList);
    } else {
      let alert = this.alertController.create({
        title: 'Warning',
        subTitle: 'Please verify your input.',
        buttons: ['Done']
      });
      alert.present().then(() => {
        this.errorIndx > -1 && this.expenseItemSlides && this.expenseItemSlides.slideTo(this.errorIndx);
      });
    }
  }

  @ViewChild('projectName') private projectName: any;
  @ViewChild('expTypeItm') private expTypeItm: any;

  private saveModifyExpense() {
    alert("Need Service Expense Update !!!!");
  }
  private check() {
    console.log('projectName : ', this.projectName.text);
    console.log('expTypeItm : ', this.expenseData.expenseItemList);
    document.getElementById("projectName").classList.remove('red');
    document.getElementById("expenseItem").classList.remove('red');

    let checkErr = false;
    if (this.projectName.text == '') {
      document.getElementById("projectName").classList.add('red');
      checkErr = true;
    }
    if (this.expenseData.expenseItemList == null) {
      document.getElementById("expenseItem").classList.add('red');
      document.getElementById("expenseItem").classList.remove('detail-type');
      checkErr = true;
    } else {
      if (this.expenseData.expenseItemList.length == 0) {
        document.getElementById("expenseItem").classList.add('red');
        document.getElementById("expenseItem").classList.remove('detail-type');
        checkErr = true;
      }
    }

    if (checkErr != true) {
      this.createExpense();
      console.log('YES');
    } else {
      let alert = this.alertController.create({
        title: 'Warning',
        subTitle: 'Please verify your input.',
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  private numI = 0;
  private numItem(num) {
    this.numI = this.numI + num;
    return this.numI;
  }

  private createExpense() {
    this.appLoadingService.showLoading();
    console.log("this.expenseData :", this.expenseData);
    let _paramsData: ExpenseModel | any = new ExpenseModel();
    _paramsData.userId = this.wfHttpService.employeeCode;
    _paramsData.expenseRequestTopic = this.expenseData.reason || "";
    _paramsData.employeeCode = this.wfHttpService.employeeCode;
    _paramsData.projectId = this.expenseData.projectCode;
    _paramsData.reason = this.expenseData.reason; // "eeeeee",
    _paramsData.organizationId = AppConstant.ORGANIZE_CODE.ORG_WORKFORCE.id;

    let _expenseItemList = [];
    (this.expenseData.expenseItemList || []).forEach(element => {
      element.invoiceDate = moment(element.invoiceDate).format("YYYY-MM-DD");
      _expenseItemList.push(element);
    });
    _paramsData.listExpenseItem = _expenseItemList;

    _paramsData.totalAmount = this.sumTotal(_paramsData.listExpenseItem);//this.expenseData.totalAmount; //this.sumTotal(_paramsData.listExpenseItem);
    _paramsData.expenseGroupCode = "EXPENSE";// "EXPENSE",

    if (!_paramsData.totalAmount || (_paramsData.listExpenseItem || []).length == 0) {
      this.alertController.create({
        message: "Missing require field please verify.",
        buttons: ["Done"]
      }).present();
      this.appLoadingService.hideLoading();
      return;
    }

    this.expenseService.createExpense(_paramsData)
      .subscribe((resp) => {
        console.log("createExpense :", resp);
        if (resp) {
          this.appLoadingService.hideLoading().then(() => {
            this.appAlertService.successAlertPopup({ description: "Create expense completed" }).subscribe(() => {
              this.closeModal();
            });
          });
        }
      }, (errMsg) => {
        console.error("createExpense errMsg:", errMsg);
        this.appLoadingService.hideLoading().then(() => {
          this.appAlertService.errorAlertPopup({ description: "Create expense error : \"" + errMsg + "\"" }).subscribe(() => {

          });
        });
      });
  }

  private addExpenseItemMore() {
    this._tmpExpenseItemList = this._tmpExpenseItemList || [];
    this._tmpExpenseItemList.push({});

    console.log("slideLenght :", this.expenseItemSlides.length());
    setTimeout(() => {
      this.expenseItemSlides && this.expenseItemSlides.slideTo(this.expenseItemSlides.length());
    }, 200);
  }
  private isEdit: boolean = false;
  private goEditExpenseItem(editData: any, _editIndex: number) {
    this._tmpExpenseItemList = [...(this.expenseData.expenseItemList || [])];
    this.expenseItemSlides && this.expenseItemSlides.slideTo(_editIndex);
    this.showAddExpenseItem = !this.showAddExpenseItem;
    this.isEdit = true;
  }

  private closeModal() {
    this.viewCtrl && this.viewCtrl.dismiss().then(() => {
      this.appService.publish(AppConstant.EVENTS_SUBSCRIBE.EXPENSE_CREATE);
    });
  }

  private removeExpenseItm(index: number) {
    (this.expenseData.expenseItemList || []).splice(index, 1);
    this.expenseData.totalAmount = this.sumTotal(this.expenseData.expenseItemList);
  }

}
