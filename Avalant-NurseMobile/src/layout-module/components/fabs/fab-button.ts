import { NavController } from 'ionic-angular';
import { FabCallback } from './fabs.type';

/**
 * FAB button
 * 
 * @author NorrapatN
 * @since Thu Oct 05 2017
 */
export class FabButton {

  public id: string;
  public icon?: string;
  public color?: string;

  public callback?: FabCallback;

  public static createFabButton(fabOptions: FabButton): FabButton {
    return Object.assign(new FabButton(), fabOptions);
  }
}
