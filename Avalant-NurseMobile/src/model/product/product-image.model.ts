import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';
import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
/**
 * Product Image MOdule model
 * 
 * @author NorrapatN
 * @since Tue Jun 13 2017
 */
@Table('PRODUCTIMAGE', {
  eafModuleId: 'MD1171827432',
  entityId: 'EN_170405095846823_v001'
})
export class ProductImageModel extends EAFModuleBase {

  @Field('FILENAME')
  public fileName: string;

  @Field('PRODUCTID')
  public productId: string;

  @Field('SRCFILENAME')
  @Field('SRCFILENAME_NAME')
  public srcFileName: string;

  // public srcFileNameName: string;

  @Field('TYPEFILE')
  public fileType: string;

  @Field('IMAGE_KEY')
  public imageKey: string;

}
