import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ModalOptions, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import * as moment from 'moment';
import { AppState } from '../../../../app/app.state';
import { AppConstant } from '../../../../constants/app-constant';
import { AppServices } from '../../../../services/app-services';
import { CalendarDatePickerService } from '../../../../services/calendar-date-picker-service/calendar-date-picker-service';
import { HCMEAFRestService } from '../../../../services/eaf-rest/hcm-eaf-rest.service';
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
    private swapShift: string;
    private myCurrentShift: string;
    private swapWithShift: string;
    private noteCreate: string;
    private workingShift: any[];
    private vSwapWithList: any[];
    private swapShiftEmp: any[];
    private selectDayOff: string;
    private swapDayType = 'S';
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
        private hcmEAFRestService: HCMEAFRestService,
        private appState: AppState,
        private hcmShiftRestService: HCMShiftRestService,
        private alertCtrl: AlertController
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
            console.log('My Team Group : ', this.myTeamGroup);
            this.getMyPositionId();
        });
    }
    private myTeamGroup: any;
    private dayOff: any[];
   
    public loadingWorkingShift() {
        // ------ Do Action ------
        // this.hcmMicroFlowService.getSwapWith("TGN0000000228").subscribe((resp) => {
        //     console.log("getSwapWith :", resp);
        //     const vSwapWithList = resp && resp.responseObjectsMap && resp.responseObjectsMap.v_swap_with_list;
        //     if (vSwapWithList) {
        //         this.vSwapWithList = vSwapWithList;
        //         console.log("vSwapWithList:", vSwapWithList);
        //     }
        // });        
        console.log(this.dateShiftSwap);
        if (this.swapDayType == 'D') {
            const loadWorkShift = {
                WORK_LOAD_DATE: moment(this.dateShiftSwap).format("DD/MM/YYYY"),
                TEAM_GROUP_NO: this.myTeamGroup.teamGroupNo,
            };
            console.log("loadWorkShift :", loadWorkShift);
            this.shiftService.getWorkingShift(loadWorkShift).subscribe((resp) => {
                this.vSwapWithList = resp;
                console.log("getWorkingShift :", this.vSwapWithList);
            });
            this.getEmployeeDayOff();
        } else if (this.swapDayType == 'S') {
            this.getTragetShift();
            this.getTragetShiftByDate(moment(this.dateShiftSwap).format("YYYY-MM-DD"));
        }
    }

    private getEmployeeDayOff() {
        this.shiftService.getDayOff().subscribe(data => {
            console.log('Day Off : ', data);
            this.dayOff = data;
        });
    }
    private loadSwapWith() {
        const loadWorkShift = {
            WORK_LOAD_DATE: moment(this.dateShiftSwap).format("DD/MM/YYYY"),
            TEAM_GROUP_NO: this.myTeamGroup.teamGroupNo,
            SHIFT_NAME_CODE: this.myCurrentShift
        };
        console.log("loadWorkShift :", loadWorkShift);
        this.shiftService.getWorkingShift(loadWorkShift).subscribe((resp) => {
            this.vSwapWithList = resp;
            console.log("getWorkingShift :", this.vSwapWithList);
        });
    }

    private dateTimeShift: any;
    private dateShiftSwap: any;
    private showDateTimePicker(_displayType: string) {
        let currSelected: Date = new Date();
        this.calendarDatePickerService.getDisplayDateTimePicker(currSelected, _displayType).subscribe((dateResult) => {
            if (this.shiftType == 'shift') {
                this.dateTimeShift = dateResult.toISOString();
                this.loadingWorkingShift && this.loadingWorkingShift();
            } else if (this.shiftType == 'shiftSwap') {
                this.dateShiftSwap = dateResult.toISOString();
                this.loadingWorkingShift && this.loadingWorkingShift();
            }
            console.log('Date : ', dateResult.toISOString());
        });
    }
    private modelCreateSwapShift = {
        EMPLOYEE_SWAP_TRANSACTION: {
            AS_DATE: "", //
            EMPLOYEE_CODE: "", // >>>
            ORGANIZE_ID: "", // >>>
            POSITION_BOX_CODE: "", //
            REASON: "", //
            REQUEST_BY: "", // 
            REQUEST_DATE: "", //
            SHIFT_NAME_CODE: "", //
            STATUS: "Waiting For Accept",
            SWAP_DATE: "", //
            SWAP_EMPLOYEE_CODE: "", //
            SWAP_POSITION_BOX_CODE: "", //
            SWAP_SHIFT_NAME_CODE: "", //
            SWAP_TYPE: ""
        }
    };

    private myPosition: any;
    private shiftPosition: any;
    private getMyPositionId() {
        this.shiftService.getPositionBoxCode({ EMPLOYEE_CODE: this.myTeamGroup.employeeCode }).subscribe(data => {
            console.log("model my position box code :", data);
            data.forEach(element => {
                this.myPosition = element;
            });
        });
    }
    private submitCreateSwapShift() {
        this.shiftService.getPositionBoxCode({ EMPLOYEE_CODE: this.swapWithShift }).subscribe(data => {
            console.log("model position box code :", data);
            data.forEach(element => {
                this.shiftPosition = element;
            });

            this.modelCreateSwapShift.EMPLOYEE_SWAP_TRANSACTION.AS_DATE = this.selectDayOff || moment(new Date()).format('YYYY-MM-DD');
            this.modelCreateSwapShift.EMPLOYEE_SWAP_TRANSACTION.POSITION_BOX_CODE = this.myPosition.positionBoxCode;
            this.modelCreateSwapShift.EMPLOYEE_SWAP_TRANSACTION.REASON = this.noteCreate;
            this.modelCreateSwapShift.EMPLOYEE_SWAP_TRANSACTION.REQUEST_BY = this.myPosition.positionBoxCode;
            this.modelCreateSwapShift.EMPLOYEE_SWAP_TRANSACTION.REQUEST_DATE = moment(new Date()).format('YYYY-MM-DD');
            this.modelCreateSwapShift.EMPLOYEE_SWAP_TRANSACTION.SWAP_DATE = moment(this.dateShiftSwap).format('YYYY-MM-DD');
            this.modelCreateSwapShift.EMPLOYEE_SWAP_TRANSACTION.SWAP_EMPLOYEE_CODE = this.swapWithShift;
            this.modelCreateSwapShift.EMPLOYEE_SWAP_TRANSACTION.SWAP_POSITION_BOX_CODE = this.shiftPosition.positionBoxCode;
            this.modelCreateSwapShift.EMPLOYEE_SWAP_TRANSACTION.SWAP_TYPE = this.swapDayType;
            if (this.swapDayType == 'S') {
                this.modelCreateSwapShift.EMPLOYEE_SWAP_TRANSACTION.SHIFT_NAME_CODE = this.myCurrentShift;
                this.modelCreateSwapShift.EMPLOYEE_SWAP_TRANSACTION.SWAP_SHIFT_NAME_CODE = this.swapShift;
            } else if (this.swapDayType == 'D') {
                this.modelCreateSwapShift.EMPLOYEE_SWAP_TRANSACTION.SHIFT_NAME_CODE = "";
                this.modelCreateSwapShift.EMPLOYEE_SWAP_TRANSACTION.SWAP_SHIFT_NAME_CODE = "";
            }

            console.log('Model Create : ', this.modelCreateSwapShift);
            this.rejectThisTask(this.modelCreateSwapShift, 'create', 'createShiftSwap');
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

    //------------------------------------------------
    private getTragetShift() {
        this.hcmShiftRestService.getTragetShift().subscribe(data => {
            console.log('data traget shift : ', data);
            let checkArray = data instanceof Array;
            if (checkArray == true) {
                this.swapShiftEmp = data;
            } else {
                this.swapShiftEmp.push(data);
            }

        });
    }
    private getTragetShiftByDate(_date) {
        this.hcmShiftRestService.getTragetShift({ WORK_LOAD_DATE: _date }).subscribe(data => {
            console.log('data traget shift by date : ', data);
            let checkArray = data instanceof Array;
            if (checkArray == true) {
                this.workingShift = data;
            } else {
                this.workingShift.push(data);
            }
        });
    }

    private checkCreate() {
        let checkError = false;
        document.getElementById("currentDate").classList.remove('red_col');
        document.getElementById("swapWith").classList.remove('red_col');
        if (this.dateShiftSwap == null) {
            document.getElementById("currentDate").classList.add('red_col');
            checkError = true;
        }
        if (this.swapWithShift == null) {
            document.getElementById("swapWith").classList.add('red_col');
            checkError = true;
        }
        if (this.swapDayType == 'S') {
            document.getElementById("currentShift").classList.remove('red_col');
            document.getElementById("swapShift").classList.remove('red_col');
            if (this.myCurrentShift == null) {
                document.getElementById("currentShift").classList.add('red_col');
                checkError = true;
            }
            if (this.swapShift == null) {
                document.getElementById("swapShift").classList.add('red_col');
                checkError = true;
            }
        } else if (this.swapDayType == 'D') {
            document.getElementById("dateType").classList.remove('red_col');
            if (this.selectDayOff == null) {
                document.getElementById("dateType").classList.add('red_col');
                checkError = true;
            }
        }
        if (checkError == false) {
            this.submitCreateSwapShift();
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
