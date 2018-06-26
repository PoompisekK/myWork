import { Component, OnInit } from '@angular/core';
import { ModalController, ModalOptions, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import * as moment from 'moment';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppConstant } from '../../../../constants/app-constant';
import { AppServices } from '../../../../services/app-services';
import { CalendarDatePickerService } from '../../../../services/calendar-date-picker-service/calendar-date-picker-service';
import { HCMShiftRestService } from '../../../../services/userprofile/hcm-shift.service';
import { HCMTranslationService } from '../../../modules/hcm-translation.service';
import { ApproveRejectModalPage } from '../../approve-tabs-page/approve-reject-modal/approve-reject-modal';

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
    ) {
        this.appService.subscribe(AppConstant.EVENTS_SUBSCRIBE.SHIFT_CREATE, () => {
            this.viewCtrl && this.viewCtrl.dismiss();
        });
    }

    public ngOnInit() {
        this.getMyTeam();
        this.isDevice = !this.appServices.isServeChrome();
        this.shiftType = this.navParams.get("shiftType");
        console.log('shift type : ', this.shiftType);
        if (this.shiftType == 'shift') {
            this.titelHead = this.hcmTranslationService.translate('M_SHIFTCREATE.SHIFT_REQUEST','Shift Request');//'Shift Request';
        } else {
            this.titelHead = this.hcmTranslationService.translate('M_SHIFTCREATE.SHIFT_SWAP_REQUEST','Shift Swap Request'); //'Shift Swap Request'
        }

        this.shiftService.getTeamGroup().subscribe(resp => {
            this.teamGroupObj = resp;
            this.teamGroupDesc = this.teamGroupObj && this.teamGroupObj.teamGroupname;
            console.log("teamGroupObj:", this.teamGroupObj);
            console.log("teamGroupDesc:", this.teamGroupDesc);
        });
    }

    private dateTimeShift: any;
    private dateShiftSwap: any;
    private showDateTimePicker(_displayType: string) {
        let currSelected: Date = new Date();
        this.calendarDatePickerService.getDisplayDateTimePicker(currSelected, _displayType).subscribe((dateResult) => {
            if (this.shiftType == 'shift') {
                this.dateTimeShift = dateResult.toISOString();
            } else if (this.shiftType == 'shiftSwap') {
                this.dateShiftSwap = dateResult.toISOString();
            }
            console.log('Date : ', dateResult.toISOString());
        });
    }
    private rejectThisTask(_dataCreate: any, _type) {
        const modalOpt: ModalOptions = {};
        modalOpt.cssClass = "reject-modal";
        modalOpt.enableBackdropDismiss = false;
        modalOpt.showBackdrop = false;

        const approveRejectModal = this.modalCtrl.create(ApproveRejectModalPage, {
            select: _type,
            dataCreate: _dataCreate
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
    private testcreate() {
        this.createModel.shiftMyWork = this.myTeamGroupObj.teamGroupNo;
        this.createModel.requestDate = moment(new Date()).format('YYYY-MM-DD');
        this.createModel.dateStartShift = this.dateTimeShift;
        console.log('create data : ', this.createModel);
        this.rejectThisTask(this.createModel, 'create');
        this.createShift();
    }

    private testModelCreate = {
        EMPLOYEE_CODE: "549407",
        UPDATE_BY: "กาญจนลักษณ์ แถวโสภา",
        POSITION_BOX_CODE: "PB51-EMP549407",
        REASON: "test create on bomile",
        REQUEST_DATE: "2018-06-24",
        REQUEST_SHIFT_DATE: "2018-06-24",
        REQUEST_SHIFT_NAME_CODE: "SNC0000000082",
        REQUEST_TEAM_GROUP_NO: "TGN0000000251",
        SHIFT_REQ_TYPE: "TGT0000000001",
        TEAM_GROUP_NO: "TGN0000000228"
    };
    private createShift() {
        this.shiftService.saveShift(this.testModelCreate).subscribe(data => {
            console.log('return from create : ', data);
        });
    }
}
