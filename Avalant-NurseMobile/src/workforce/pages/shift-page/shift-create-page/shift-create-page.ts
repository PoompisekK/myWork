import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalOptions, ModalController } from 'ionic-angular';
import * as moment from 'moment';
import { CalendarDatePickerService } from '../../../../services/calendar-date-picker-service/calendar-date-picker-service';
import { AppServices } from '../../../../services/app-services';
import { ApproveRejectModalPage } from '../../approve-tabs-page/approve-reject-modal/approve-reject-modal';
import { TranslationService } from 'angular-l10n';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { AppConstant } from '../../../../constants/app-constant';
import { HCMEAFRestService } from '../../../../services/eaf-rest/hcm-eaf-rest.service';
import { HCMShiftRestService } from '../../../../services/userprofile/hcm-shift.service';
import { AnimateCss } from '../../../../animations/animate-store';

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
        private translationService: TranslationService,
        private viewCtrl: ViewController,
        private shiftService: HCMShiftRestService,
        private appService: AppServices,
    ) {
        this.appService.subscribe(AppConstant.EVENTS_SUBSCRIBE.SHIFT_CREATE, () => {
            this.viewCtrl && this.viewCtrl.dismiss();
        });
    }

    public ngOnInit() {
        this.getSelectTean();
        this.getMyTeam();
        this.getWorkShift();
        this.isDevice = !this.appServices.isServeChrome();
        this.shiftType = this.navParams.get("shiftType");
        console.log('shift type : ', this.shiftType);
        if (this.shiftType == 'shift') {
            this.titelHead = this.translationService.translate('M_SHIFTCREATE.SHIFT_REQUEST');//'Shift Request';
        } else {
            this.titelHead = this.translationService.translate('M_SHIFTCREATE.SHIFT_SWAP_REQUEST'); //'Shift Swap Request'
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
    private rejectThisTask(_taskItemDetail: any, _type) {
        const modalOpt: ModalOptions = {};
        modalOpt.cssClass = "reject-modal";
        modalOpt.enableBackdropDismiss = false;
        modalOpt.showBackdrop = false;

        const approveRejectModal = this.modalCtrl.create(ApproveRejectModalPage, {
            select: _type
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
            dataSelectTeam.forEach(element => {
                this.selectTeamGroup.push(element);
            });
            console.log('selectTeamGroup : ', this.selectTeamGroup);
        });
    }
    private getMyTeam() {
        this.shiftService.getTeamGroup().subscribe(dataTeam => {
            this.myTeamGroupObj = dataTeam;
            dataTeam.forEach(element => {
                this.myTeamGroup = element.teamGroupname;
            });
            console.log('dataTeamGroup : ', this.myTeamGroupObj);
            console.log('myTeamGroup : ', this.myTeamGroup)
        });
    }

    private listWorkShift = [];
    private getWorkShift() {
        this.shiftService.getNotWorkShift().subscribe(data => {
            console.log('work shift', data);
            data.forEach(element => {
                this.listWorkShift.push(element);
            });
            this.isLoading = false;
        });
    }
    private myShift = [];
    private isSomeShift: any;
    private selectShift() {
        console.log('this.dateTimeShift : ', this.dateTimeShift);
        const dataShift = this.listWorkShift.filter(mItm => mItm.asDate == this.dateTimeShift);
        this.myShift = dataShift;
        console.log('dataShift : ', this.myShift);
    }
    private loadShift(_sumeShift) {        
        console.log(_sumeShift);
    }

    private createModel = {
        shiftWork: '',
        requestTowork: '',
        requestDate: '',
        shiftId: '',
        note: ''
    };
    private testcreate() {
        this.createModel.shiftWork = this.myTeamGroup;
        this.createModel.requestDate = moment(new Date()).format('YYYY-MM-DD');
        console.log('create data : ',this.createModel);
    }
}
