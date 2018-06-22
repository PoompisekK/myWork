import { Injectable } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';

/**
 * @author Bundit.Ng
 * @since  Fri Feb 09 2018
 * Copyright (c) 2018 Avalant Co.,Ltd.
 */

@Injectable()
export class AppLoadingService {
  private loading: Loading;

  constructor(
    private loadingCtrl: LoadingController
  ) {
  }

  public isShowing(): boolean {
    return this.loading != null;
  }

  public showLoading(_inMessage?: string): Promise<any> {
    this.loading = this.loadingCtrl.create({ content: _inMessage || 'Loading...', });
    this.loading.present();
    return this.loading.present();
  }

  public hideLoading(): Promise<any> {
    return (this.loading && this.loading.dismiss().then(() => {
      this.loading = null;
    })) || new Promise((resolve, reject) => resolve({})).then(() => {
      this.loading = null;
    });
  }
}
