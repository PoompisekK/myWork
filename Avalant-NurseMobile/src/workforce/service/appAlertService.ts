import { Injectable } from '@angular/core';
import { ModalController, ModalOptions } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { CustomAlertPopupPage } from '../../pages/custom-alert-popup/custom-alert-popup.page';
import { AppConstant } from '../../constants/app-constant';

@Injectable()
export class AppAlertService {

    constructor(
        private modalController: ModalController,
    ) {

    }
    public successAlertPopup(alerParamM: AppAlertOpt | { description: string }): Observable<any> {
        return this.showAlert({ description: alerParamM.description, status: AppConstant.Status.SUCCESS });
    }
    public warningAlertPopup(alerParamM: AppAlertOpt | { description: string }): Observable<any> {
        return this.showAlert({ description: alerParamM.description, status: AppConstant.Status.WARNING });
    }
    public errorAlertPopup(alerParamM: AppAlertOpt | { description: string }): Observable<any> {
        return this.showAlert({ description: alerParamM.description, status: AppConstant.Status.ERROR });
    }
    public forgotAlertPopup(alerParamM: AppAlertOpt | { description: string }): Observable<any>{
        return this.showAlert({ description: alerParamM.description, status: AppConstant.Status.RECOVER });
    }

    private showAlert(alerParamM: AppAlertOpt): Observable<any> {
        let modelOtp: ModalOptions = {};
        modelOtp.cssClass = "custom-alert " + (alerParamM.cssClass || '');
        modelOtp.enableBackdropDismiss = true;
        modelOtp.showBackdrop = true;
        return Observable.create((observer) => {
            let alertModal = this.modalController.create(CustomAlertPopupPage, alerParamM, modelOtp);
            // alertModal.onWillDismiss(() => {
            //     alerParamM.onWillDismiss && alerParamM.onWillDismiss();
            //     observer.next({});
            // });
            alertModal.onDidDismiss(() => {
                alerParamM.onDidDisMiss && alerParamM.onDidDisMiss();
                observer.next({});
            });
            alertModal.present();
        });
    }
}

export class AppAlertOpt {
    public status: string;
    public description: string;
    public cssClass?: string;
    public onPresented?: () => void;
    public onWillDismiss?: () => void;
    public onDidDisMiss?: () => void;
}