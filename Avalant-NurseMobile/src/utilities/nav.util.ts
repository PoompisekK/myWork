import { Nav, NavController } from 'ionic-angular';
import { NavControllerBase } from 'ionic-angular/navigation/nav-controller-base';

/**
 * Navigation Utility
 * 
 * @author NorrapatN
 * @since Wed Nov 15 2017
 */
export class NavUtil {

  /**
   * Find a root nav
   * 
   * @param navCtrl Ionic's Nav Controller
   */
  public static findRootNav(navCtrl: NavController | Nav): Nav | void {
    if (!navCtrl) {
      return void 0;
    }

    if (navCtrl instanceof Nav && !navCtrl.parent) {
      return navCtrl;
    }

    return NavUtil.findRootNav(navCtrl.parent);
  }
}
