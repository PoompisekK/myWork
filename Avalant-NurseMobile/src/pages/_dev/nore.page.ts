import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, App, IonicPage, NavController } from 'ionic-angular';

import { UserModel } from '../../model/user/user.model';
import { EAFRestService } from '../../services/eaf-rest/eaf-rest.service';
import { ObjectsUtil } from '../../utilities/objects.util';
import { RxJSUtil } from '../../utilities/rxjs.util';
import { PaymentSuccessPage } from '../payment-page/payment-success.page';

/**
 * Nore test page
 * @author NorrapatN
 * @since Mon May 29 2017
 */
@IonicPage({
  segment: 'test/nore',
})
@Component({
  selector: 'nore-page',
  templateUrl: './nore.page.html',
})
export class NoreTestPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('myCanvas')
  private myCanvas: ElementRef;

  private getEntity$;
  
  constructor(
    private appCtrl: App,
    private navCtrl: NavController,
    private eafRestService: EAFRestService,
    private alertCtrl: AlertController,
  ) { }

  public ngOnInit(): void {
    // let testData = {
    //   FI1: 'field1Data',
    //   FI2: 'field2Data',
    // };
    // this.testData = new TestModel(testData);

    // console.debug('testModel :', this.testData);
    // console.debug('eafModuleId :', this.testData.eafModuleId);
    // console.debug('Field 1 :', this.testData.field1);
    // console.debug('Field 2 :', this.testData.field2);

  }

  public ngOnDestroy(): void {
    this.destroyCanvas(this.myCanvas.nativeElement);
  }

  public ngAfterViewInit(): void {
    this.initCanvas(this.myCanvas.nativeElement);
  }

  private rest(): void {
    this.eafRestService.searchEntity(UserModel, 'EN_170427181841352_v001', {
      MEMBEREMAIL: 'siam.arm@gmail.com'
    }, {
        page: '1',
        volumePerPage: '200'
      }).subscribe((response) => {
        console.debug('response :', response);
      }, (error) => {
        console.warn('Error : ', );
      });
  }

  private makeObject(): void {
    let test = new UserModel();

    test.custFname = 'test';
    test.custLname = 'Lname';
    // test.ybatUserInfoM.ybatUserAttachmentInfo.push(new YBatUserAttachmentModel());
    console.debug('Test user model :', test);

    let cloned = ObjectsUtil.deepClone(test);
    // cloned.ybatUserInfoM.ybatUserAttachmentInfo[0].status = 'HOHOSDIJ:LSKDF';
    console.debug('Cloned Object : ', cloned);

    // let province = new ProvinceMasterModel();

    // let mapped = EAFRestUtil.buildEAFRequestModel([
    //   new EAFModelWithMethod(test, 'INSERT'),
    //   new EAFModelWithMethod(province, 'INSERT'),
    // ]);

    // console.debug('MApped : \n' + JSON.stringify(mapped, null, 2));
  }

  private getEntity(): void {
    this.getEntity$ = this.eafRestService.getEntityMapByModules('EN_170427181841352_v001', {
      MD1171819565: UserModel,
    }, { ID: '1' }).subscribe((response) => {
      console.debug('Get entity response :', response);
    }, error => {
      console.warn('Error => ', error);
    });
  }

  private stop(): void {
    if (this.getEntity$) {
      this.getEntity$.unsubscribe();
    }
  }

  private initCanvas(canvas: HTMLCanvasElement): void {
    console.debug('Canvas :', canvas);
    this.ctx = canvas.getContext('2d');

    canvas.addEventListener('touchstart', this.touchStart, false);
    canvas.addEventListener('touchmove', this.touchMove, false);
    canvas.addEventListener('touchend', this.touchEnd, false);
  }

  private ctx: CanvasRenderingContext2D;
  private lastX: number;
  private lastY: number;
  private touched: boolean = false;

  private getTouchPosition = ((e: TouchEvent) => {
    e = e || <TouchEvent>event;

    let x: number, y: number;

    if (e.touches) {
      if (e.touches.length == 1) { // Only deal with one finger
        let touch = e.touches[0]; // Get the information for finger #1
        x = touch.pageX - (<any>touch.target).offsetLeft;
        y = touch.pageY - (<any>touch.target).offsetTop;
      }
    }

    return { x, y };
  }).bind(this);

  private draw = ((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isTouch: boolean) => {
    // console.debug('Draw');
    // console.debug('💭 isTouch :', isTouch);

    if (isTouch) {
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.moveTo(this.lastX, this.lastY);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.stroke();
    }
    this.lastX = x;
    this.lastY = y;
  }).bind(this);

  private touchStart = ((e: TouchEvent) => {
    // console.debug('💭 Touch Start');

    this.touched = true;
    let { x, y } = this.getTouchPosition(e);
    this.draw(this.ctx, x, y, false);
  }).bind(this);

  private touchMove = ((e: TouchEvent) => {
    // console.debug('💭 Touch Move');

    if (this.touched) {
      let { x, y } = this.getTouchPosition(e);
      this.draw(this.ctx, x, y, true);
    }
  }).bind(this);

  private touchEnd = ((e: TouchEvent) => {
    // console.debug('💭 Touch End');

    this.touched = false;
  }).bind(this);

  private destroyCanvas(canvas: HTMLCanvasElement): void {
    console.debug('Destroying Canvas');

    canvas.removeEventListener('touchstart', this.touchStart);
    canvas.addEventListener('touchmove', this.touchMove);
    canvas.addEventListener('touchend', this.touchEnd);
  }

  private waterfallTesting(): void {
    RxJSUtil.waterfall([
      () => {
        console.debug('Request 1');
        return this.eafRestService.getEntityMapByModules('EN_170427181841352_v001', {
          MD1171819565: UserModel,
        }, { ID: '1' });
      },
      (result1) => {
        console.debug('Result 1 :', result1);
        console.debug('Request 2');
        return this.eafRestService.getEntityMapByModules('EN_170427181841352_v001', {
          MD1171819565: UserModel,
        }, { ID: '2' });
      },
    ]).subscribe((result) => {
      console.debug('Waterfall finished :', result);
    });
  }

  private testPaymentSuccess(): void {
    let orderDataMocked = {
      "orderhead": {
        "ID": 22240,
        "SHOPID": 475,
        "ORDERCODE": "CE170706000401",
        "ORDERDATE": "2017-07-06",
        "ORDERSTATUS": 3,
        "MEMBERID": 16,
        "ADDRESS": "500 SSSSSSSSSSSSSSSSSSSSSSS 23123 null ",
        "PROVINCEID": "71",
        "POSTCODE": "71150",
        "VATAMT": 0.00,
        "NETAMT": 1.00,
        "CUSTFNAME": "Bundit3333",
        "CUSTLNAME": "Ngamkam333",
        "ZIPCODE": "71150",
        "SHIPPINGAMT": 0.0,
        "MOBILE": "0802806888",
        "TOTALAMT": 1.0,
        "EMAIL": "admin",
        "PHONE": "025694979",
        "ITEMAMT": 1,
        "CUSTOMER_TYPE": "I",
        "STATUS_CODE": "3",
        "DISTRICT_CODE": "7102",
        "SUBDISTRICT_CODE": "710201",
        "PROMO_DISCOUNT": 0.0,
        "PRIVELEGE_DISCOUNT": 0.0,
        "COUPON_DISCOUNT": 0.0,
        "ORG_ID": 2
      },
      "orderlines": [{
        "ID": 21740,
        "ORDERID": 22240,
        "SEQNO": 0,
        "LINETYPE": 4,
        "LINEDESC": "shipping",
        "PRODUCTPRICE": 0.0,
        "LINEPRICE": 0.0,
        "LINESTATUS": 1,
        "PURCHASETYPE": 5,
        "VAT_PRICE": 0.0,
        "DISCOUNT_PRICE": 0.0
      }, {
        "ID": 21741,
        "ORDERID": 22240,
        "SEQNO": 0,
        "LINETYPE": 1,
        "PRODUCTID": 5980,
        "LINEDESC": "test 05072017420",
        "PRODUCTAMT": 1,
        "PRODUCTPRICE": 1.0,
        "LINEPRICE": 1.0,
        "LINESTATUS": 1,
        "PURCHASETYPE": 5,
        "PRODUCT_ITEM_ID": 9966,
        "VAT_PRICE": 0.0,
        "PROMO_DISCOUNT": 0.0,
        "PRIVELEGE_DISCOUNT": 0.0,
        "COUPON_DISCOUNT": 0.0,
        "BUILDING": "สิริกรินชัย"
      }, {
        "ID": 21742,
        "ORDERID": 22240,
        "SEQNO": 0,
        "LINETYPE": 2, // 
        "LINEDESC": "Bundit3333 Ngamkam333",
        "LINESTATUS": 1,
        "BUSINESS_USER_ID": 16,
        "EVENT_STATUS": "WAIT", // สถานะ
        "BARCODE": "10300593-45e1-40b0-abdf-0074fdb82fb9",
        "WAIT_SEQ": 4 // ลำดับ
      }
      ],
      "orderAddresses": [],
      "taxInvoiceHead": {
        "taxInvoiceId": 12881,
        "orderheadId": 22240,
        "invoiceNo": "INV1707002281",
        "taxinvoiceNo": "TAXINV1707002281"
      },
      "responseStatus": "SUCCESS"
    };

    this.navCtrl.push(PaymentSuccessPage, {
      order: orderDataMocked,
      title: 'หลักสูตร',
      showSummary: true,
      haveHeader: true,
      canGoBack: true, // For debug
    });

  }

  private getNotification(): void {
    // this.notification.requestNotifications();
  }

}

// abstract class EAFModuleBase {
//   eafModuleId: string;
// }

// @Table('MD999999999', 'TABLEEE')
// class TestModel extends EAFModuleBase {

//   constructor(
//     options?
//   ) {
//     super();
//     if (options) {
//       Object.assign(this, options);
//     }
//   }

//   @Field('FI1')
//   public field1: string;

//   @Field('FI2')
//   public field2: string;
// }
