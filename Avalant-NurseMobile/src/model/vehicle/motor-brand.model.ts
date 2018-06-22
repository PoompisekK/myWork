import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field, Id } from '../../services/eaf-rest/eaf-rest.decorators';

/**
 * Motor Brand master
 * 
 * @author NorrapatN
 * @since Mon Oct 16 2017
 */
@Table('ms_motor_brand', {
  entityId: 'EN_171016144709977_v001',
  eafModuleId: 'MD1171447384',
})
export class MotorBrandModel extends EAFModuleBase {

  @Id('BRAND_ID')
  public brandId: string;

  @Field('BRAND_DESC')
  public brandName: string;

}
