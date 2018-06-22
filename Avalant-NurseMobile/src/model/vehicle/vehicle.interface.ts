/**
 * Vehicle Interface
 * 
 * @author NorrapatN
 * @since Mon Oct 02 2017
 */
export interface IVehicle {

  ModelId: number;
  ModelCode: string;
  BrandCode: string;

  ThDesc: string;
  EnDesc: string;

  LicenseType: string;

  Gear: string;
  Cc: string;
  Weight: string;

  CarYear: string;
  Status: string;
  VehicleType: string;

}