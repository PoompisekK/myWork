/**
 * Vehicle Model
 * 
 * @author NorrapatN
 * @since Wed Sep 27 2017
 */
export class VehicleDataModel {

  public id: string;

  public displayName: string;

  public brandId: string;
  public brandName: string;

  public modelId: string;
  public modelName: string;

  public subModelId: string;
  public subModelName?: string;

  public year: number;

  public imageUrl: string;

  constructor(obj?: VehicleDataModel) {
    if (!!obj) {
      Object.assign(this, obj);
    }
  }

  public toString() {
    return `${this.brandName} ${this.modelName} ${this.subModelName}`;
  }

}
