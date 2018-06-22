/**
 * Vehicle Brand Interface
 * 
 * @author NorrapatN
 * @since Fri Sep 29 2017
 */
export interface IVehicleBrandResponse {

  brandItems: IVehicleBrandItem[];

}

export interface IVehicleBrandItem {
  BrandCode: string;
  BrandName: string;
}