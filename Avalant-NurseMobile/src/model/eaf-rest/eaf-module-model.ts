import { IEAFModuleMetadata } from './eaf-module-metadata';

/**
 * EAF Module model (Interface)
 * 
 * @author NorrapatN
 * @since Tue May 30 2017
 */
export interface IEAFModuleModel {
  __eaf__: IEAFModuleMetadata;
  __eafmap__: { [key: string]: any };

  toJSON(): { [key: string]: any };
  toJSONString(): string;
}
