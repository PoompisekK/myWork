import { Directive, ElementRef, OnDestroy, OnInit, Optional } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform, ViewController } from 'ionic-angular';

/**
 * Dynamic Statusbar Directive
 * 
 * @author Arsen Khachaturyan
 * @see https://stackoverflow.com/a/45677087
 */
@Directive({
  selector: 'ion-header',
})
export class DynamicStatusBarDirective implements OnInit, OnDestroy {
  public static isColorTooLight(colorString) {
    let rgb = DynamicStatusBarDirective.getRgbColor(colorString);

    if (rgb.a || (rgb.a < 0.2)) { // becoming too transparent
      return true;
    }

    // contrast computation algorithm/approach: https://24ways.org/2010/calculating-color-contrast
    let yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
    return yiq >= 128;
  }

  public static getRgbColor(colorString): RGB {
    if (!colorString) {
      return null;
    }

    let rgb: RGB = new RGB();

    if (colorString[0] === '#') { // seems hex color
      rgb.r = parseInt(colorString.substr(0, 2), 16);
      rgb.g = parseInt(colorString.substr(2, 2), 16);
      rgb.b = parseInt(colorString.substr(4, 2), 16);
    } else {
      let matchColors = /rgba?\(((25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,\s*?){2}(25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,?\s*([01]\.?\d*?)?\)/;
      let colors = matchColors.exec(colorString);
      if (colors) {
        rgb.r = parseInt(colors[1], 10);
        rgb.g = parseInt(colors[2], 10);
        rgb.b = parseInt(colors[3], 10);

        if (colors[4]) { // has transparency
          rgb.a = parseInt(colors[4], 10);
        }
      }
    }

    return rgb;
  }

  public static getModalParent(nativeElm) {
    return nativeElm
      .parentNode // modal
      .parentNode // modal wrapper
      .parentNode // ion-modal
      .parentNode; // ion-app, which handles background status bar
  }

  public static getHeaderBackgroundForMobile(nativeElm) {
    let header = nativeElm.querySelector('.toolbar-background');
    return window.getComputedStyle(header).backgroundColor;
  }

  public ionViewEnterCallback: Function;
  public modalCloseCallback: Function;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public elm: ElementRef,
    @Optional() public viewCtrl: ViewController,
  ) {
  }

  public ngOnInit(): void {
    this.ionViewEnterCallback = () => this.checkStatusBar();
    if (this.viewCtrl) {
      this.viewCtrl.willEnter.subscribe(this.ionViewEnterCallback);
    }
  }

  public ngOnDestroy(): void {
    this.viewCtrl.willEnter.unsubscribe();
    this.viewCtrl.didLeave.unsubscribe();
  }

  public checkStatusBar(): void {
    if (!this.platform.is('ios')) {
      return;
    }

    let nativeElm = this.elm.nativeElement;

    if (this.viewCtrl.isOverlay) { // dealing with modal
      let parentNativeElm = DynamicStatusBarDirective.getModalParent(nativeElm);

      if (parentNativeElm) { // modal is open
        this.modalCloseCallback = () => this.setColor(window.getComputedStyle(parentNativeElm).backgroundColor);

        this.viewCtrl.didLeave.subscribe(this.modalCloseCallback);
      }

      if (this.platform.is('tablet')) {
        this.setColor(true); // for modals we are getting grey overlay, so need to set white background
        return;
      }
    }

    let background = DynamicStatusBarDirective.getHeaderBackgroundForMobile(nativeElm);

    if (background) {
      this.setColor(background);
    }

  }

  public setColor(background: any): void {
    let isTooLight = DynamicStatusBarDirective.isColorTooLight(background);

    if (isTooLight) {
      this.statusBar.styleDefault();
    } else {
      this.statusBar.styleBlackTranslucent();
    }
  }
}

class RGB {
  public r: number;
  public g: number;
  public b: number;
  public a?: number;
}