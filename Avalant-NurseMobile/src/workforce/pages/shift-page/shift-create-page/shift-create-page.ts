import * as moment from 'moment';
import { AnimateCss } from '../../../../animations/animate-store';
import { AppConstant } from '../../../../constants/app-constant';
import { ApproveRejectModalPage } from '../../approve-tabs-page/approve-reject-modal/approve-reject-modal';
import { AppServices } from '../../../../services/app-services';
import { CalendarDatePickerService } from '../../../../services/calendar-date-picker-service/calendar-date-picker-service';
import { Component, OnInit } from '@angular/core';
import { HCMShiftRestService } from '../../../../services/userprofile/hcm-shift.service';
import { HCMTranslationService } from '../../../modules/hcm-translation.service';
import {
    ModalController,
    ModalOptions,
    NavController,
    NavParams
} from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { HCMUserProfileRestService } from '../../../../services/userprofile/hcm-userprofile.service';
import { AppState } from '../../../../app/app.state';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@Component({
    selector: 'shift-create-page',
    templateUrl: 'shift-create-page.html',
    animations: [
        AnimateCss.peek()
    ]
})
export class ShiftCreatePage implements OnInit {

    private isDevice: boolean = false;
    private shiftType: string;
    private titelHead: string;
    private teamGroupObj: any;
    private teamGroupDesc: string;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private calendarDatePickerService: CalendarDatePickerService,
        private appServices: AppServices,
        private modalCtrl: ModalController,
        private hcmTranslationService: HCMTranslationService,
        private viewCtrl: ViewController,
        private shiftService: HCMShiftRestService,
        private appService: AppServices,
        private hcmUserProfileService: HCMUserProfileRestService,
        private appState: AppState,
        private alertCtrl: AlertController
    ) {
        this.appService.subscribe(AppConstant.EVENTS_SUBSCRIBE.SHIFT_CREATE, () => {
            this.viewCtrl && this.viewCtrl.dismiss();
        });
    }

    public ngOnInit() {
        this.getMyTeam();
        this.getPositionId();
        this.isDevice = !this.appServices.isServeChrome();
        this.shiftType = this.navParams.get("shiftType");
        console.log('shift type : ', this.shiftType);
        if (this.shiftType == 'shift') {
            this.titelHead = this.hcmTranslationService.translate('M_SHIFTCREATE.SHIFT_REQUEST', 'Shift Request');//'Shift Request';
        } else {
            this.titelHead = this.hcmTranslationService.translate('M_SHIFTCREATE.SHIFT_SWAP_REQUEST', 'Shift Swap Request'); //'Shift Swap Request'
        }

    }

    private dateTimeShift: any;
    private dateShiftSwap: any;
    private showDateTimePicker(_displayType: string) {
        let currSelected: Date = new Date();
        this.calendarDatePickerService.getDisplayDateTimePicker(currSelected, _displayType).subscribe((dateResult) => {
            if (this.shiftType == 'shift') {
                this.dateTimeShift = dateResult.toISOString();
                this.getWorkShift(this.dateTimeShift);
            } else if (this.shiftType == 'shiftSwap') {
                this.dateShiftSwap = dateResult.toISOString();
                this.getWorkShift(this.dateTimeShift);
            }
            console.log('Date : ', dateResult.toISOString());
        });
    }
    private rejectThisTask(_dataCreate: any, _type, _typeCreate) {
        const modalOpt: ModalOptions = {};
        modalOpt.cssClass = "reject-modal";
        modalOpt.enableBackdropDismiss = false;
        modalOpt.showBackdrop = false;

        const approveRejectModal = this.modalCtrl.create(ApproveRejectModalPage, {
            select: _type,
            dataCreate: _dataCreate,
            typeCreate: _typeCreate
        }, modalOpt);
        approveRejectModal.present();
    }

    // ---------- create -----------
    private isLoading = true;
    private modelTest = {
        nameTeam: '',
        idTeam: ''
    };
    private myTeamGroup: string;
    private myTeamGroupObj: any;
    private selectTeamGroup = [];
    private getSelectTean() {
        this.shiftService.getSelectTeam().subscribe(dataSelectTeam => {
            this.isLoading = false;
            dataSelectTeam.forEach(element => {
                this.selectTeamGroup.push(element);
            });
            console.log('selectTeamGroup : ', this.selectTeamGroup);
        });
    }
    private getMyTeam() {
        this.shiftService.getTeamGroup().subscribe(dataTeam => {
            dataTeam.forEach(element => {
                this.myTeamGroup = element.teamGroupname;
                this.myTeamGroupObj = element;
            });
            console.log('dataTeamGroup : ', this.myTeamGroupObj);
            console.log('myTeamGroup : ', this.myTeamGroup);
            this.getSelectTean();
        });
    }

    private listWorkShift = [];
    private getWorkShift(_date) {
        this.createModel.shiftId = '';
        this.listWorkShift = [];
        let date = moment(_date).format('DD/MM/YYYY');
        this.shiftService.getNotWorkShift(date).subscribe(data => {
            console.log('work shift', data);
            data.forEach(element => {
                this.listWorkShift.push(element);
            });
        });
    }

    private createModel = {
        shiftMyWork: '',
        requestTowork: '',
        requestDate: '',
        shiftId: '',
        note: '',
        dateStartShift: ''
    };

    private commitCreateShift() {
        this.modelCreateShift.EMPLOYEE_SHIFT_REQUEST.TEAM_GROUP_NO = this.myTeamGroupObj.teamGroupNo;
        this.modelCreateShift.EMPLOYEE_SHIFT_REQUEST.REQUEST_DATE = moment(new Date()).format('YYYY-MM-DD');
        this.modelCreateShift.EMPLOYEE_SHIFT_REQUEST.REQUEST_SHIFT_DATE = this.dateTimeShift;
        this.modelCreateShift.EMPLOYEE_SHIFT_REQUEST.REASON = this.createModel.note;
        this.modelCreateShift.EMPLOYEE_SHIFT_REQUEST.REQUEST_TEAM_GROUP_NO = this.createModel.requestTowork;
        this.modelCreateShift.EMPLOYEE_SHIFT_REQUEST.REQUEST_SHIFT_NAME_CODE = this.createModel.shiftId;
        this.modelCreateShift.EMPLOYEE_SHIFT_REQUEST.POSITION_BOX_CODE = this.dataPositionBoxCode.positionBoxCode;
        let shiftRequestType = this.selectTeamGroup.find(data => data.teamGroupNo == this.createModel.requestTowork);
        this.modelCreateShift.EMPLOYEE_SHIFT_REQUEST.SHIFT_REQ_TYPE = shiftRequestType.teamGroupType;
        this.modelCreateShift.EMPLOYEE_SHIFT_REQUEST.EMPLOYEE_CODE = this.appState.businessUser.employeeCode;

        console.log('DATA CREATE : ', this.modelCreateShift);
        this.rejectThisTask(this.modelCreateShift, 'create', 'createShift');
    }

    private modelCreateShift = {
        EMPLOYEE_SHIFT_REQUEST: {
            EMPLOYEE_CODE: "",
            ORGANIZE_ID: "",
            UPDATE_BY: "",
            POSITION_BOX_CODE: "",
            REASON: "",
            REQUEST_DATE: "",
            REQUEST_SHIFT_DATE: "",
            REQUEST_SHIFT_NAME_CODE: "",
            REQUEST_TEAM_GROUP_NO: "",
            SHIFT_REQ_TYPE: "",
            TEAM_GROUP_NO: "",
            STATUS: "Waiting For Approval"
        }
    };
    private dataPositionBoxCode: any;
    private getPositionId() {
        this.shiftService.getPositionBoxCode().subscribe(data => {
            console.log("model position box code :", data);
            data.forEach(element => {
                this.dataPositionBoxCode = element;
            });
        });
    }

    private checkCreate() {
        let isError = false;
        document.getElementById("requestWorkIn").classList.remove('red');
        document.getElementById("effectiveDate").classList.remove('red');
        document.getElementById("shift").classList.remove('red');
        if (!this.createModel.requestTowork) {
            document.getElementById("requestWorkIn").classList.add('red');
            isError = true;
        }
        if (!this.dateTimeShift) {
            document.getElementById("effectiveDate").classList.add('red');
            isError = true;
        }
        if (!this.createModel.shiftId) {
            document.getElementById("shift").classList.add('red');
            isError = true;
        }

        if (isError == false) {
            this.commitCreateShift();
        } else {
            const alert = this.alertCtrl.create({
                title: 'ERROR',
                subTitle: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                buttons: ['OK']
              });
              alert.present();
        }

    }

}
