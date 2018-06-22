import { EAFModuleClass } from '../../services/eaf-rest/eaf-rest.decorators';
import { IEAFModuleModel } from './eaf-module-model';
/***
 * EAF Module Subclass metadata
 * 
 * @author NorrapatN
 * @since Thu Jun 15 2017
 */

export type EAFModuleSubclassMetadata = { [eafModuleId: string]: IEAFSubclassMetadata };

export interface IEAFSubclassMetadata {
  fieldName: string;
  clazz: EAFModuleClass<IEAFModuleModel>;
}
