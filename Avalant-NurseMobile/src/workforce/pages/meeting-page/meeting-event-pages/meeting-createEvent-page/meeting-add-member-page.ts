import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';

import { AnimateCss } from '../../../../../animations/animate-store';
import { AppState } from '../../../../../app/app.state';
import { AppConstant } from '../../../../../constants/app-constant';
import { StringUtil } from '../../../../../utilities/string.util';
import { MeetingService } from '../../../../service/meetingService';

@Component({
  selector: 'meeting-add-member-page',
  templateUrl: 'meeting-add-member-page.html',
  animations: [
    AnimateCss.peek()
  ]
})
export class MeetingAddMemberPage {
  private selectedData: any[] = [];
  private employeeList: any[] = [];
  private displayEmployeeList: any[] = [];
  private inputSearch: Subject<string> = new Subject();
  private callback: (data: any) => any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public meettingService: MeetingService,
    public appState: AppState,
  ) {

  }
  private isLoading: boolean = true;
  private ionViewDidEnter() {
    this.callback = this.navParams.get("callback");
    this.selectedData = this.navParams.get("selectedData") || [];
    this.getAllEmployeeMember();
    this.inputSearch.debounceTime(AppConstant.APP_DEBOUNCE_SEARCH_TIME).subscribe((searchText) => {
      if (!StringUtil.isEmptyString(searchText) && (searchText || "").length >= 3) {
        this.displayEmployeeList = this.employeeList.filter((itm) => {
          let text = JSON.stringify(itm).toLowerCase();
          return text.indexOf((searchText || '').toLowerCase()) > -1;
        });

        console.log("search result length :", this.displayEmployeeList.length);
      } else {
        this.displayEmployeeList = this.employeeList;
      }
    });
  }
  private getAllEmployeeMember() {
    this.meettingService.getAllEmployee("").subscribe((resp: any[]) => {
      (resp || []).sort((item1, item2) => {
        let text1 = ((item1 || {}).name || '').toLowerCase();
        let text2 = ((item2 || {}).name || '').toLowerCase();
        if (text1 > text2) {
          return 1;
        } else if (text1 == text2) {
          return 0;
        } else if (text1 < text2) {
          return -1;
        }
      });
      //string[];
      (resp || []).map(item => {
        (this.selectedData || []).forEach((_empCode) => {
          if (item.employeeCode == _empCode) {
            item.isCheck = true;
          }
        });
      });

      let _resp = [];
      for (let eIdx = 0; eIdx < (resp || []).length; eIdx++) {
        const element = (resp || [])[eIdx];
        if (element.employeeCode != this.appState.employeeCode) {
          _resp.push(element);
        }
      }
      resp = _resp;

      setTimeout(() => {
        this.employeeList = resp;
        this.displayEmployeeList = resp;
        console.log("getAllEmployee:", resp);

        this.isLoading = false;
      }, 750);
    });
  }
  private selectEmployee(_emp: any) {
    console.log("click selectEmployee :", _emp);
    (this.employeeList || []).forEach((itm) => {
      if (_emp.employeeCode === itm.employeeCode) {
        _emp.isCheck = !_emp.isCheck;
      }     
    });
  }
  private selectMember() {
    let selectedList = (this.employeeList || []).filter(itm => itm.isCheck == true);
    console.log("selectedList:", selectedList);
    let selectedEmpCodeList = (selectedList || []).map(empItm => empItm.employeeCode);
    console.log("selectedEmpCodeList:", selectedEmpCodeList);
    if (this.callback) {
      this.callback(selectedEmpCodeList).then(() => {
        this.goBack();
      });
    } else {
      console.warn("this.callback :", this.callback);
      this.goBack();
    }
  }
  private goBack() {
    this.navCtrl.canGoBack && this.navCtrl.pop();
  }
}
