import { IGenericResponse } from '../rest/generic-response.interface';

/**
 * Vehicle detail interface
 * 
 * @author NorrapatN
 * @since Wed Oct 04 2017
 */
export interface IVehicleDetail {

  brandId: string;
  brandName: string;
  modelId: string;
  modelName: string;
  subModelId: string;
  subModelName: string;
  motorYear: number;
  engineSize: number;
  engineDesc: string;
  avgRetail: number;
  avgWholeSale: number;
  goodRetail: number;
  goodWholeSale: number;
  newPrice: number;

}
