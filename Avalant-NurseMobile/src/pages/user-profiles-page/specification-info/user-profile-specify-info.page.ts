import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NavController, NavParams, ViewController, NavOptions, AlertController } from 'ionic-angular';
import { UserProfileAttachmentInfoPage } from '../attached-file-info/user-profile-attachment-info.page';
import { UserModel } from '../../../model/user/user.model';
import { YBatUserMedicalQuestionModel } from '../../../model/user/ybat.user-medical-questions.model';
import { YBatUserMedicalAnswerInfoModel } from '../../../model/user/ybat.user-medical-info.model';
import { ObjectsUtil } from '../../../utilities/objects.util';
import { YBatMsMedicalChoiceModel } from '../../../model/user/ybat.ms-medical-choice.model';
import { StringUtil } from '../../../utilities/string.util';

@Component({
  selector: 'user-profile-specify-info-page',
  templateUrl: 'user-profile-specify-info.page.html',
  styleUrls: ['/user-profile-specify-info.page.scss'],
  styles: ['ion-col{position:initial}']
})
export class UserProfileSpecifyInfoPage implements OnInit, AfterViewInit {
  private businessUserM: UserModel;
  private medicalUserAnswerInfoList: YBatUserMedicalAnswerInfoModel[];//คำตอบของคำถามที่ User ได้ทำการตอบไว้
  private ybatMedicalQuestionList: YBatUserMedicalQuestionModel[];//คำถามที่ User ได้รับ

  private deletedItm_UserAnswerInfoList: YBatUserMedicalAnswerInfoModel[] = [];

  public healthProblem: any;
  public heartProblem: any;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
  ) { }

  public ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges. Add 'implements OnInit' to the class.
    this.businessUserM = this.navParams.data;
  }

  public ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only. Add 'implements AfterViewInit' to the class.
    let ybatUserInfoM = this.businessUserM.ybatUserInfoM;
    this.ybatMedicalQuestionList = ybatUserInfoM.ybatUserMedicalQuestionListModel;

    this.medicalUserAnswerInfoList = ybatUserInfoM.ybatUserMedicalAnswerInfoList;
    if (ObjectsUtil.isEmptyObject(this.medicalUserAnswerInfoList)) {
      this.medicalUserAnswerInfoList = [];
      ybatUserInfoM.ybatUserMedicalAnswerInfoList = [];
    }
    // console.log("this.ybatMedicalQuestionList:", this.ybatMedicalQuestionList);

    this.getDisplaySubQuestion();
  }

  private nexto2Attachment() {
    // console.log("All AnswerInfoList:", this.medicalUserAnswerInfoList);
    // console.log("All deletedItm Answer List:", this.deletedItm_UserAnswerInfoList);
    this.businessUserM.ybatUserInfoM["deletedItm_UserAnswerInfoList"] = this.deletedItm_UserAnswerInfoList;
    if (this.isErrorMedicalQuestionValidation() == false) {
      this.navCtrl.push(UserProfileAttachmentInfoPage, this.businessUserM);
    } else {
      this.alertCtrl.create({
        message: 'กรุณาระบุข้อมูลให้ครบถ้วน',
      }).present();
    }
  }

  private isErrorMedicalQuestionValidation(): boolean {
    let hasError = false;
    let hasAnwserQuest = this.medicalUserAnswerInfoList || [];
    let allAnwserQuestionCode = [];
    hasAnwserQuest && hasAnwserQuest.forEach(ansItm => {
      allAnwserQuestionCode.indexOf(ansItm.questionCode) == -1 && allAnwserQuestionCode.push(ansItm.questionCode);
      if (ansItm.answer == "99" && StringUtil.isEmptyString(ansItm.other)) {
        // console.log("missing anwser for (", ansItm.questionCode, ") :", ansItm.answer, ' other:', ansItm.other);
        hasError = true;
      }
    });
    // console.log("allAnwserQuestionCode:", allAnwserQuestionCode);

    let showedQuestion = this.ybatMedicalQuestionList && this.ybatMedicalQuestionList.filter(itm => itm.displayFlag == 'Y') || [];
    let allQuestionCode = [];
    showedQuestion && showedQuestion.forEach(questItm => {
      allQuestionCode.indexOf(questItm.questionCode) == -1 && allQuestionCode.push(questItm.questionCode);
      if (allAnwserQuestionCode.toString().indexOf(questItm.questionCode) == -1) {
        // console.log("missing anwser for (", questItm.questionCode, ") :", questItm.ybatMsMedicalQuestion && questItm.ybatMsMedicalQuestion.questionName);
        hasError = true;
      }
    });
    // console.log("allQuestionCode:", allQuestionCode);
    // console.log("hasError:", hasError);
    return hasError;
  }

  private isAnswerChecked(questionMItem: YBatUserMedicalQuestionModel, choiceItm: YBatMsMedicalChoiceModel, ): boolean {
    let existAnswerM = this.medicalUserAnswerInfoList.find(item => item.questionCode == questionMItem.questionCode && item.answer == choiceItm.choiceCode);
    return ObjectsUtil.isEmptyObject(existAnswerM) == false;
  }

  private clickAnswerRadio(questionMItem: YBatUserMedicalQuestionModel, choiceItm: YBatMsMedicalChoiceModel, ): void {
    // console.log("clickAnswerRadio:", questionMItem, choiceItm);
    let existAnswerM = this.medicalUserAnswerInfoList.find(item => item.questionCode == questionMItem.questionCode);

    if (ObjectsUtil.isEmptyObject(existAnswerM)) {
      let answerM: YBatUserMedicalAnswerInfoModel = new YBatUserMedicalAnswerInfoModel;
      answerM.userInfoId = this.businessUserM.ybatUserInfoM.userInfoId;
      answerM.questionCode = questionMItem.questionCode;
      answerM.answer = choiceItm.choiceCode;
      answerM.other = null;
      this.medicalUserAnswerInfoList.push(answerM);
    } else {
      existAnswerM.answer = choiceItm.choiceCode;
    }
    this.getDisplaySubQuestion();
  }

  private otherAnswer = "";
  private inputAnswerOther(questionMItem: YBatUserMedicalQuestionModel, choiceItm: YBatMsMedicalChoiceModel, otherAnswer: string) {
    // console.log("inputAnswerOther questionMItem:", questionMItem);
    let existAnswerM = this.medicalUserAnswerInfoList.find(item => item.questionCode == questionMItem.questionCode && item.answer == choiceItm.choiceCode);
    if (ObjectsUtil.isEmptyObject(existAnswerM)) {
      let answerM: YBatUserMedicalAnswerInfoModel = new YBatUserMedicalAnswerInfoModel;
      answerM.userInfoId = this.businessUserM.ybatUserInfoM.userInfoId;
      answerM.questionCode = questionMItem.questionCode;
      answerM.answer = choiceItm.choiceCode;
      answerM.other = otherAnswer;
      this.medicalUserAnswerInfoList.push(answerM);
    } else {
      existAnswerM.other = otherAnswer;
    }
  }

  private clickAnswerCheckbox(questionMItem: YBatUserMedicalQuestionModel, choiceItm: YBatMsMedicalChoiceModel, ) {
    // console.log("clickAnswerCheckbox:", questionMItem, choiceItm);
    let existAnswerM = this.medicalUserAnswerInfoList.find(item => item.questionCode == questionMItem.questionCode && item.answer == choiceItm.choiceCode);
    let existAnswerIndex = this.medicalUserAnswerInfoList.findIndex(item => item.questionCode == questionMItem.questionCode && item.answer == choiceItm.choiceCode);
    if (ObjectsUtil.isEmptyObject(existAnswerM)) {
      let answerM: YBatUserMedicalAnswerInfoModel = new YBatUserMedicalAnswerInfoModel;
      answerM.userInfoId = this.businessUserM.ybatUserInfoM.userInfoId;
      answerM.questionCode = questionMItem.questionCode;
      answerM.answer = choiceItm.choiceCode;
      answerM.other = null;
      this.medicalUserAnswerInfoList.push(answerM);
    } else {
      this.deletedItm_UserAnswerInfoList.push(existAnswerM);
      this.medicalUserAnswerInfoList.splice(existAnswerIndex, 1);
    }
    this.getDisplaySubQuestion();
  }

  private getDisplaySubQuestion(): void {
    // console.log("%cthis.medicalUserAnswerInforList:", 'color:blue;fonst-size:1.5em', this.medicalUserAnswerInfoList);
    this.ybatMedicalQuestionList.forEach(questItm => {
      this.medicalUserAnswerInfoList.forEach(anwserItm => {
        if (!StringUtil.isEmptyString(questItm.requireRefQuestion) && !StringUtil.isEmptyString(questItm.requireRefValue)) {
          if (questItm.requireRefQuestion == anwserItm.questionCode) {
            let matchRequired = questItm.requireRefValue == anwserItm.answer;
            questItm.displayFlag = matchRequired ? 'Y' : 'N';
          }
        }
        if (anwserItm.answer == '99') {
          this.otherAnswer = anwserItm.other;
        }
      });
    });

  }
  private backBtn() {
    this.navCtrl.canGoBack() && this.navCtrl.pop();
  }
  private isRadioType(questionMItem: any): boolean {
    return !ObjectsUtil.isEmptyObject(questionMItem) && !ObjectsUtil.isEmptyObject(questionMItem.ybatMsMedicalQuestion) && questionMItem.ybatMsMedicalQuestion.questionType == 'radio';
  }
  private isCheckboxType(questionMItem: any): boolean {
    return !ObjectsUtil.isEmptyObject(questionMItem) && !ObjectsUtil.isEmptyObject(questionMItem.ybatMsMedicalQuestion) && questionMItem.ybatMsMedicalQuestion.questionType == 'checkbox';
  }

}