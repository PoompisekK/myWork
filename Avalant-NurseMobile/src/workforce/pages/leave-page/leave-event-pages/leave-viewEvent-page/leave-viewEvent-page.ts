import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LeaveModel } from '../../../../model/leave.model';
import { ContsVariables } from '../../../../global/contsVariables';
import { AnimateCss } from '../../../../../animations/animate-store';

@Component({
    selector: 'leave-viewEvent-page',
    templateUrl: 'leave-viewEvent-page.html',
    styleUrls: ['/leave-viewEvent-page.scss'],
    animations: [
        AnimateCss.peek()
    ]
})
export class LeaveViewEventPage implements OnInit {
    private leave: LeaveModel = new LeaveModel();
    private LEAVE_TYPE = ContsVariables.leaveConst.leaveType;
    private isOtherLeaveType = false;

    private leaveTypeActive = [
        { isActive: false, inactive: "assets/img/cir-sick.png", active: "assets/img/sick-active.png" },
        { isActive: false, inactive: "assets/img/cir-business.png", active: "assets/img/business-active.png", },
        { isActive: false, inactive: "assets/img/cir-vacation.png", active: "assets/img/vacation-active.png", },
        { isActive: false, inactive: "assets/img/cir-others.png", active: "assets/img/other-active-1.png" },
    ];

    constructor(
        public navCtrl: NavController,
        private navParams: NavParams,
    ) {

    }
    public selectedRecommendOfficerList: any[] = [];
    private selectedAcknowledgeList: any[] = [];
    public ngOnInit() {
        this.leave = this.navParams.get("leaveObject");
        console.log("%cleave :" + JSON.stringify(this.leave, null, 2), "background:#FEFBE6;color:#735C2E");
        this.selectedAcknowledgeList = this.leave.acknowledge;
        let matchIdx1 = this.isMatch(this.leave.leaveTypeNo, this.LEAVE_TYPE.sick);
        let matchIdx2 = this.isMatch(this.leave.leaveTypeNo, this.LEAVE_TYPE.business);
        let matchIdx3 = this.isMatch(this.leave.leaveTypeNo, this.LEAVE_TYPE.vacation);
        let matchIdx4 = !(matchIdx1 || matchIdx2 || matchIdx3);

        console.log("matchIdx1 :", matchIdx1);
        console.log("matchIdx2 :", matchIdx2);
        console.log("matchIdx3 :", matchIdx3);
        console.log("matchIdx4 :", matchIdx4);

        this.leaveTypeActive[0].isActive = matchIdx1;
        this.leaveTypeActive[1].isActive = matchIdx2;
        this.leaveTypeActive[2].isActive = matchIdx3;

        if (matchIdx4) {
            this.leaveTypeActive[3].isActive = true;
            this.isOtherLeaveType = true;
        }
        if (!this.leave.attachFile) {
            this.leave.attachFile = [];
        }

    }

    public ionViewDidEnter() {

    }

    public isMatch(_value: string, object: any): boolean {
        return _value == object.code || _value == object.name || _value == object.nameEn || _value == object || ((_value || "").indexOf(object.nameEn) > -1 || (object.nameEn || "").indexOf(_value) > -1);
    }
}
