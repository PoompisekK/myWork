import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController, NavController, Slides } from 'ionic-angular';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

import { AnimateCss } from '../../../animations/animate-store';
import { AppConstant } from '../../../constants/app-constant';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { AppServices } from '../../../services/app-services';
import { ContsVariables } from '../../global/contsVariables';
import { LeaveModel, LeaveSummaryInfo } from '../../model/leave.model';
import { ObjectGroupDataM } from '../../service/assignmentService';
import { LeaveService } from '../../service/leaveService';
import { WorkforceService } from '../../service/workforceService';
import { EventsCalendarPage } from '../events-calendar/events-calendar-comp';
import { LeaveDetailPage } from './leave-detail-pages/leave-detail-page';
import { LeaveCreateDetailPage } from './leave-createDetail-pages/leave-createDetail-page';

@Component({
	selector: 'leave-page',
	templateUrl: 'leave-page.html',
	animations: [
		AnimateCss.peek()
	]
})
export class LeavePage implements OnInit {

	private leaveSummary = {
		sick: { remain: 0, used: 0, total: 0, percentage: "0%" },
		business: { remain: 0, used: 0, total: 0, percentage: "0%" },
		vacation: { remain: 0, used: 0, total: 0, percentage: "0%" },
		other: { remain: 0, used: 0, total: 0, percentage: "0%" }
	};

	private leaveSummaryYear: { sick: number, annual: number, personal: number } = { sick: 0, annual: 0, personal: 0 };

	private inputSearch: Subject<string> = new Subject();
	public results: any;
	constructor(
		private appLoadingService: AppLoadingService,
		private appServices: AppServices,
		private leaveService: LeaveService,
		private loadingCtrl: LoadingController,
		private modalController: ModalController,
		private navCtrl: NavController,
		private workforceService: WorkforceService,
	) {
		this.appServices.subscribe(this.subscribeEventsName, () => {
			this.getSummaryLeave();
		});
		this.Sick = 'select';
	}
	private subscribeEventsName: string = AppConstant.EVENTS_SUBSCRIBE.LEAVE_CREATE;
	public ionViewWillLeave() {
		this.appServices.unsubscribe(this.subscribeEventsName);
	}

	private LEAVE_TYPE = ContsVariables.leaveConst.leaveType;
	private sickLeaveCodeEn = this.LEAVE_TYPE.sick.code;
	private businessLeaveCodeEn = this.LEAVE_TYPE.business.code;
	private vacationLeaveCodeEn = this.LEAVE_TYPE.vacation.code;
	private othersLeaveCodeEn = this.LEAVE_TYPE.other.othersLeave.code;


	private shiftType: any = "sick";
	private Annual: string;
	private Personal: string;
	private Sick: string;
	private Other: string;
	private sSwap: any[] = [];
	private shift: any[] = [];

	private selectType(_shift) {
		console.log(" selectType :", _shift);
		if (_shift == 'sick') {
			this.shiftType = 'sick';
			this.Sick = 'select';
			this.Annual = '';
			this.Personal = '';
			this.Other = '';
		} else if (_shift == 'personal') {
			this.shiftType = 'personal';
			this.Sick = '';
			this.Annual = '';
			this.Personal = 'select';
			this.Other = '';
		} else if (_shift == 'annual') {
			this.shiftType = 'annual';
			this.Sick = '';
			this.Annual = 'select';
			this.Personal = '';
			this.Other = '';
		} else {
			this.shiftType = 'other';
			this.Sick = '';
			this.Annual = '';
			this.Personal = '';
			this.Other = 'select';
		}

		this.isLoading = true;
		this.slideChange(0, () => {
			console.log("slideChange loaded");
		});
	}

	private lowerCaseCompare(str1: string, str2: string, isUsedIndex?: boolean) {
		str1 = (str1 || '').toLowerCase();
		str2 = (str2 || '').toLowerCase();
		return ((isUsedIndex && ((str1 || '').indexOf(str2) > -1)) || str1 === str2);
	}

	private getStatus(objItm: any, index: number): boolean {
		if (index == 1) {
			return this.lowerCaseCompare(objItm.status, 'approved');
		} else if (index == 2) {
			return this.lowerCaseCompare(objItm.status, 'waiting for approve', true);
		} else if (index == 3) {
			return this.lowerCaseCompare(objItm.status, 'rejected');
		} else {
			return false;
		}
	}

	private isLeaveType(_typeName: string, index: number): boolean {
		if (index == 1 && _typeName === this.sickLeaveCodeEn) {
			return true;
		} else if (index == 2 && _typeName === this.businessLeaveCodeEn) {
			return true;
		} else if (index == 3 && _typeName === this.vacationLeaveCodeEn) {
			return true;
		} else if (index == 4 && (_typeName != this.sickLeaveCodeEn && _typeName != this.businessLeaveCodeEn && _typeName != this.vacationLeaveCodeEn)) {
			return true;
		} else {
			return false;
		}
	}

	private isLoading: boolean = true;
	private doRefresh(refresher) {
		// refresher
		this.appLoadingService.showLoading();
		this.getSummaryLeave(() => {
			refresher.complete();
		});
	}

	private leavesCollapsedGroup: any[] = [];
	private leaves: any[] = [];

	private leavesDataOfSearch: any[];
	private leavesData: any[] = [];

	public ngOnInit() {
		this.inputSearch.debounceTime(AppConstant.APP_DEBOUNCE_SEARCH_TIME).subscribe((messageInput) => {
			if (messageInput && messageInput.length > 0) {
				if (!this.leavesDataOfSearch) {
					this.leavesDataOfSearch = [];
					this.leavesDataOfSearch.push(...(this.leaves || []));
				}

				let searchResult = [];
				this.leavesDataOfSearch && this.leavesDataOfSearch.forEach((leaveItm) => {
					let str: string = ((leaveItm.leaveTypeName || '') + (leaveItm.leaveType || '') + (leaveItm.requestReason || '')).toLowerCase();
					if (str.indexOf((messageInput).toLowerCase()) > -1) {
						searchResult.push(leaveItm);
					}
				});
				this.leaves = searchResult;
			} else {
				this.leaves = [];
				this.leaves.push(...(this.leavesDataOfSearch || []));
				this.leavesDataOfSearch = null;
			}
		});

		this.getSummaryLeave();
	}

	public onIonDrag(event) {
		this.slides = event;
		this.slides.lockSwipes(true);
	}

	@ViewChild(Slides) private slides: Slides;

	public slideHasChanged(cb?: () => void) {
		let indx = this.slides.getActiveIndex();
		console.log("slideHasChanged getActiveIndex indx:", indx);
		this.slideChange(indx, cb);
	}

	private slideChange(indx: number, cb: () => void): void {
		// let indx = this.slides.getActiveIndex();
		console.log("slideChange indx:", indx);
		this.leaves = [];
		if (indx == 0 || indx == undefined || indx == null) {
			this.getHistory(cb);
		} else if (indx == 1) {
			this.getDelegateHistory(cb);
		} else if (indx == 2) {
			this.getAcknowledgeHistory(cb);
		}
	}
	private isActive(index: number): boolean {
		return index == this.slides.getActiveIndex();
	}
	private slideActive(index: number): void {
		this.isLoading = true;
		this.slides.slideTo(index);
		this.slideChange(index, () => {
			console.log("slides.slideTo :", index);
			console.log("isActive [" + index + "] :", this.isActive(index));
		});
	}

	private getSummaryLeave(cb?: () => void): any {
		this.leaveService.getLeaveSummaryYear().subscribe((res) => {
			(res || []).forEach((leaveItem) => {
				if (leaveItem.leaveTypeNo == this.LEAVE_TYPE.sick.code) {
					this.leaveSummaryYear.sick = leaveItem.balanceDay;
					this.leaveService.getLeaveInfo(leaveItem.leaveTypeNo).subscribe((res) => {
						let leaveInfo: LeaveSummaryInfo = res;
						this.leaveSummary.sick.total = leaveInfo.eligibleDay;
						this.leaveSummary.sick.used = leaveInfo.usedDay;
						this.leaveSummary.sick.remain = leaveInfo.eligibleDay - leaveInfo.usedDay;
						this.leaveSummary.sick.percentage = ((this.leaveSummary.sick.used / this.leaveSummary.sick.total) * 100) + "%";
					}, (err) => { });
				} else if (leaveItem.leaveTypeNo == this.LEAVE_TYPE.business.code) {
					this.leaveSummaryYear.personal = leaveItem.balanceDay;
					this.leaveService.getLeaveInfo(leaveItem.leaveTypeNo).subscribe((res) => {
						let leaveInfo: LeaveSummaryInfo = res;
						this.leaveSummary.business.total = leaveInfo.eligibleDay;
						this.leaveSummary.business.used = leaveInfo.usedDay;
						this.leaveSummary.business.remain = leaveInfo.eligibleDay - leaveInfo.usedDay;
						this.leaveSummary.business.percentage = ((this.leaveSummary.business.used / this.leaveSummary.business.total) * 100) + "%";
					}, (err) => { });
				} else if (leaveItem.leaveTypeNo == this.LEAVE_TYPE.vacation.code) {
					this.leaveSummaryYear.annual = leaveItem.balanceDay;
					this.leaveService.getLeaveInfo(leaveItem.leaveTypeNo).subscribe((res) => {
						let leaveInfo: LeaveSummaryInfo = res;
						this.leaveSummary.vacation.total = leaveInfo.eligibleDay;
						this.leaveSummary.vacation.used = leaveInfo.usedDay;
						this.leaveSummary.vacation.remain = leaveInfo.eligibleDay - leaveInfo.usedDay;
						this.leaveSummary.vacation.percentage = ((this.leaveSummary.vacation.used / this.leaveSummary.vacation.total) * 100) + "%";
					}, (err) => { });
				} else {
					this.leaveService.getLeaveInfo(leaveItem.leaveTypeNo).subscribe((res) => {
						let leaveInfo: LeaveSummaryInfo = res;
						this.leaveSummary.other.total = leaveInfo.eligibleDay + this.leaveSummary.other.total;
						this.leaveSummary.other.remain = (leaveInfo.eligibleDay - leaveInfo.usedDay);
						this.leaveSummary.other.used = leaveInfo.usedDay + this.leaveSummary.other.used;
						this.leaveSummary.other.percentage = ((this.leaveSummary.other.used / this.leaveSummary.other.total) * 100) + "%";
					}, (err) => { });
				}
			});
		});
		this.leaves = [];

		this.slideChange(0, () => {
			// this.slides.slideTo(0);
			cb && cb();
		});
	}

	public getFirstCalendarText() {
		return moment().calendar().split(" ")[0];
	}

	public collapsedToGroup(_assign: any[]): any[] {
		const currDateString: string = moment().format("D MMMM YYYY");
		let outputResp = [];
		(_assign || []).forEach(_assignItm => {
			const constFromDate = moment(_assignItm.fromDate);
			// let dateTime = constFromDate.format("D MMMM YYYY");
			let dateTime = constFromDate.format("MMMM YYYY");
			_assignItm.fromDateTime = constFromDate.format("LT");
			let toDayObj: ObjectGroupDataM = outputResp.find(itm => itm.date == dateTime);
			if (!toDayObj) {
				toDayObj = {
					"date": dateTime,
					"dateId": constFromDate.format("YYYYMMDD"),//20181231
					"task": [],
				};
				if (currDateString == dateTime) {
					toDayObj.dateString = this.getFirstCalendarText();
				}
				toDayObj.task.push(_assignItm);
				outputResp.push(toDayObj);
			} else {
				toDayObj.task.push(_assignItm);
			}
		});

		outputResp.sort((a, b) => {
			const aData = a.dateId;
			const bData = b.dateId;
			if (aData == bData) {
				return 0;
			} else {
				if (aData < bData) {
					return 1;
				} else {
					return -1;
				}
			}
		});
		return outputResp;
	}

	private mapLeaveResult(resp: any, cb?: () => void) {

		setTimeout(() => {
			this.appLoadingService.hideLoading().then(() => {
				this.leaves = resp;
				let leave = this.selectLeaveType(resp);
				this.leavesCollapsedGroup = this.collapsedToGroup(leave);
				console.log("this.leaves :", this.leaves);
				console.log("this.leavesCollapsedGroup :", this.leavesCollapsedGroup);
				this.isLoading = false;
				cb && cb();
			});
		}, AppConstant.APP_DEBOUNCE_SEARCH_TIME);
	}

	private selectLeaveType(_leave) {
		let leaveList: any = [];
		if (this.shiftType == 'sick') {
			leaveList = (_leave || []).filter(itm => 'Sick Leave'.equals(itm.leaveType));
		} else if (this.shiftType == 'annual') {
			leaveList = (_leave || []).filter(itm => 'Annual Leave'.equals(itm.leaveType));
		} else if (this.shiftType == 'personal') {
			leaveList = (_leave || []).filter(itm => 'Personal Leave'.equals(itm.leaveType));
		} else if (this.shiftType == 'other'){
            leaveList = (_leave || []).filter(itm => !('Sick Leave').equals(itm.leaveType) 
                && !('Annual Leave').equals(itm.leaveType) 
                && !('Personal Leave').equals(itm.leaveType)
            );
		}
		return leaveList;
	}

	private getShiftDateTime(_tm) {
		return moment(_tm).format("HH:mm");;
	}

	private getHistory(cb?: () => void) {
		this.leaveService.getHistoryRequest().subscribe(resp => this.mapLeaveResult(resp, cb));
	}
	private getDelegateHistory(cb?: () => void) {
		this.leaveService.getHistoryDelegate().subscribe(resp => this.mapLeaveResult(resp, cb));
	}
	private getAcknowledgeHistory(cb?: () => void) {
		this.leaveService.getHistoryAcknowledge().subscribe(resp => this.mapLeaveResult(resp, cb));
	}

	private gotoCalendar(params) {
		this.navCtrl.push(EventsCalendarPage);
	}

	private gotoCreateLeave() {
		var leaveType = "";
		if (this.Sick == 'select') {
			leaveType = "Sick Leave";
			this.navCtrl.push(LeaveCreateDetailPage, {
				data: leaveType,
			});
		} else if (this.Annual == 'select') {
			leaveType = "Annual Leave";
			this.navCtrl.push(LeaveCreateDetailPage, {
				data: leaveType,
			});
		} else if (this.Personal == 'select') {
			leaveType = "Personal Leave";
			this.navCtrl.push(LeaveCreateDetailPage, {
				data: leaveType,
			});
		} else {
			leaveType = "Other Leave";
			this.navCtrl.push(LeaveCreateDetailPage, {
				data: leaveType,
			});
		}
	}

	private viewEvent(leave: LeaveModel) {
		this.navCtrl.push(LeaveDetailPage, {
			viewMode: true,
			leaveObject: leave,
			selectType: 'leave' //บอกว่า show detail เป็น leave , approve , shift
		});
	}
	/*
	private viewEvent(leave: LeaveModel) {
	this.navCtrl.push(LeaveViewEventPage, {
	viewMode: true,
	leaveObject: leave
	});
	}
	*/
}
