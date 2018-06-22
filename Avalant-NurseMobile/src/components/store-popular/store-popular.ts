import { Component, ViewChild } from '@angular/core';
import { Slides, NavController } from "ionic-angular";

/**
 * Generated class for the StorePopular component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'store-popular',
  templateUrl: 'store-popular.html'
})
export class StorePopular {

  @ViewChild(Slides) private popularSlide: Slides;
  private productList: any[] = [];
  constructor(
    private nav: NavController
  ) {
    this.getPopularSlidesList();
  }
  public ngAfterViewInit() {
    if (this.popularSlide) {
      this.popularSlide.autoplay = 2000;
      this.popularSlide.autoplayDisableOnInteraction = true;
    }
  }

  private getPopularSlidesList(): void {
    for (let i = 0; i < 5; i++) {
      this.productList.push({
        name: "เชิญฟังธรรมบรรยายโครงการศึกษาพระสุตตันตปิฎก โดย นพ.กนก พฤฒิวทัญญู (พฤษภาคม และ มิถุนายน 2560)",
        desc: "ยุวพุทธิกสมาคมแห่งประเทศไทย ในพระบรมราชูปถัมภ์ ขอเชิญฟังธรรมบรรยายในโครงการศึกษาพระสุตตันตปิฎก หัวข้อ \"อานุภาพแห่งศีล\" โดย นพ.กนก พฤฒิวทัญญู ตั้งแต่เวลา ๑๓.๐๐ - ๑๖.๐๐ น. (ต่อเนื่องจำนวน ๔ ครั้ง)",
      });
    }
    // console.log("this.productList:", this.productList);
  }
   
  private go2ProductDtl(): void {
    // this.nav.push(ProductInfo);
  }
}
