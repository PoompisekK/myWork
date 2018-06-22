import { ShopTabModel } from './shop-tab.model';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field, Id } from '../../services/eaf-rest/eaf-rest.decorators';
import { OrganizationImage } from './organization-image.model';
import { EAFRestApi } from '../../constants/eaf-rest-api';
import { IMobileConfig } from './mobile-config.interface';
/**
 * Organization Data Model
 * 
 * @author NorrapatN
 * @since Fri May 19 2017
 */
@Table('ORGANIZATION', {
  eafModuleId: 'MD1171451846',
  entityId: 'EN_170412145055081_v001'
})
export class OrganizationModel extends EAFModuleBase {

  @Id('ID') public id: string;

  @Field('ABOUTUS') public aboutus: string;

  @Field('ADDRESS') public address: string;

  @Field('CODE') public code: string;

  @Field('CONTACTUS') public contactUs: string;

  @Field('DEFAULT_LANGUAGE') public defaultLanguage: string;

  @Field('DESCRIPTION') public description: string;

  @Field('HELP') public help: string;

  /**
   * Logo as Image key
   */
  @Field('LOGO') public logo: string;

  @Field('NAME') public name: string;

  @Field('OWNERPIC') public ownerpic: string;

  @Field('SHIPPING_POLICY') public shippingPolicy: string;

  @Field('SHOP_CONDITION') public shopCondition: string;

  @Field('THEME') public theme: string;

  // Use on web only !
  /* @Field('WEB_CONFIG', {
    isOnlyGui: true,// Don't save this field
  })
  public webConfigRaw: string; */

  private _mobileConfigRaw: string;

  @Field('MOBILE_CONFIG', {
    isOnlyGui: true,// Don't save this field
  })
  public mobileConfigRaw: string;

  public get mobileConfig(): IMobileConfig {
    try {
      return JSON.parse(this.mobileConfigRaw);
    } catch (err) {
      console.warn('⚠️ Cant parse mobile config : ', this.mobileConfigRaw);
      return null;
    }
  }

  /* public get iconPath(): string {
    let imObjt = this.organizationImage && this.organizationImage.length > 0 && this.organizationImage.find((item) => item.isLogo == 'Y');
    let logoPath = imObjt && EAFRestApi.getImageUrl(imObjt.imageKey);
    return logoPath;
  } */

  public get coverImage(): OrganizationImage[] {
    // let imgList = this.organizationImage && this.organizationImage.length > 0 && this.organizationImage.filter((item) => item.isLogo != 'Y');
    // let coverPath = imgList && imgList[0] && imgList[0].imageKey;
    // return EAFRestApi.getImageUrl(coverPath);
    if (this.organizationImage && this.organizationImage.length) {
      return this.organizationImage.filter(img => img.isLogo == 'N');
    } else {
      return null;
    }
  }

  public background: string;

  public shopTabs: ShopTabModel[];

  public organizationImage: OrganizationImage[];

  // @Field('LATITUDE') public latitude: string;
  // @Field('LONGTITUDE') public longtitude: string;
  // @Field('ORGSTATUS') public orgStatus: string;
  // @Field('MAPEMBEDCODE') public mapembedCode: string;
  // @Field('HOWTOBUY') public howtobuy: string;
  // @Field('POLICY') public policy: string;

}
