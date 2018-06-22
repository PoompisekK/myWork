import { Table, Id, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';

/**
 * Motor Sub Model Model
 * 
 * @author NorrapatN
 * @since Mon Oct 16 2017
 */
@Table('ms_motor_sub_model', {
  entityId: 'EN_171016163924173_v001',
  eafModuleId: 'MD1171640504'
})
export class MotorSubModelModel extends EAFModuleBase {

  @Id('SUB_MODEL_ID')
  public subModelId: string;

  @Field('MODEL_ID')
  public modelId: string;

  @Field('SUB_MODEL_DESC')
  public subModelName: string;

}
