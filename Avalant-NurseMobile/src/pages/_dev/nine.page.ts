import { Component, OnInit, ViewChild } from '@angular/core';
import { NumberUtil } from '../../utilities/number.util';
import { ShippingService } from '../../services/shipping-services/shipping.service';
import { EAFRestService } from '../../services/eaf-rest/eaf-rest.service';
import { UserModel } from '../../model/user/user.model';
import { NinePage2 } from './nine2.page';
import { PopoverController } from 'ionic-angular';
import { TitleNameMasterModel } from '../../model/master-data/title-name.master.model';
import { AvaCacheService } from '../../services/cache/cache.service';
import { CacheConstant } from '../../constants/cache';
import { NgForm } from '@angular/forms';
import { SelectOptionsPopoverModel } from '../../layout-module/components/select-popover/select-option.popover';
import { ObjectsUtil } from '../../utilities/objects.util';
import { EAFRestApi } from '../../constants/eaf-rest-api';

@Component({
  selector: 'nine-page',
  templateUrl: 'nine.page.html',
  styleUrls: ['/nine.page.scss']
})

export class NinePage implements OnInit {

  private model: any;
  private test: any;
  private titleList: TitleNameMasterModel[];
  private selectPayment: string;

  constructor(
    private popoverCtrl: PopoverController,
    private cacheService: AvaCacheService
  ) {

  }

  private imageKey: string = '827f718c-6101-4c07-bafa-eff9863957ce';

  public ngOnInit() {
    this.cacheService.getCacheMaster(CacheConstant.MS_TITLE, TitleNameMasterModel).subscribe(resp => {
      this.titleList = resp;
    });
  }

  private test2() {
    let someString = '';
    someString = '827f718c-6101-4c07-bafa-eff9863957ce';
    this.imageKey = someString;
  }

  private click(ev, model: any, inputForm: NgForm, dataList: any[], titleName: string, titleCode: string, name: string) {

    // console.log('form? => ', inputForm);
    let popover = this.popoverCtrl.create(NinePage2, {
      dataList: dataList,
      dataName: titleName,
      dataCode: titleCode
    });
    popover.present({
      ev: ev
    });

    popover.onDidDismiss((data) => {
      if (data) {
        this.model = data['code'];
        inputForm.form.controls[name].patchValue(data.name);
      }
    });
  }

  private searchSelect(model: any, dataList: any[], dataName: string, dataCode: string) {

    let popover = this.popoverCtrl.create(NinePage2, { dataList, dataName, dataCode });

    popover.present();

    popover.onDidDismiss((data) => {
      if (data) {
        this.model = data['code'];
      }
    });

  }

  public getEAFRestImage(imgSrcStr: string): string {
    return !ObjectsUtil.isEmptyObject(imgSrcStr) && EAFRestApi.getImageUrl(imgSrcStr);
  }

  // private changeValue(e: NgForm) {
  //   console.log('form before => ', e.form);
  //   if (e.form.controls['fku'].value === '' || e.form.controls['fku'].value == 'NaN') {
  //     e.form.patchValue({ fku: '0.00' }, { emitEvent: false, onlySelf: true });
  //   }
  //   let tmp = e.form.controls['fku'].value;
  //   console.log('tmp value before => ', tmp);
  //   while (tmp.indexOf(',') > -1) {
  //     tmp = tmp.replace(',', '');
  //   }

  //   if (tmp.indexOf('.') > -1) {
  //     let tmpNumber = parseFloat(tmp).toLocaleString(undefined, { maximumFractionDigits: 2 });
  //     tmp = tmp + '.00';
  //     console.log('tmp value after => ', tmp);
  //     e.form.patchValue({ fku: tmpNumber }, { emitEvent: false, onlySelf: true });
  //     console.log('form after => ', e.form);
  //   }
  //   else {
  //     let tmpNumber = parseFloat(tmp).toLocaleString(undefined, { maximumFractionDigits: 2 });
  //     console.log('tmp value after => ', tmp);
  //     e.form.patchValue({ fku: tmpNumber }, { emitEvent: false, onlySelf: true });
  //     console.log('form after => ', e.form);
  //   }
  // }

  // private changeValue(value: string) {
  //   let anotherFKINGTMP = NumberUtil.catchNumber(value) + '';
  //   if (anotherFKINGTMP.indexOf('.') > -1) {
  //     value = anotherFKINGTMP.substring(0, anotherFKINGTMP.indexOf('.') + 3);
  //   }
  //   console.log('current value => ', value);
  //   let tmp = NumberUtil.catchNumber(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
  //   console.log('return value => ', tmp);
  //   return tmp;
  // }
}