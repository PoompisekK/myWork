/**
 * Vehicle Model interface
 * 
 * @author NorrapatN
 * @since Fri Sep 29 2017
 */
export interface IVehicleModelResponse {

  modelList: IVehicleModel[];

}

export interface IVehicleModel {

  ModelId: number;
  ModelCode: string;
  ModelName: string;
  ThDesc: string;

}
