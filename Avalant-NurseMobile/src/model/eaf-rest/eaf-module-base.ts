import { IEAFModuleMetadata } from './eaf-module-metadata';
import { IEAFModuleModel } from './eaf-module-model';
import { isDev } from '../../constants/environment';
import { ObjectsUtil } from '../../utilities/objects.util';

/**
 * EAF Module Base
 * 
 * Entity model class must extends this
 * 
 * @author NorrapatN
 * @since Mon May 29 2017
 */
export abstract class EAFModuleBase implements IEAFModuleModel {

  /**
   * Entity ID from "@Table()" will store here
   */
  public static ENTITY_ID: string;
  public static MODULE_ID: string;

//   /**
//    * @deprecated Please use ENTITY_ID instead.
//    */
//   public static get ENTITY(): string {
//     if (isDev())
//       console.warn(`⚠️ This static field "ENTITY" is deprecated. Please use "entityId" in "@Table()" instead.\n
//   Example :
//     @Table('tableName', {
//       eafModuleId: 'MDxxxxxxxxx',
//  %c-->  entityId: 'ENxxxxxxxxx',%c
//     })\n\n`, 'font-weight: bold; background-color: yellow', 'font-weight: initial; background-color: initial', this.name);
//     console.warn(`⚠️ To get "ENTITY" use "ENTITY_ID" instead.
//   For example : %clet entityId = ClassModel.ENTITY_ID; 
// `, 'font-weight: bold; background-color: yellow');

//     return this.ENTITY_ID;
//   }

//   public static set ENTITY(value: string) {
//     if (isDev())
//       console.warn(`⚠️ This static field "ENTITY" is deprecated. Please use "entityId" in "@Table()" instead.\n
//   Example :
//     @Table('tableName', {
//       eafModuleId: 'MDxxxxxxxxx',
//  %c-->  entityId: 'ENxxxxxxxxx',%c
//     })\n\n`, 'font-weight: bold; background-color: yellow', 'font-weight: initial; background-color: initial', this.name);

//     this.ENTITY_ID = value;
//   }

  public __eaf__: IEAFModuleMetadata;
  public __eafmap__: { [key: string]: any };

  public toJSON(): { [key: string]: any } {
    let obj = {};
    // let fieldList: string[] = [];
    for (let field in this) {
      if (typeof this[field] !== 'function' && ['__eaf__', '__eafmap__'].indexOf(field) < 0) {
        // fieldList.push(field);
        obj[<string>field] = ObjectsUtil.deepClone(this[field]);
      }
    }

    // fieldList.forEach((field) => {
    //   obj[field] = this[field];
    // });
    return obj;
  }

  public toJSONString(prettyPrint: boolean = false): string {
    return JSON.stringify(this.toJSON(), null, prettyPrint ? 2 : 0);
  }
}
