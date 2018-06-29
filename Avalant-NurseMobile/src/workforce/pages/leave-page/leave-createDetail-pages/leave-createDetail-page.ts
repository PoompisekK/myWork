import { Component, OnInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { Events, NavController, NavParams, ViewController, ModalOptions, ModalController } from 'ionic-angular';
import { ImageViewerController as ImageViewerCtrl } from 'ionic-img-viewer';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

import { AnimateCss } from '../../../../animations/animate-store';
import { AppConstant } from '../../../../constants/app-constant';
import { AppLoadingService } from '../../../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../../../services/app-services';
import { CalendarDatePickerService } from '../../../../services/calendar-date-picker-service/calendar-date-picker-service';
import { PictureService } from '../../../../services/picture-service/picture.service';
import { StringUtil } from '../../../../utilities/string.util';
import { ContsVariables } from '../../../global/contsVariables';
import { LeaveModel, LeaveTypeModel, RequestLeaveModel } from '../../../model/leave.model';
import { AppAlertService } from '../../../service/appAlertService';
import { AssignmentService } from '../../../service/assignmentService';
import { LeaveService } from '../../../service/leaveService';
import { WorkforceService } from '../../../service/workforceService';
import {
    MeetingAddMemberPage,
} from '../../meeting-page/meeting-event-pages/meeting-createEvent-page/meeting-add-member-page';
import { AlertController } from 'ionic-angular';
import { HCMFileUploaType } from '../../../service/workforceHttpService';
import { isDev } from '../../../../constants/environment';
import { ApproveRejectModalPage } from '../../approve-tabs-page/approve-reject-modal/approve-reject-modal';
import { LeavePage } from '../leave-page';

@Component({
    selector: 'leave-createDetail-page',
    templateUrl: 'leave-createDetail-page.html',
    animations: [
        AnimateCss.peek(),
    ]
})
export class LeaveCreateDetailPage implements OnInit {

    private leaveSubTypes: LeaveTypeModel[] = [];
    private seletedSubLeave: LeaveTypeModel;
    private leaveDataM: LeaveModel = new LeaveModel;

    private listFiles: any[] = [];

    private searchInput: string;
    private recommendOfficerList: any[] = [];//display list
    private selectedRecommendOfficerList: any[] = [];
    private inputSearch: Subject<string> = new Subject();

    private searchNotifyInput: string;
    private acknowledgeList: any[] = [];//display list
    private calbackAddAcknowledgeUser = (_params): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.acknowledgeList = _params;
            resolve();
        });
    }
    private calbackAddRecommendOfficerUser = (_params): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.recommendOfficerList = _params;
            resolve();
        });
    }

    // private selectedAcknowledgeList: any[] = [];
    // private totalAbsence: number = 0;
    public leaveHalfDay = {
        checkBox: {
            fromDate: "M",
            toDate: "A",
        },
        result: {
            fromDate: null,
            toDate: null,
        }
    };

    private isSomeShift: string = 'N';
    private isDevice: boolean = false;

    private notiPerson: string;
    private fullDay: string;
    private date = new Date();
    private leaveDetail: string;

    constructor(
        private appAlertService: AppAlertService,
        private appLoadingService: AppLoadingService,
        private appService: AppServices,
        private assignmentService: AssignmentService,
        private calendarDatePickerService: CalendarDatePickerService,
        private events: Events,
        private imageViewerCtrl: ImageViewerCtrl,
        private leaveService: LeaveService,
        private navCtrl: NavController,
        private navParams: NavParams,
        private pictureService: PictureService,
        private viewCtrl: ViewController,
        private workforceService: WorkforceService,
        private renderer: Renderer,
        private alertCtrl: AlertController,
        private modalCtrl: ModalController,
    ) {
        this.isDevice = !this.appService.isServeChrome();
        console.log('date : ', this.date);
    }

    private LEAVE_TYPE = ContsVariables.leaveConst.leaveType;

    private LEAVETYPE_CODE_OTHER: string = this.LEAVE_TYPE.other.othersLeave.code;// "LEAVE_OTHER";
    private LEAVETYPE_NAME_OTHER: string = this.LEAVE_TYPE.other.othersLeave.nameEn;//"ลาอื่นๆ";

    public ngOnInit() {

        this.getDelegateUserList();
        console.log("this.getDelegateUserList OUT!!!");
        this.leaveService.getLeaveType().subscribe((res) => {
            console.log("getLeaveType res:", res);
            for (let index = 0; index < res.length; index++) {
                let element = res[index];
                this.leaveSubTypes.push(element);
            }

            this.getDelegateUserList();
            this.leaveService.getLeaveType().subscribe((respLeaveSubTypes) => {
                console.log("respLeaveSubTypes:", respLeaveSubTypes);
                this.leaveSubTypes = respLeaveSubTypes;
            });

            let getNotSelectedEmployeeList = (messageInput: string, _selectedList: any[], callback: (data) => void) => {
                this.assignmentService.getAllEmployee(messageInput).subscribe((res) => {
                    console.log("res SHOW!!!!!!!!!!!!: ", res);
                    let tmp = [];
                    res && res.forEach(resultItem => {
                        let isExistObject = (_selectedList || []).find(selectedItm => selectedItm.employeeCode == resultItem.employeeCode);
                        if (isExistObject == null) {
                            tmp.push(resultItem);
                        }
                    });
                    callback(tmp);
                });
            };

            this.inputSearch.debounceTime(AppConstant.APP_DEBOUNCE_SEARCH_TIME).subscribe((messageInput) => {
                if (!StringUtil.isEmptyString(messageInput)) {
                    getNotSelectedEmployeeList(messageInput, this.selectedRecommendOfficerList, (respData) => {
                        this.recommendOfficerList = respData;
                        console.log("recommendOfficerList:", this.recommendOfficerList);
                    });
                } else {
                    this.recommendOfficerList = [];
                }
            });
        });

    }

    private onBlurField(_selectKey: string) {
        setTimeout(() => {
            if (_selectKey === this.KEY_RECCOMMED_OFFICER) {
                this.recommendOfficerList = [];
            } else if (_selectKey === this.KEY_ACKNOWLEDGE) {
                this.acknowledgeList = [];
            }
        }, 750);
    }
    private statusCheck: string;
    private KEY_RECCOMMED_OFFICER: string = 'reccommed-officer';
    private KEY_ACKNOWLEDGE: string = 'acknowledge';
    private checkStatus(value: string) {
        this.statusCheck = value;
    }
    private addUser(_selectKey: string) {
        let params = null;
        if (this.KEY_ACKNOWLEDGE == _selectKey) {
            params = {
                selectedData: this.acknowledgeList,
                callback: this.calbackAddAcknowledgeUser
            };
        } else if (this.KEY_RECCOMMED_OFFICER == _selectKey) {
            params = {
                selectedData: this.recommendOfficerList,
                callback: this.calbackAddRecommendOfficerUser
            };
        }
        if (params) {
            this.navCtrl.push(MeetingAddMemberPage, params, {
                animate: true, direction: "forward"
            });
        }
    }

    // private selectUser(_selectKey: string, _employeeItm: any) {
    //   console.log("selectUser : ", _selectKey, _employeeItm);
    //   if (_selectKey === this.KEY_RECCOMMED_OFFICER) {
    //     this.selectedRecommendOfficerList.push(_employeeItm);
    //     this.recommendOfficerList = [];
    //     this.searchInput = null;
    //   } else if (_selectKey === this.KEY_ACKNOWLEDGE) {
    //     this.selectedAcknowledgeList.push(_employeeItm);
    //     this.acknowledgeList = [];
    //     this.searchNotifyInput = null;
    //   }
    // }

    // private removeSelectUser(_selectKey: string, _indx: number, _employeeItm: any) {
    //   if (_selectKey === this.KEY_RECCOMMED_OFFICER) {
    //     this.selectedRecommendOfficerList.splice(_indx, 1);
    //   } else if (_selectKey === this.KEY_ACKNOWLEDGE) {
    //     this.selectedAcknowledgeList.splice(_indx, 1);
    //   }
    // }

    private blankDelegateUser = { empCode: null, empName: "Not select" };
    private delegateUsersList: { empCode: string, empName: string }[] = [this.blankDelegateUser];
    private getDelegateUserList() {
        this.leaveService.getDelegateEmployee().subscribe((resp: any) => {
            console.log("getDelegateEmployee:", resp);
            this.delegateUsersList = [];
            this.delegateUsersList.push(this.blankDelegateUser);
            this.delegateUsersList.push(...resp);
        });
    }

    private showDateTimePicker(_pickerType: string, _fieldModel: string) {
        let currSelected: Date = this.leaveDataM[_fieldModel];

        // this.calendarDatePickerService.getDisplayDateTimePicker(currSelected, _pickerType).subscribe((dateResult) => {
        //   this.dataDate[_fieldModel] = dateResult.toISOString();
        //   console.log('Date : ', dateResult.toISOString());
        // });

        console.log("leaveDataM[" + _fieldModel + "]:", currSelected);
        const constLimitTime = this.timeShiftLimit[_fieldModel];
        console.log("timeShiftLimit:", constLimitTime);
        let limitDate = null;
        if (constLimitTime) {
            limitDate = {
                min: constLimitTime.start,
                max: constLimitTime.end
            };
        }
        this.retry(_fieldModel, currSelected, _pickerType, limitDate);
    }

    private retry(_fieldModel, currSelected, _pickerType, limitDate) {
        this.calendarDatePickerService.getDisplayDateTimePicker(currSelected, _pickerType, limitDate)
            .subscribe((dateResult) => {
                this.setDateTime(_fieldModel, dateResult, (errorCallbackMsg) => {
                    this.appAlertService.warningAlertPopup({ description: errorCallbackMsg }).subscribe(() => {
                        this.retry(_fieldModel, currSelected, _pickerType, limitDate);
                    });
                });
            });
    }

    private validateTimeShift(_field: string, _inputTimeValue: Date): boolean {
        const startTime = this.timeShiftLimit[_field].start;
        const endTime = this.timeShiftLimit[_field].end;
        if (_field == "fromTime") {
            return _inputTimeValue >= startTime && _inputTimeValue < endTime;
        } else if (_field == "toTime") {
            return _inputTimeValue > startTime && _inputTimeValue <= endTime;
        } else {
            return false;
        }
    }

    private setDateTime(_fieldModel: string, pickedResultDateTime: Date, errorCallback?: (error) => void) {
        if (_fieldModel == "fromDate" || _fieldModel == "toDate") {
            let dateFormatted = moment(pickedResultDateTime).format("YYYY-MM-DD");
            console.log("pickedResultDateTime dateFormatted :", dateFormatted);
            this.leaveDataM[_fieldModel] = dateFormatted;
            if (_fieldModel == "fromDate" && pickedResultDateTime > new Date(this.leaveDataM.toDate)) {
                this.leaveDataM.toDate = moment(pickedResultDateTime).format("YYYY-MM-DD");
            } else if (_fieldModel == "toDate" && pickedResultDateTime < new Date(this.leaveDataM.fromDate)) {
                this.leaveDataM.fromDate = moment(pickedResultDateTime).format("YYYY-MM-DD");
            }
        } else if (_fieldModel == "fromTime" || _fieldModel == "toTime") {
            console.log("pickedResultDateTime timeFormatted :", moment(pickedResultDateTime).format("HH:mm:ss"));
            if (this.validateTimeShift(_fieldModel, pickedResultDateTime)) {
                this.leaveDataM[_fieldModel] = pickedResultDateTime;
            } else {
                console.error("Invalid input: time that's input is incorrect !!!!");
                // throw new Error("Invalid input: time that's input is incorrect !!!!");
                errorCallback && errorCallback("Invalid input: time that's input is incorrect !!!!");
            }
        } else {
            console.warn("missing _fieldModel:[" + _fieldModel + "] result :", pickedResultDateTime);
        }
        // this.calAbsenceTotal(_fieldModel);
    }

    private getImgKey(indx: number, _strKey: string): string {
        return indx >= 3 ? this.LEAVETYPE_CODE_OTHER : _strKey;
    }

    private removeItem(itmInput: any, index: number) {
        this.leaveAttachFile.splice(index, 1);
    }

    private getEmployeeCodeList(_arrInput: any[]): string[] {
        console.log("_arrInput:", _arrInput);
        let arrCode = [];
        _arrInput && _arrInput.forEach(item => {
            if (item.employeeCode) {
                arrCode.push(item.employeeCode);
            }
        });
        return arrCode;
    }
    @ViewChild('leaveType') private leaveType: any;
    @ViewChild('shiftNameCode') private shiftNameCode: any;
    @ViewChild('fromTime') private fromTime: any;
    @ViewChild('toTime') private toTime: any;
    @ViewChild('notice') private notice: any;
    // @ViewChild('urgentRequest') private urgentRequest: any;
    private genShift = false;
    private check() {
        // console.log('urgentRequest : ', this.urgentRequest);
        // if (this.urgentRequest._text == '') {
        //   this.urgentRequest.value = 'N';
        // }
        this.genShift = false;
        document.getElementById("leaveType").classList.remove('red');
        document.getElementById("notice").classList.remove('red');
        let isErroe = false;
        if (this.leaveType.text == '') {
            document.getElementById("leaveType").classList.add('red');
            isErroe = true;
        }
        if (this.notice._value == '') {
            document.getElementById("notice").classList.add('red');
            isErroe = true;
        }
        if (this.isSomeShift == 'N') {
            document.getElementById("fromDate").classList.remove('red');
            document.getElementById("toDate").classList.remove('red');
            if (this.leaveDataM.fromDate == null) {
                document.getElementById("fromDate").classList.add('red');
                isErroe = true;
            }
            if (this.leaveDataM.toDate == null) {
                document.getElementById("toDate").classList.add('red');
                isErroe = true;
            }
        } else if (this.isSomeShift == 'Y') {
            document.getElementById("fromDateY").classList.remove('red');
            document.getElementById("toDateY").classList.remove('red');
            if (this.leaveDataM.fromDate == null) {
                document.getElementById("fromDateY").classList.add('red');
                isErroe = true;
            }
            if (this.leaveDataM.toDate == null) {
                document.getElementById("toDateY").classList.add('red');
                isErroe = true;
            } else {
                console.log('shiftNameCode : ', this.shiftNameCode.checked);
                if (this.shiftNameCode.checked == true) {
                    document.getElementById("fromTime").classList.remove('red');
                    document.getElementById("toTime").classList.remove('red');
                    console.log('this.fromTime', this.fromTime._text);
                    console.log('this.toTime', this.toTime._text);
                    if (this.fromTime._text == '') {
                        document.getElementById("fromTime").classList.add('red');
                        isErroe = true;
                    }
                    if (this.toTime._text == '') {
                        document.getElementById("toTime").classList.add('red');
                        isErroe = true;
                    }
                } else {
                    this.genShift = true;
                }
            }
        }
        if (isErroe == false) {
            console.log('Create Leave');
            this.createLeave();
        } else {
            let alert = this.alertCtrl.create({
                title: 'Warning',
                subTitle: 'Please verify your input.',
                buttons: ['Ok']
            });
            alert.present();
        }
    }
    private dataDate = {
        fromDate: Date,
        toDate: Date,
        fromTime: Date,
        toTime: Date
    };

    private createLeave() {
        this.appLoadingService.showLoading();
        let leaveReqM: any = this.leaveDataM;
        leaveReqM = Object.assign(leaveReqM, new RequestLeaveModel());
        leaveReqM.recordDate = moment(new Date()).format("YYYY-MM-DD");
        if (leaveReqM.leaveType == this.LEAVETYPE_NAME_OTHER) {
            leaveReqM.leaveType = this.seletedSubLeave.leaveTypeName;
            leaveReqM.leaveCode = this.seletedSubLeave.leaveTypeCode;
        }
        console.log("leaveReqM.leaveType:", leaveReqM.leaveType);
        console.log("leaveReqM.leaveTypeCode:", leaveReqM.leaveTypeCode);
        console.log("less :", (leaveReqM.leaveType || leaveReqM.leaveTypeCode));
        console.log("more :", (leaveReqM.leaveType != null ? leaveReqM.leaveType : leaveReqM.leaveTypeCode));
        leaveReqM.leaveType = leaveReqM.leaveType != null ? leaveReqM.leaveType : leaveReqM.leaveTypeCode;
        console.log("leaveReqM.leaveType:", leaveReqM.leaveType);
        if (leaveReqM.employeeCodeRequest == "Not select" || !leaveReqM.employeeCodeRequest) {
            leaveReqM.employeeCodeRequest = leaveReqM.employeeCode;
        }
        leaveReqM.fromDate = moment(leaveReqM.fromDate).format("YYYY-MM-DD");
        leaveReqM.fullDay = "Y";
        if (this.isSomeShift && this.isSomeShift == 'Y') {
            leaveReqM.toDate = leaveReqM.fromDate;
            leaveReqM.fullDay = "N";
        } else {
            leaveReqM.toDate = moment(leaveReqM.toDate).format("YYYY-MM-DD");
        }

        leaveReqM.recommendOfficers = this.getEmployeeCodeList(this.selectedRecommendOfficerList);
        leaveReqM.acknowledge = this.getEmployeeCodeList(this.acknowledgeList);
        leaveReqM.fromDateHalf = this.leaveHalfDay.result.fromDate;
        leaveReqM.toDateHalf = this.leaveHalfDay.result.toDate;

        function dateToTimeString(_date: Date): string {
            if (_date instanceof Date) {
                return moment(_date).format("HH:mm:ss");
            } else if (typeof _date === 'string') {
                return _date;
            }
        }

        leaveReqM.fromTime = dateToTimeString(leaveReqM.fromTime);
        leaveReqM.toTime = dateToTimeString(leaveReqM.toTime);
        console.log("Create Leave Params :", leaveReqM);

        this.postCreateLeaveRequest(leaveReqM);
    }

    private displayLeaveType(_leaveType: string): string {
        return ((_leaveType || "").replace(/leave/gi, "") || "").trim();
    }

    private postCreateLeaveRequest(leaveReqM: RequestLeaveModel): void {
        this.uploadAttachment(this.leaveAttachFile, (resp) => {
            console.log("uploadAttachment resp:", resp);
            leaveReqM.listAttachmentFile = resp;
            this.leaveService.postCreateLeave(leaveReqM).subscribe((resp: any) => {
                console.log("postCreateLeave:", resp);
                this.appLoadingService.hideLoading();
                if (resp || resp.errorMessage || resp.processMessage || resp.message) {
                    let msgStr = resp.errorMessage || resp.processMessage || resp.message || resp;

                    this.appAlertService.successAlertPopup({ description: msgStr })
                        .subscribe(() => {
                            this.closeModal();
                        });
                }
            }, (err) => {
                this.appLoadingService.hideLoading();
                console.error("postCreateLeave err:", err);
                this.appAlertService.errorAlertPopup({ description: err })
                    .subscribe(() => { });
            });
        });
    }

    private uploadAttachment(attactment: any[], cb?: (resp) => void) {
        attactment = (attactment || []);
        this.assignmentService.hcmUploadFile(attactment, HCMFileUploaType.LEAVE).subscribe(resp => {
            console.log("postXMLHttpRequestFileUpload :", resp);
            cb && cb(resp);
        });
    }


    private leaveAttachFile: any[] = [];

    private closeModal() {
        this.viewCtrl && this.viewCtrl.dismiss().then(() => {
            this.appService.publish(AppConstant.EVENTS_SUBSCRIBE.LEAVE_CREATE);
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

    private attachFile(leave: LeaveModel) {
        if (this.appService.isServeChrome()) {
            let fileElem = document.getElementById('attachmentsInputId');
            console.log("fileElem :", fileElem);
            fileElem && fileElem.click();
        } else {
            this.workforceService.openFile().subscribe(resp => {
                console.log("openFileChooser resp :", resp);
                const pathFile = this.workforceService.getFilePath(resp);
                isDev() && console.log("pathFile :", pathFile);
                this.pictureService.getFileDirectory(pathFile).subscribe((resp) => {
                    console.log("getFileDirectory :", resp);
                    this.leaveAttachFile.push(resp);
                });
            }, (error) => {
                console.error("openFileChooser error :", error);
            });
        }
    }

    private showImageView(fileObject: any): void {
        console.log("showImageView :", fileObject);
        if (fileObject) {
            this.pictureService.convertFileToDataURi(fileObject, (dataImgBase64: string) => {
                console.log("convertFileToDataURi :", dataImgBase64);
                const imageViewer = this.imageViewerCtrl.create(this.pictureService.dataURItoBlob(dataImgBase64));
                imageViewer.present();
            }, (error) => {
                console.error("error convertFileToDataURi :", error);
            });
        }
    }

    private getFileName(_inputURiFileName: any): string {
        let respName = "";
        if (_inputURiFileName) {
            let _inFileName = (_inputURiFileName.name || '').toString() || _inputURiFileName.filename || '';
            let arrFileName = (_inFileName && _inFileName.split("\/")) || [];
            return (arrFileName && arrFileName.length >= 0) ? (arrFileName[arrFileName.length - 1] || '').toString() : "";
        } else {
            return respName;
        }
    }

    private getAttachments() {
        let inputFileField = document.getElementById("attachmentsInputId");
        let filesList = [];
        if (inputFileField != null) {
            filesList = inputFileField['files'];
        }
        for (let idx = 0; idx < filesList.length; idx++) {
            let fileObj = filesList[idx];
            this.leaveAttachFile.push(fileObj);
            console.warn('fileObj:', fileObj);
        }
    }
    private availableShiftList: any[] = [];
    private loadShift(_isShift: string): void {
        console.log("loadShift :", _isShift);
        this.availableShiftList = [];
        // this.leaveDataM.shiftNameCode = null;
        this.leaveDataM.shiftNameCode = " ";
        if (_isShift == 'Y' && this.leaveDataM.fromDate) {
            const shiftDate = moment(this.leaveDataM.fromDate || new Date()).format("YYYY-MM-DD");
            this.leaveService.getLeaveShiftPeriod(shiftDate).subscribe((resp) => {
                console.log("getLeaveShiftPeriod :", resp);
                let shiftTime1 = (resp || []).filter(itm => 'SNC0000000081'.equals(itm.shiftNameCode));
                let shiftTime2 = (resp || []).filter(itm => 'SNC0000000082'.equals(itm.shiftNameCode));
                let shiftTime3 = (resp || []).filter(itm => 'SNC0000000083'.equals(itm.shiftNameCode));

                console.log("shiftTime1: ", shiftTime1[0]);

                this.availableShiftList = [shiftTime1[0], shiftTime2[0], shiftTime3[0]];

                this.leaveDataM["fromTime"] = null;
                this.leaveDataM["toTime"] = null;
            });
            this.leaveDataM.toDate = null;
        } else {
            this.leaveDataM.fromDate = null;
            this.leaveDataM.toDate = null;
            this.leaveDataM["fromTime"] = null;
            this.leaveDataM["toTime"] = null;
        }
    }
    private getTime(_time: string): Date {
        const currTmpDate = moment().format("YYYY-MM-DD");
        return moment(currTmpDate + 'T' + _time).toDate();
    }

    private timeShiftLimit = {
        fromTime: { start: null, end: null, hourValues: [], minuteValues: [] },
        toTime: { start: null, end: null, hourValues: [], minuteValues: [] },
    };

    private loadTimeShift(_shiftCode: string): void {
        function getNumberRang(_start: number, _end: number): number[] {
            let rang = [];
            for (let i = (_start || 0); i <= (_end || 24); i++) {
                rang.push(i);
            }
            return rang;
        }

        console.log(" loadTimeShift :", _shiftCode);
        const selectedShiftItm = this.availableShiftList.find((shiftItm: LeaveModel) => shiftItm.shiftNameCode === _shiftCode);
        console.log(" selectedShiftItm :", selectedShiftItm);
        if (selectedShiftItm) {
            const workInTime = this.getTime(selectedShiftItm.workIn);
            const workOutTime = this.getTime(selectedShiftItm.workOut);

            this.timeShiftLimit.fromTime.hourValues = getNumberRang(workInTime.getHours(), workOutTime.getHours() - 1);
            this.timeShiftLimit.fromTime.start = workInTime;
            this.timeShiftLimit.fromTime.end = workOutTime;

            this.timeShiftLimit.toTime.hourValues = getNumberRang(workInTime.getHours(), workOutTime.getHours());
            this.timeShiftLimit.toTime.start = workInTime;
            this.timeShiftLimit.toTime.end = workOutTime;
            console.log("timeShiftLimit:", this.timeShiftLimit);
        }
    }
    private rejectThisTask(_taskItemDetail: any, _type) {
        console.log("Button Click!!!!!!!!!!!!!!!!!!!!");
        // this.check();
        const modalOpt: ModalOptions = {};
        modalOpt.cssClass = "reject-modal";
        modalOpt.enableBackdropDismiss = false;
        modalOpt.showBackdrop = false;

        const approveRejectModal = this.modalCtrl.create(ApproveRejectModalPage, {
            select: _type,
            createDetail: _taskItemDetail,            
            onClickSubmit: () => {
                console.log("onClickSubmit !!!!!!!!!!!!!");
                this.navCtrl.pop();
                approveRejectModal.dismiss();
            }, onClickCancel: () => {
                console.log("onClickCancel !!!!!!!!!!!!!");
            }
        }, modalOpt);
        console.log("createDetail Data: " + _taskItemDetail);
        approveRejectModal.present();
        // this.navCtrl.pop();
    }
    // private calAbsenceTotal(leaveDate: string) {
    //   let leaveReqM = this.leaveDataM;
    //   if (this.leaveHalfDay.checkBox.fromDate && leaveDate == 'fromDate') {
    //     this.leaveHalfDay.result.fromDate = this.leaveHalfDay.checkBox.fromDate;
    //   }
    //   if (this.leaveHalfDay.checkBox.toDate && leaveDate == 'toDate') {
    //     this.leaveHalfDay.result.toDate = this.leaveHalfDay.checkBox.toDate;
    //   }
    //   if (leaveReqM.fromDate && leaveReqM.toDate) {
    //     leaveReqM.fromDate = moment(leaveReqM.fromDate).format("YYYY-MM-DD");
    //     leaveReqM.toDate = moment(leaveReqM.toDate).format("YYYY-MM-DD");
    //     this.leaveService.getCalLeaveDay(leaveReqM, this.leaveHalfDay.result.fromDate, this.leaveHalfDay.result.toDate).subscribe((res) => {
    //       this.totalAbsence = res;
    //     });
    //   }
    // }
}