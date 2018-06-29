import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, ModalOptions } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import * as moment from 'moment';

import { AppConstant } from '../../../../constants/app-constant';
import { AppServices } from '../../../../services/app-services';
import { CalendarDatePickerService } from '../../../../services/calendar-date-picker-service/calendar-date-picker-service';
import { HCMMicroFlowService } from '../../../../services/userprofile/hcm-microflow.service';
import { HCMShiftRestService } from '../../../../services/userprofile/hcm-shift.service';
import { HCMTranslationService } from '../../../modules/hcm-translation.service';
import { ApproveRejectModalPage } from '../../approve-tabs-page/approve-reject-modal/approve-reject-modal';

@Component({
    selector: 'shift-swap-create-page',
    templateUrl: 'shift-swap-create-page.html'
})
export class ShiftSwapCreatePage implements OnInit {

    private isDevice: boolean = false;
    private shiftType: string;
    private titelHead: string;
    private workingShift: any[];
    private vSwapWithList: any[];
    private swapDayType = 'daySame';
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private calendarDatePickerService: CalendarDatePickerService,
        private appServices: AppServices,
        private modalCtrl: ModalController,
        private hcmTranslationService: HCMTranslationService,
        private viewCtrl: ViewController,
        private shiftService: HCMShiftRestService,
        private hcmMicroFlowService: HCMMicroFlowService,
        private appService: AppServices,
    ) {
        this.appService.subscribe(AppConstant.EVENTS_SUBSCRIBE.SHIFT_CREATE, () => {
            this.viewCtrl && this.viewCtrl.dismiss();
        });
    }

    public ngOnInit() {
        this.isDevice = !this.appServices.isServeChrome();
        this.shiftType = this.navParams.get("shiftType");
        console.log('shift type : ', this.shiftType);
        if (this.shiftType == 'shift') {
            this.titelHead = this.hcmTranslationService.translate('M_SHIFTCREATE.SHIFT_REQUEST', 'Shift Request');//'Shift Request';
        } else {
            this.titelHead = this.hcmTranslationService.translate('M_SHIFTCREATE.SHIFT_SWAP_REQUEST', 'Shift Swap Request'); //'Shift Swap Request'
        }
        this.shiftService.getTeamGroup().subscribe(dataTeam => {            
            dataTeam.forEach(element => {
                this.myTeamGroup = element;
            });
            console.log('My Team Group : ',this.myTeamGroup);
        });

    }    
    private myTeamGroup: any;

    public loadingWorkingShift() {
        const loadWorkShift = { WORK_LOAD_DATE: moment(this.dateShiftSwap).format("DD/MM/YYYY") };
        console.log("loadWorkShift :", loadWorkShift);
        this.shiftService.getWorkingShift(loadWorkShift).subscribe((resp) => {
            this.workingShift = resp;
            console.log("getWorkingShift :", this.workingShift);
        });
        this.hcmMicroFlowService.getSwapWith("TGN0000000228").subscribe((resp) => {
            console.log("getSwapWith :", resp);
            const vSwapWithList = resp && resp.responseObjectsMap && resp.responseObjectsMap.v_swap_with_list;
            if (vSwapWithList) {
                this.vSwapWithList = vSwapWithList;
                console.log("vSwapWithList:", vSwapWithList);
            }
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

    private submitCreateSwapShift() {
        // const modalOpt: ModalOptions = {};
        // modalOpt.cssClass = "reject-modal";
        // modalOpt.enableBackdropDismiss = false;
        // modalOpt.showBackdrop = false;
        // const approveRejectModal = this.modalCtrl.create(ApproveRejectModalPage, {
        //     select: _type
        // }, modalOpt);
        // approveRejectModal.present();
        this.rejectThisTask({}, 'create', 'createShiftSwap');
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
}
