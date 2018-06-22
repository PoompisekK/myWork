import { NavController } from 'ionic-angular';
import { FabButton } from './fab-button';

export type FabButtonRemover = () => void;

export type FabCallback = (navCtrl: NavController, fab: FabButton) => void;
