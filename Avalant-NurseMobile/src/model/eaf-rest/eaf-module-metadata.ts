import { EAFModuleClass } from '../../services/eaf-rest/eaf-rest.decorators';
import { IEAFModuleModel } from './eaf-module-model';
import { EAFModuleSubclassMetadata } from './eaf-module-subclass-metadata';
/**
 * 
 * @author NorrapatN
 * @since Tue May 30 2017
 */
export interface IEAFModuleMetadata {

  /**
   * EAF Entity ID
   */
  eafEntityId: string;

  /**
   * EAF Module ID
   */
  eafModuleId: string;

  /**
   * Table for this model
   */
  tableName: string;

  /**
   * Field list to Insert/Update
   */
  fieldList: string[];

  /**
   * Field list of ignored on save
   */
  onlyGuiFieldList: string[];

  /**
   * Class type that used by @Table()
   */
  eafModuleClass: EAFModuleClass<IEAFModuleModel>;

  /**
   * Class name of EAF Module
   */
  className: string;

  subModelMap: EAFModuleSubclassMetadata;

}
