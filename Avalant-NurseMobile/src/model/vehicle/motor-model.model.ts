import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field, Id } from '../../services/eaf-rest/eaf-rest.decorators';

/**
 * Motor Model Model
 * 
 * @author NorrapatN
 * @since Mon Oct 16 2017
 */
@Table('ms_motor_model', {
  entityId: 'EN_171016160552877_v001',
  eafModuleId: 'MD117166333',
})
export class MotorModelModel extends EAFModuleBase {

  @Id('MODEL_ID')
  public modelId: string;

  @Field('MODEL_DESC')
  public modelName: string;

  @Field('BRAND_ID')
  public brandId: string;

}
