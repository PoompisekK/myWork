import { Injectable } from '@angular/core';
import { TranslationProvider } from 'angular-l10n';
import { LocalStorageService } from 'ngx-Webstorage';
import { Observable } from 'rxjs';

import { AppConstant } from '../../constants/app-constant';
import { HttpService } from '../http-services/http.service';

// TODO: (NorrapatN) : Use Ionic Storage cordova plugin

/**
 * UEARN Customized Translation Provider
 * 
 * @author NorrapatN
 * @since Tue Aug 22 2017
 */
@Injectable()
export class UearnTranslationProvider implements TranslationProvider {

  private getLanguageVersion(language: string): string {
    return this.localStorage.retrieve(AppConstant.LOCAL_STORAGE_KEY.UEARN_LANGUAGE_VERSION_KEY + language) || '0';
  }

  private setLanguageVersion(language: string, value: string) {
    this.localStorage.store(AppConstant.LOCAL_STORAGE_KEY.UEARN_LANGUAGE_VERSION_KEY + language, value);
  }

  constructor(
    private localStorage: LocalStorageService,
    private http: HttpService,
    // private eafRest: EAFRestService,
  ) {
    console.log("UearnTranslationProvider");
  }

  public getTranslation(language: string, args: any): Observable<any> {
    let languageTranslate = {};
    let dmpTranslate = this.DMPTranslation(language, args);
    let hcmTranslate = this.HCMTranslation(language, args).map(resp => resp.data);
    return dmpTranslate;

    // return Observable.create(observer => {
    //   Observable.forkJoin([
    //     dmpTranslate,
    //     hcmTranslate
    //   ]).map((data: any[]) => {
    //     const allResp = Object.assign({}, ...data);
    //     console.log("Observable.forkJoin.map :", allResp);
    //     return allResp;
    //   }).subscribe(resp => {
    //     console.log("Observable.forkJoin :", resp);
    //     observer.next(resp);
    //   });
    // });

    // return Observable.create((observer) => {
    //   Observable.merge(dmpTranslate, hcmTranslate).subscribe(resp => {
    //     console.log("Observable.merge :", resp);
    //     observer.next(resp);
    //   });
    // });
  }

  private HCMTranslation(language: string, args: any): Observable<any> {
    return Observable.create((observer) => {
      setTimeout(() => {
        observer.next({
          "messageCode": 0,
          "message": "",
          "data": {
            "approve": {
              "next": "ถัดไป",
              "myTask": "งานของฉัน",
              "show": "แสดง",
              "employee": "พนักงาน",
              "noRecordFound": "ไม่พบข้อมูล",
              "search": "ค้นหา..",
              "leaveType": "ประเภทการลา",
              "approveLeave": "อนุมัติการลา",
              "action": "การดำเนินการ",
              "previous": "ก่อนหน้านี้",
              "priority": "ลำดับความสำคัญ",
              "entries": "รายการ",
              "delegateTask": "มอบหมายงาน",
              "detail": "รายละเอียด",
              "startDate": "เริ่มวันที่"
            },
            "assignment": {
              "cancel": "ยกเลิก",
              "submit": "ส่ง",
              "save": "บันทึก",
              "outBox": "กล่องขาออก",
              "cofirmDeleteFile": "คุณต้องการจะลบไฟล์หรือไม่",
              "delete": "ลบ",
              "search": "ค้นหา",
              "deadline": "วันกำหนดส่ง",
              "noItemsFound": "ไม่พบข้อมูล",
              "topic": "หัวข้อ",
              "location": "ตำแหน่งที่ตั้ง",
              "time": "เวลา",
              "detail": "รายละเอียด",
              "inbox": "กล่องขาเข้า",
              "assignTo": "กำหนดให้"
            },
            "leave": {
              "next": "ถัดไป",
              "myHistory": "ประวัติส่วนตัว",
              "other": "อื่นๆ",
              "submit": "ส่ง",
              "personalLeave": "ลากิจ",
              "endDate": "สิ้นสุดวันที่",
              "pending": "อยู่ในระหว่างการดำเนินการ",
              "show": "แสดง",
              "myNotify": "แจ้งเตือนของฉัน",
              "sickLeave": "ลาป่วย",
              "notifyOthers": "แจ้งอื่นๆ",
              "carryOn": "ดำเนินการแล้ว",
              "noRecordFound": "ไม่พบข้อมูล",
              "search": "ค้นหา",
              "annaulLeave": "ลาหยุดประจำปี",
              "delegrateUser": "ตัวแทนผู้ใช้งาน",
              "myDelegate": "ตัวแทนของฉัน",
              "getWellSoon": "เร็วๆ นี้",
              "notice": "หมายเหตุ",
              "calendar": "ปฏิทิน",
              "amount": "จำนวน",
              "period": "ระยะเวลา",
              "previous": "ก่อนหน้านี้",
              "morning": "ตอนเช้า",
              "afternoon": "ตอนบ่าย",
              "entries": "รายการ",
              "pleaseSelect": "โปรดเลือก",
              "complete": "สำเร็จ",
              "urgentRequest": "คำขอด่วน",
              "startDate": "เริ่มวันที่",
              "typeLeave": "ประเภทการลา",
              "status": "สถานะ"
            },
            "meeting?": {
              "search": "ค้นหา"
            },
            "payroll": {
              "income": "รวมรายได้",
              "total": "ทั้งหมด",
              "deduction": "เงินหัก",
              "rate": "อัตรา",
              "vat": "ภาษี",
              "description": "รายละเอียด",
              "salary": "เงินเดือน"
            },
            "login": {},
            "meeting": {
              "cancel": "ยกเลิก",
              "submit": "ส่ง",
              "endDate": "สิ้นสุดวันที่",
              "inviteTo": "เรียนเชิญ",
              "outBox": "กล่องขาออก",
              "showing ,meeting": "แสดง...ถึง...จากทั้งหมด...รายการ",
              "topic": "หัวข้อ",
              "location": "ตำแหน่งที่ตั้ง",
              "detail": "รายละเอียด",
              "time": "เวลา",
              "inbox": "กล่องขาเข้า",
              "startDate": "เริ่มวันที่"
            },
            "benefit": {
              "next": "ถัดไป",
              "amount": "จำนวน",
              "showing ,benefit": "แสดง...ถึง...จากทั้งหมด...รายการ",
              "show": "แสดง",
              "type": "ประเภท",
              "noRecordFound": "ไม่พบการบันทึก",
              "entries": "รายการ",
              "search": "ค้นหา",
              "view": "ดู",
              "benefitDetail": "รายละเอียดสิทธิประโยชน์",
              "payDate": "วันที่ชำระ"
            },
            "workforceHome": {
              "next": "ถัดไป",
              "previous": "ก่อนหน้านี้",
              "myLeave": "การลาของฉัน",
              "approve": "อนุมัติ , รับรอง",
              "myCalendar": "ปฏิทิน"
            },
            "register": {}
          }
        });
      }, 2000);
    });
  }

  private DMPTranslation(language: string, args: any): Observable<any> {
    // For using Manual servlet these arguments will come from Localization service.
    let url: string = '';
    console.log("getTranslation args :", args);
    switch (args.type) {
      case "WebAPI":
        url += args.path + language;
        break;
      default:
        url += args.prefix + language + "." + args.dataFormat;
    }

    return this.http.httpGetObservable(url, {
      cacheFlag: 'Y',
      cacheVersion: this.getLanguageVersion(language),
    })
      // return this.eafRest.requestManualServlet('GET', 'LanguageService', null, {
      //   params: {
      //     language,
      //     ...args,
      //   },
      //   authMethod: ManualServletAuthMethod.NO_AUTH,
      // })
      .map((response) => {
        // Extract version on header
        const cacheVersion: string = response.headers.get('dmp-servercacheversion');
        const responseJson: { [key: string]: string } = response.json();

        if (responseJson.status === 'success' && this.getLanguageVersion(language) === cacheVersion) {
          // If existed in cache go on
          return this.localStorage.retrieve(AppConstant.LOCAL_STORAGE_KEY.CACHE_LANGUAGE + language);
        } else if (typeof responseJson.status === 'string') {
          console.warn('⚠️ Response from translation provider is not success');
          console.warn('  response :', responseJson);
        }
        else {
          console.debug('  Got new translation object');
          this.setLanguageVersion(language, cacheVersion);
        }

        // return Language object
        return response.json();
      })
      .do((data) => {
        // Save Language to cache (Localstorage)
        this.localStorage.store(AppConstant.LOCAL_STORAGE_KEY.CACHE_LANGUAGE + language, data);
      })
      .catch((error) => {
        console.warn('⚠️ Error while loading translation :', error);

        return Observable.of(this.localStorage.retrieve(AppConstant.LOCAL_STORAGE_KEY.CACHE_LANGUAGE + language));
      });
  }

}
