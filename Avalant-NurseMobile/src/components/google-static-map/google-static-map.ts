import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from 'ionic-angular';

/**
 * @author Bundit.Ng
 * @since  Fri Jan 12 2018
 * Copyright (c) 2018 Avalant Co.,Ltd.
 */
@Component({
  selector: 'google-static-map',
  templateUrl: 'google-static-map.html'
})
export class GoogleStaticMapComponent implements OnInit {

  @Input('InLatLng') 
  private inLatLng;
  @Input('showFullMap') 
  private isShowFullMap: boolean | string;

  private staticUrl = null;

  constructor(
    private domSanitizer: DomSanitizer,
    private modalCtrl: ModalController,
  ) { }

  public ngOnInit() {
    console.log("this.inLatLng:", this.inLatLng);
    this.staticUrl = "https://maps.googleapis.com/maps/api/staticmap?scale=2&language=th&center=" + this.inLatLng
      + "&zoom=17&size=400x220&maptype=roadmap&markers=color:red%7Clabel:A%7C" + this.inLatLng + "&key=";
  }

  private showFullMap() {
    if (this.isShowFullMap == true || this.isShowFullMap == "true") {
      // let modalPage = this.modalCtrl.create(GoogleMapFullPage, { lntlng: this.inLatLng });
      // modalPage.present();
    }
  }

  private getSelfImg(_string: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(_string);
  }
}
