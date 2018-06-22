import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Content, NavController, Slides } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppState } from '../../../../app/app.state';
import { AssessmentSummaryPage } from '../assessment-summary/assessment-summary.page';
import { PatientParamsData } from '../patients-acuity-evaluation.page';

@Component({
    selector: 'patients-questions',
    templateUrl: 'patients-questions.page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class PatientsQuestionsPage implements OnInit {
    private patientParamsData: PatientParamsData;
    private getJSONQuestionService(cb: (data) => void) {
        this.http.get("./assets/json/questions.json")
            .map(resp => resp.json())
            .subscribe(resp => {
                console.log("question resp:", resp);
                cb && cb(resp.question || []);
            });
    }

    @ViewChild(Content) private content: Content;
    private questions: QuestionM[] = [];
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public appState: AppState,
        public http: Http,
    ) {

    }
    private isLoading: boolean = true;
    public ngOnInit() {
        this.patientParamsData = this.navParams.data;
        console.log("this.patientParamsData :", this.patientParamsData);
        this.getJSONQuestionService((resp) => {
            this.questions = resp;
            this.isLoading = false;
        });
    }

    public ionViewDidEnter() {
        setTimeout(() => {
            this.slideDidChange();
        }, 550);
    }

    @ViewChild(Slides) private slides: Slides;
    private slidesActiveIndex: number = 0;
    private slidesHeight: number = 0;
    private slidesMoving: boolean = true;
    private slideDidChange() {
        this.slidesMoving = false;
        let slideIndex: number = this.slides.getActiveIndex();
        if (slideIndex < this.questions.length) {
            let currentSlide: Element = this.slides._slides[slideIndex];
            this.slidesHeight = currentSlide.clientHeight;
            this.slidesActiveIndex = slideIndex;
            console.log("slidesActiveIndex :", this.slidesActiveIndex);
            this.content.scrollToTop();
        }
    }

    private slideStep(stepIndx: number) {
        if (stepIndx == -1) {
            this.slides.slidePrev();
        } else if (stepIndx == 1) {
            this.slides.slideNext();
        } else if (stepIndx == 0) {
            this.validateSubmitQuestion();
        } else {
            console.log("slideStep :", stepIndx);
        }
    }

    private slideWillChange() {
        this.slidesMoving = true;
    }

    private validateSubmitQuestion() {
        console.log("validateSubmitQuestion ");
        this.patientParamsData.inspectQuestion = [];
        this.navCtrl.push(AssessmentSummaryPage, this.patientParamsData, { animate: true, direction: "forward" });
    }
}
class ChoiceQuestions {
    public choiceName: string;
    public choiceValue?: string | number;
}
class QuestionM {
    public topic: string;
    public choices: ChoiceQuestions[] = [];
}