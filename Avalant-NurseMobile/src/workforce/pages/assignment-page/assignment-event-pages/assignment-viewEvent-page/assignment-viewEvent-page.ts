import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AnimateCss } from '../../../../../animations/animate-store';
import { AppLoadingService } from '../../../../../services/app-loading-service/app-loading.service';
import { ContsVariables } from '../../../../global/contsVariables';
import { AssignmentModel } from '../../../../model/assignment.model';
import { AppAlertService } from '../../../../service/appAlertService';
import { AssignmentService } from '../../../../service/assignmentService';
import { AssignmentCreateEventPage } from '../assignment-createEvent-page/assignment-createEvent-page';
import { StringUtil } from '../../../../../utilities/string.util';

declare var google;
@Component({
  selector: 'assignment-viewEvent-page',
  templateUrl: 'assignment-viewEvent-page.html',
  animations: [
    AnimateCss.peek()
  ]
})
export class AssignmentViewEventPage implements OnInit {
  private assign: AssignmentModel = new AssignmentModel();
  private selectedAssign: string;
  private editMode: boolean = false;
  private seletedPlace: any;
  @ViewChild('map') private mapElement: ElementRef;

  private map;
  private markers;
  constructor(
    public navCtrl: NavController,
    public navParam: NavParams,
    private appAlertService: AppAlertService,
    public appLoadingService: AppLoadingService,
    private assignmentService: AssignmentService,
  ) {

  }
  public ngOnInit() {
    this.assign = this.navParam.get("assign");
    this.selectedAssign = this.navParam.get("selectedAssign");
    console.log("loadMap:", this.assign);
  }
  private ionViewDidLoad() {
    // this.loadMap();
  }
  private loadMap() {
    console.log("loadMap :", this.assign);

    let latLng = new google.maps.LatLng(this.assign.latitude, this.assign.longitude);
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      draggable: false,
      scaleControl: false,
      scrollwheel: false,
      navigationControl: false,
      streetViewControl: false,
    });
    let marker = new google.maps.Marker({
      map: this.map,
      title: "Current Position",

      position: this.map.getCenter()
    });
    this.markers = [];
    this.markers.push(marker);
  }
  
  private isHasLatLngParams(_assign: any): boolean {
    let lat, lng;
    lat = ((_assign || {}).latitude || "");
    lng = ((_assign || {}).longitude || "");
    return !StringUtil.isEmptyString(lat + lng);
  }

  private getLatLngParams(_assign: any) {
    let latlng = null, lat, lng;
    lat = ((_assign || {}).latitude || "");
    lng = ((_assign || {}).longitude || "");
    latlng = [lat, lng].join(",");
    return latlng;
  }

  private ASSIGN_ACCEPTED: string = ContsVariables.StatusAssigment.ACCEPTED;
  private ASSIGN_COMPLETE: string = ContsVariables.StatusAssigment.COMPLETE;
  private ASSIGN_DENIED: string = ContsVariables.StatusAssigment.DENIED;

  private assignmentUpdateStatus(_status: string) {
    this.appLoadingService.showLoading();
    this.assignmentService.updateStatusResponsible(_status, this.assign).subscribe((res) => {
      this.appLoadingService.hideLoading().then(() => {
        this.appAlertService.successAlertPopup({ description: "Update assign status complete" }).subscribe(() => {
          this.navCtrl.pop();
        });
      });
    }, (err) => {
      this.appLoadingService.hideLoading().then(() => {
        this.appAlertService.errorAlertPopup({ description: "Update assign status fail" }).subscribe(() => {
          console.error("assignmentUpdateStatus error :", err);
        });
      });
    });
  }

  private editAssign() {
    this.navCtrl.push(AssignmentCreateEventPage, {
      editAssignData: this.assign,
      actionParams: "edit",
    });
    // this.editMode = true;
  }

}
