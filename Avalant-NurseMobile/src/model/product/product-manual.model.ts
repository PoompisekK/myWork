import { EAFManualModelBase } from '../eaf-rest/eaf-manual-model-base';
import { DateUtil } from '../../utilities/date.util';
/**
 * Product freaking model 
 * 
 * @description  
 *   ฟิลด์ ใน Model นี้อาจจะไม่ Update เท่าไร  เพราะทางต้นทางที่ทำ Servlet ที่จะ Response model นี้มาให้มักจะไม่บอกว่ามีการเปลี่ยนอะไรบ้าง
 * เหนื่อยแล้ว ต้องมาเปลี่ยนตาม  ใครมาทำต่อก็ เช็คด้วยแล้วกันนะว่า ตอนที่คุณมากทำต่อน่ะ  Data model ที่ response มาตรงกันไหม
 * 
 * @author NorrapatN
 * @since Tue Jun 20 2017
 */
export class ProductManualModel extends EAFManualModelBase {
  private begin_date: string;
  private end_date: string;
  public product_id: number;

  public product_detail: IProductItemDetail[];
  public product_image: IProductImage[];
  public product_item_detail: IProductItemDetail[];
  public product_item_id: number;
  public product_item_name: string; // Use this
  public product_related: any[];

  public name: string;
  public ref_product_id: number;
  public ref_product_item_id: number;
  public ref_shop_type_id: number;
  private reserved_start_date: string;
  private reserved_end_date: string;
  public shop_id: number;
  public shop_path: string;

  public fullprice: number;

  // Getter / Setter
  get beginDate(): Date {
    return DateUtil.stringToDate(this.begin_date);
  }

  set beginDate(value: Date) {
    this.begin_date = DateUtil.dateToString(value);
  }

  get endDate(): Date {
    return DateUtil.stringToDate(this.end_date);
  }

  set endDate(value: Date) {
    this.begin_date = DateUtil.dateToString(value);
  }

  get reservedStartDate(): Date {
    return DateUtil.stringToDate(this.reserved_start_date);
  }

  set reservedStartDate(value: Date) {
    this.reserved_start_date = DateUtil.dateToString(value);
  }

  get reservedEndDate(): Date {
    return DateUtil.stringToDate(this.reserved_end_date);
  }

  set reservedEndDate(value: Date) {
    this.reserved_end_date = DateUtil.dateToString(value);
  }

}

export interface IProductImage extends EAFManualModelBase {
  image_key: string;
  name: string;
}

export interface IProductItemDetail extends EAFManualModelBase {
  product_detail_id: string;
  product_detail_message: string;
  product_detail_title: string;
  product_detail_media: IProductItemDetailMedia[];
  product_item_detail_id: string;
  product_item_detail_media: IProductItemDetailMedia[];
}

export interface IProductItemDetailMedia extends EAFManualModelBase {
  id: number;
  name: string;
  media_type_id: number;
  image_key?: string;
  video_link?: string;
  location?: string;
  product_detail_image_id: string;
  product_detail_media_type_id: string;
  locations: any[];
  videolink: string;
}
