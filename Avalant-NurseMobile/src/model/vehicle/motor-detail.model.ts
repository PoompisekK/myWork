import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Id, Field } from '../../services/eaf-rest/eaf-rest.decorators';

/**
 * Motor Detail Model
 * 
 * @author NorrapatN
 * @since Mon Oct 16 2017
 */
@Table('ms_motor_detail', {
  entityId: 'EN_171016164853387_v001',
  eafModuleId: 'MD1171649466'
})
export class MotorDetailModel extends EAFModuleBase {

  @Id('SUB_MODEL_ID')
  public subModelId: string;

  @Field('MODEL_ID')
  public modelId: string;

  @Field('BRAND_ID')
  public brandId: string;

  @Field('GOOD_WHOLE_SALE')
  public goodWholeSale: string;

  @Field('AVG_RETAIL')
  public avgRetail: string;

  @Field('AVG_WHOLE_SALE')
  public avgWholeSale: string;

  @Field('MOTOR_KEY')
  public motorKey: string;

  @Field('NEW_PRICE')
  public newPrice: string;

  @Field('ENGINE_DESC')
  public engineDesc: string;

  @Field('ENGINE_SIZE')
  public engineSize: string;

}
