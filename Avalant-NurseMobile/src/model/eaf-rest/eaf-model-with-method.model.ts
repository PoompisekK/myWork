import { IEAFModuleModel } from './eaf-module-model';

/**
 * EAF Rest request model
 * 
 * @author NorrapatN
 * @since Tue May 30 2017
 */
export class EAFModelWithMethod {

  constructor(
    public eafModel: IEAFModuleModel,
    public method: 'INSERT' | 'UPDATE' | 'DELETE',
    public eafModuleId?: string,
  ) {

  }

  public overrideModuleId(id: string): this {
    this.eafModuleId = id;
    return this;
  }

}
