import { Component, ElementRef, ViewChild } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { App, NavController, Platform } from 'ionic-angular';
import * as moment from 'moment';
import { AppNavConfig } from '../../../components/app-nav-header/app-nav-header.component';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { CheckInOutModel } from '../../model/checkInOut.model';
import { AppAlertService } from '../../service/appAlertService';
import { CheckInOutService } from '../../service/checkInOutService';
import { CheckInOutHistoryPage } from '../check-in&out-history-page/check-in&out-history-page';
import { CheckInOutSuccesssPage } from './check-in&out-success-page/check-in&out-success-page';
import { TranslationService } from 'angular-l10n';

declare let google;

@Component({
  selector: 'check-in-out-page',
  templateUrl: 'check-in&out.page.html'
})
export class CheckInOut {

  // @ViewChild('pacInput') pacInputElement: ElementRef;
  @ViewChild('map') private mapElement: ElementRef;
  private mapLoading: boolean = true;
  // private map: any;
  private currentPos: Geoposition;
  private currentDate: Date;
  private checkInOut: CheckInOutModel = new CheckInOutModel();
  private statusCheckInOut: string;
  private displayText = {
    titleClockInOut: "Not available",
    subTitleClockInOut: "Your Check in time",
    nameButtonCheckInOut: this.translationService.translate('M_CHECK_INOUT.CHECK_IN')
  };

  private TIME_IN: string = "TIME_IN";
  private TIME_OUT: string = "TIME_OUT";

  private recentTimeToday: any = {};
  private recentTime: any = {};

  constructor(
    private app: App,
    private appAlertService: AppAlertService,
    private appLoadingService: AppLoadingService,
    private checkInOutService: CheckInOutService,
    private diagnostic: Diagnostic,
    private locationAccuracy: LocationAccuracy,
    private openNativeSettings: OpenNativeSettings,
    private platform: Platform,
    private geolocation: Geolocation,
    private navCtrl: NavController,
    private translationService: TranslationService,
  ) {

  }
  private buttonCfg: AppNavConfig = {
    hideNoti: false,
    buttons: [{
      name: "Show History",
      icon: "ios-timer-outline",
      click: () => {
        this.navCtrl.push(CheckInOutHistoryPage);
      }
    }]
  };
  public ionViewWillEnter() {
    this.openMap();
    this.checkInOutService.getStatusCheckInOut().subscribe((resp) => {
      console.log("getStatusCheckInOut :", resp);
      this.statusCheckInOut = resp.timeTypeCode;
      this.initPage();
    }, (errMsg) => {
      console.error("getStatusCheckInOut errMsg:", errMsg);
    });
    this.currentDate = new Date();
    setInterval(() => {
      this.currentDate = new Date();
    }, 30000);

    this.getTodayHistory((respData) => {
      this.recentTimeToday = respData && respData.length > 0 && respData[0];
      this.recentTime = this.recentTimeToday.recorderDate + 'z' + this.recentTimeToday.recorderOut;

      // let dateTime = moment(this.recentTime);
      // console.log('Date time : ',dateTime.format("LT"));

    });
  }

  private initPage() {
    console.log('TIME_IN : ',this.TIME_IN)
    if (this.statusCheckInOut == this.TIME_IN) {
      this.displayText = {
        titleClockInOut: "Clock In",
        subTitleClockInOut: "Your Check in time",
        nameButtonCheckInOut: this.translationService.translate('M_CHECK_INOUT.CHECK_IN')
      };
    } else if (this.statusCheckInOut == this.TIME_OUT) {
      this.displayText = {
        titleClockInOut: "Clock Out",
        subTitleClockInOut: "Your Check out time",
        nameButtonCheckInOut: this.translationService.translate('M_CHECK_INOUT.CHECK_OUT')
      };
    }
  }

  private openMap() {
    if (this.platform.is("mobileweb")) {
      this.loadMap();
    } else {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
            console.log('Request successful');
          }, (error) => {
            console.log('Error requesting location permissions', error);
          });
        }
      });

      this.diagnostic.getLocationAuthorizationStatus().then((resp: any) => {
        console.log("getLocationAuthorizationStatus resp:", resp);

        this.diagnostic.requestLocationAuthorization().then((resp) => {
          console.log("requestLocationAuthorization resp:", resp);
        });
      });
      this.diagnostic.isGpsLocationEnabled().then((status: boolean) => {
        if (status) {
          this.loadMap();
        } else {
          this.openNativeSettings.open("location").then((res) => {
            this.loadMap();
          }).catch(() => {
            this.diagnostic.switchToLocationSettings();
          });
        }
      });
    }
  }

  private loadMap() {

    let geolocation = this.geolocation.getCurrentPosition({
      enableHighAccuracy: true
    }).then((position) => {
      console.log("getCurrentPosition :", position);
      this.currentPos = position;
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = { center: latLng, zoom: 15, mapTypeId: google.maps.MapTypeId.ROADMAP };
      let map = new google.maps.Map(this.mapElement.nativeElement, {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        draggable: false,
      });

      google.maps.event.addListenerOnce(map, 'idle', () => {
        google.maps.event.trigger(map, 'resize');
        console.log("Map loaded !!!");
        this.mapLoading = false;
      });

      this.addMarker(map);
    }, (err) => {
      console.log(err);
    });
  }

  private addMarker(map) {
    let blueDotCurrLatLng = new google.maps.Marker({
      map: map,
      clickable: false,
      icon: new google.maps.MarkerImage('./assets/img/icon/mobileimgs2.png',
        new google.maps.Size(22, 22),
        new google.maps.Point(0, 18),
        new google.maps.Point(11, 11)),
      shadow: null,
      zIndex: 999,
      title: "Current Position",
      animation: google.maps.Animation.DROP,
      position: map.getCenter()
    });

    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(blueDotCurrLatLng, 'click', () => {
      infoWindow.open(map, blueDotCurrLatLng);
    });

  }

  private checkIn() {
    this.appLoadingService.showLoading();
    this.checkInOut.checkInTime = this.currentDate.toString();
    this.checkInOut.date = moment(this.currentDate).format("YYYY-MM-YY");
    this.checkInOut.position.lat = this.currentPos.coords.latitude;
    this.checkInOut.position.long = this.currentPos.coords.longitude;
    this.checkInOut.status = this.statusCheckInOut;

    this.checkInOutService.saveCheckInOut(this.checkInOut).subscribe((resp) => {
      console.info("saveCheckInOut [" + this.statusCheckInOut + "] resp :", resp);
      this.appLoadingService.hideLoading().then(() => {
        this.app.getRootNav().setRoot(CheckInOutSuccesssPage, { data: resp, clockType: this.statusCheckInOut }, { animate: true, direction: "forward" });
      });
    }, (errMsg) => {
      console.error("errMsg:", errMsg);
      this.appLoadingService.hideLoading().then(() => {
        this.appAlertService.errorAlertPopup(errMsg).subscribe(() => {
        });
      });
    });
  }

  private getTodayHistory(cb?: (respData: any[]) => void): void {
    let toDayHist = [];
    const toDay = moment(new Date()).format("YYYY-MM-DD");
    this.checkInOutService.getCheckInOutHistory().subscribe((resp) => {
      console.log("getCheckInOutHistory resp :", resp);
      (resp || []).forEach(itm => {
        if (itm.recorderDate == toDay) {
          toDayHist.push(itm);
        }
      });
      cb && cb(toDayHist);
    });
  }

  private displayTime(recorderDate: string, _time: string) {
    const TH_AM = "ก่อนเที่ยง", TH_PM = "หลังเที่ยง";
    const EN_AM = "AM", EN_PM = "PM";
    recorderDate = (recorderDate || "").toUpperCase();
    if ((_time || "").indexOf(TH_AM) > -1) {
      let amText = (_time.replace(TH_AM, "")).trim();
      return new Date(recorderDate + "T" + amText);
    } else if ((_time || "").indexOf(TH_PM) > -1) {
      let pmText = (_time.replace(TH_PM, "")).trim();
      return new Date(recorderDate + "T" + pmText);
    } else if ((_time || "").indexOf(EN_AM) > -1) {
      let amText = (_time.replace(EN_AM, "")).trim();
      return new Date(recorderDate + "T" + amText);
    } else if ((_time || "").indexOf(EN_PM) > -1) {
      let pmText = (_time.replace(EN_PM, "")).trim();
      return new Date(recorderDate + "T" + pmText);
    }
  }

  private goToHisPage() {
    this.navCtrl.push(CheckInOutHistoryPage);
  }

}
