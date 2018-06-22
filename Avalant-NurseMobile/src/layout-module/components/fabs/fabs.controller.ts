import { Injectable } from '@angular/core';
import { UearnFabsComponent } from './fabs.component';
import { FabButton } from './fab-button';
import { FabButtonRemover } from './fabs.type';
import { Nav } from 'ionic-angular';

/**
 * Store FABs instance (workaround)
 */
// let fabsInstance: UearnFabsComponent;

/**
 * FABs Controller
 * 
 * @author NorrapatN
 * @since Wed Oct 04 2017
 */
@Injectable()
export class UearnFabsController {

  private _nav: Nav;
  private fabsInstance: UearnFabsComponent;

  /**
   * FAB except by these pages. !
   * @@ TODO: These page need to Toggle FAB by itself !!
   */
  private fabExceptPages = ['LoginPage', 'RegisterPage', 'SettingsPage', 'HelpPageComponent', 'RegisterRequestOTPPage', 'RegisterVerifyOTPPage', 'WorkForceHomePage'];

  constructor() {
    this.initial();
  }

  /**
   * Don't INVOKE this method or you are sure what are you doing.
   */
  public _setNav(nav: Nav): void {
    if (!this._nav) {
      this._nav = nav;

      // TODO: Need change to Page itself.
      this._nav.viewWillEnter.subscribe((event) => {
        if (this.fabExceptPages.indexOf(event.name) > -1) {
          this.hide();
        }
      }, error => {
        console.warn('Error viewWillEnter => ', error);
      });

      this._nav.viewWillLeave.subscribe((event) => {
        if (this.fabExceptPages.indexOf(event.name) > -1) {
          this.show();
        }
      }, error => {
        console.warn('Error viewWillEnter => ', error);
      });

    } else {
      throw `DON'T SET ANY NAV TO THIS FAB CTRL !`;
    }
  }

  public registerFabsComponent(fabs: UearnFabsComponent): UearnFabsComponent {
    this.fabsInstance = fabs;
    return fabs;
  }

  public addButton(fab: FabButton): FabButtonRemover {
    return this.fabsInstance && this.fabsInstance.addButton(fab);
  }

  public show(): void {
    this.fabsInstance && this.fabsInstance.show();
  }

  public hide(): void {
    this.fabsInstance && this.fabsInstance.hide();
  }

  public toggle(): void {
    this.fabsInstance && this.fabsInstance.toggle();
  }

  private initial(): void {

  }

}
