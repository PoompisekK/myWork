import { EAFModuleBase } from '../../model/eaf-rest/eaf-module-base';
import { IEAFModuleMetadata } from '../../model/eaf-rest/eaf-module-metadata';
import { EAFRestUtil } from './eaf-rest.util';
import { EAFContext } from '../../eaf/eaf-context';
import { IEAFModuleModel } from '../../model/eaf-rest/eaf-module-model';
import { DateUtil } from '../../utilities/date.util';
import { NumberUtil } from '../../utilities/number.util';

/***
 * EAF Rest decorators file
 * 
 * @author NorrapatN
 * @since Mon May 29 2017
 */

/**
 * EAF Module class extends EAFModuleBase
 */
export type EAFModuleClass<T extends EAFModuleBase> = { new(): T };

export type TableOptions = {
  eafModuleId?: string,
  entityId?: string,
};

/**
 * Field Options
 */
export type FieldOptions = {
  fieldType?: FieldType,
  isOnlyGui?: boolean,
  isDebug?: boolean,
};

/**
 * Generate default Object structure of EAF Metadata
 */
function generateEAFMetadata(): IEAFModuleMetadata {
  return {
    eafModuleId: void 0,
    eafEntityId: void 0,
    tableName: void 0,
    fieldList: [],
    onlyGuiFieldList: [],
    className: void 0,
    eafModuleClass: void 0,
    subModelMap: {},
    // fieldMap: {},
  };
}

export enum FieldType {
  PK,
  STRING,
  NUMBER,
  BOOLEAN,
  DATE,
}

function createGetter(moduleFieldName: string, dataType: FieldType, isDebug: boolean = false) {

  let debugLogFn = isDebug ? (v) => {
    console.debug(`Invoked getter "${moduleFieldName}" value :`, v);
    console.trace();
    return v;
  } : (v) => v;

  switch (dataType) {
    case FieldType.PK:
      // tslint:disable-next-line:only-arrow-functions
      return function () {
        EAFRestUtil.createPropertyEAFMap(this, {});
        this['__eafmap__']['KEY'] = this['__eafmap__']['KEY'] || {};
        let id = this['__eafmap__']['KEY'][moduleFieldName] || this['__eafmap__'][moduleFieldName];
        return debugLogFn(NumberUtil.isValid(id) ? NumberUtil.convertToNumber(id, void 0) : id);
      };

    case FieldType.DATE:
      // tslint:disable-next-line:only-arrow-functions
      return function () {
        EAFRestUtil.createPropertyEAFMap(this, {});
        let date = new Date(this['__eafmap__'][moduleFieldName]);
        return debugLogFn(DateUtil.isValidDate(date) ? date : null);
      };

    case FieldType.NUMBER:
      // tslint:disable-next-line:only-arrow-functions
      return function () {
        EAFRestUtil.createPropertyEAFMap(this, {});
        return debugLogFn(NumberUtil.convertToNumber(this['__eafmap__'][moduleFieldName], void 0));
      };

    case FieldType.STRING:
      // tslint:disable-next-line:only-arrow-functions
      return function () {
        EAFRestUtil.createPropertyEAFMap(this, {});
        let value = this['__eafmap__'][moduleFieldName];
        return debugLogFn(value != null ? this['__eafmap__'][moduleFieldName] + '' : this['__eafmap__'][moduleFieldName]);
      };

    default:
      // tslint:disable-next-line:only-arrow-functions
      return function () {
        // console.debug('getter :', this);
        // Create property before use
        EAFRestUtil.createPropertyEAFMap(this, {});
        return debugLogFn(this['__eafmap__'][moduleFieldName]);
      };
  }
}

function createSetter(moduleFieldName: string, dataType: FieldType, isDebug: boolean = false) {

  let debugLogFn = isDebug ? (v) => {
    console.debug(`Invoked setter "${moduleFieldName}" value `, v);
    console.trace();
  } : () => void 0;

  switch (dataType) {
    case FieldType.PK:
      // tslint:disable-next-line:only-arrow-functions
      return function (value: number) {
        debugLogFn(value);
        EAFRestUtil.createPropertyEAFMap(this, {});
        if (this['__eafmap__']['KEY']) {
          this['__eafmap__']['KEY'] = this['__eafmap__'][moduleFieldName] || {};
          this['__eafmap__']['KEY'][moduleFieldName] = value + '';
        } else {
          this['__eafmap__'][moduleFieldName] = value + '';
        }
      };

    case FieldType.DATE:
      // tslint:disable-next-line:only-arrow-functions
      return function (value: Date) {
        debugLogFn(value);
        EAFRestUtil.createPropertyEAFMap(this, {});

        this['__eafmap__'][moduleFieldName] = DateUtil.formatDate(value);
      };

    case FieldType.NUMBER:
      // tslint:disable-next-line:only-arrow-functions
      return function (value: number) {
        debugLogFn(value);
        EAFRestUtil.createPropertyEAFMap(this, {});
        this['__eafmap__'][moduleFieldName] = value + '';
      };

    case FieldType.STRING:
      // tslint:disable-next-line:only-arrow-functions
      return function (value: any) {
        debugLogFn(value);
        EAFRestUtil.createPropertyEAFMap(this, {});
        this['__eafmap__'][moduleFieldName] = value != null ? value + '' : value;
      };

    default:
      // tslint:disable-next-line:only-arrow-functions
      return function (value: any) {
        debugLogFn(value);
        // Create property before use
        EAFRestUtil.createPropertyEAFMap(this, {});
        this['__eafmap__'][moduleFieldName] = value;
      };
  }
}

/**
 * EAF Module annotation (Decorator)
 * 
 * @param tableName Table name
 * @param tableOptions @see TableOptions
 */
export function Table(tableName?: string, tableOptions?: TableOptions) {

  return (ctor: EAFModuleClass<IEAFModuleModel>): void => {
    // Detect extended class name
    if ((ctor['__proto__'] !== EAFModuleBase)) {
      throw new Error(`😡 Class "${ctor.name}" using @EAFModule() decorator that required to extends from "EAFModuleBase". !`);
    }

    // Put eaf details field
    let eafModuleMeta: IEAFModuleMetadata = ctor.prototype['__eaf__'] || EAFRestUtil.createPropertyEAF(ctor.prototype, generateEAFMetadata());

    eafModuleMeta.eafModuleId = tableOptions && tableOptions.eafModuleId;
    eafModuleMeta.eafEntityId = tableOptions && tableOptions.entityId;
    eafModuleMeta.tableName = tableName;
    eafModuleMeta.eafModuleClass = ctor;
    eafModuleMeta.className = ctor.name;

    EAFContext.addEAFModule(eafModuleMeta);

    // Assign to constructor prototype
    Object.defineProperty(ctor.constructor.prototype, '__eaf__', {
      value: eafModuleMeta,
      enumerable: false,
    });
    // ctor.constructor.prototype['__eaf__'] = eafModuleMeta;

    // Add static readonly ENTITY_ID into class
    Object.defineProperty(ctor, 'ENTITY_ID', {
      value: (tableOptions && tableOptions.entityId) || ctor['ENTITY_ID'],
      enumerable: false,
      writable: false,
    });
    Object.defineProperty(ctor, 'MODULE_ID', {
      value: (tableOptions && tableOptions.eafModuleId) || ctor['MODULE_ID'],
      enumerable: false,
      writable: false,
    });

  };
}

/**
 * EAF Field decorator
 * 
 * ** With default field type is String
 * 
 * @see http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-ii
 * @param moduleFieldName Module field name
 */
export function Field(moduleFieldName: string, fieldOptions?: FieldOptions) {
  fieldOptions = fieldOptions || {};
  // tslint:disable-next-line:only-arrow-functions
  return <PropertyDecorator>function (target: Object, field: string): void {
    // console.debug('Target :', target);
    // console.debug('field :', field);

    // Trying to access EAF metadata to store field name
    let eafModuleMeta: IEAFModuleMetadata = target['__eaf__'] || generateEAFMetadata();

    // if (fieldOptions.fieldType !== FieldType.PK) {
    //   eafModuleMeta.fieldList.push(moduleFieldName);
    // }
    if (!fieldOptions.isOnlyGui) {
      eafModuleMeta.fieldList.push(moduleFieldName);
    } else {
      eafModuleMeta.fieldList.push(moduleFieldName); // Push to field list.
      eafModuleMeta.onlyGuiFieldList.push(moduleFieldName); // And then push this list too !.
    }

    // Default field type is String
    if ([null, undefined].indexOf(fieldOptions.fieldType) > 0) {
      fieldOptions.fieldType = FieldType.STRING;
    }

    // target is parent class
    // target.construtor is Class of current
    target.constructor.prototype['__eaf__'] = eafModuleMeta;

    /* Implement Getter / Setter for EAFModule */

    // Getter
    let getter = createGetter(moduleFieldName, fieldOptions.fieldType, fieldOptions.isDebug);

    // Setter
    let setter = createSetter(moduleFieldName, fieldOptions.fieldType, fieldOptions.isDebug);

    // Compatible with Multi @Field()
    let fieldDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(target, field);
    if (fieldDescriptor) {
      if (fieldDescriptor.get instanceof Function) {
        // tslint:disable-next-line:only-arrow-functions
        getter = function () {
          return createGetter(moduleFieldName, fieldOptions.fieldType).call(this) || fieldDescriptor.get.call(this);
        };
      }
      if (fieldDescriptor.set instanceof Function) {
        // tslint:disable-next-line:only-arrow-functions
        setter = function (value) {
          fieldDescriptor.set.call(this, value);
          createSetter(moduleFieldName, fieldOptions.fieldType).call(this, value);
        };
      }
    }

    Object.defineProperty(target, field, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
    // }
  };

}

/**
 * EAF ID decorator
 * 
 * @param fieldOptions (Optional) Field options
 */
export function Id(fieldName: string = 'ID', fieldOptions?: FieldOptions) {
  fieldOptions = fieldOptions || {};
  fieldOptions.fieldType = FieldType.PK;

  return Field(fieldName, fieldOptions);
}

/**
 * Specification sub model to map with
 * Sub model must be Array list
 * 
 * @param subClass Class model to map
 * @param eafModuleId (Optional) Map with Module ID; If nothing it will find automatically
 */
export function SubModel(subClass: EAFModuleClass<IEAFModuleModel>, eafModuleId?: string) {
  // tslint:disable-next-line:only-arrow-functions
  return <PropertyDecorator>function (target: Object, field: string): void {
    // console.debug('Target :', target);
    // console.debug('Field :', field);
    // console.debug('Sub class :', subClass);

    // Trying to access EAF metadata to store sub model
    let eafModuleMeta: IEAFModuleMetadata = target['__eaf__'] || generateEAFMetadata();

    eafModuleMeta.subModelMap = eafModuleMeta.subModelMap || {};

    eafModuleId = eafModuleId || subClass.prototype['__eaf__'].eafModuleId;
    if (eafModuleId) {
      eafModuleMeta.subModelMap[eafModuleId] = {
        fieldName: field,
        clazz: subClass,
      };
    }

    // target is parent class
    // target.construtor is Class of current
    target.constructor.prototype['__eaf__'] = eafModuleMeta;

  };
}