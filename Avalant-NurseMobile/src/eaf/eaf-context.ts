import { IEAFModuleMetadata } from '../model/eaf-rest/eaf-module-metadata';
import { EAFModuleClass } from '../services/eaf-rest/eaf-rest.decorators';
import { IEAFModuleModel } from '../model/eaf-rest/eaf-module-model';

/**
 * EAF Context
 * 
 * @author NorrapatN
 * @since Tue May 30 2017
 */
export class EAFContext {
  public static EAF_MODULE_MAP: { [eafModuleId: string]: IEAFModuleMetadata } = {};
  public static EAF_MODULE_LIST: IEAFModuleMetadata[] = [];

  public static addEAFModule(eafModule: IEAFModuleMetadata): void {
    EAFContext.EAF_MODULE_MAP[eafModule.eafModuleId] = eafModule;
    EAFContext.EAF_MODULE_LIST.push(eafModule);
  }

  public static findEAFModule(eafModuleId: string): IEAFModuleMetadata {
    return EAFContext.EAF_MODULE_MAP[eafModuleId];
  }

  public static findEAFModuleClass(eafModuleId: string): EAFModuleClass<IEAFModuleModel> {
    return EAFContext.EAF_MODULE_MAP[eafModuleId] && EAFContext.EAF_MODULE_MAP[eafModuleId].eafModuleClass;
  }

}
