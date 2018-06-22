import { IEAFRestHeader } from '../../model/eaf-rest/eaf-rest-header';
import { EAFRestApi } from '../../constants/eaf-rest-api';
import { IEAFModuleModel } from '../../model/eaf-rest/eaf-module-model';
import { EAFModuleBase } from '../../model/eaf-rest/eaf-module-base';
import { EAFModuleClass } from './eaf-rest.decorators';
import { ObjectsUtil } from '../../utilities/objects.util';
import { EAFModelWithMethod } from '../../model/eaf-rest/eaf-model-with-method.model';
import { EAFRestResponse } from '../../model/eaf-rest/eaf-rest-response.model';
import { EAFRestEntityResponse } from '../../model/eaf-rest/eaf-rest-entity-response.model';
import { EAFContext } from '../../eaf/eaf-context';
import { IEAFModuleMetadata } from '../../model/eaf-rest/eaf-module-metadata';

/**
 * EAF Rest Utilities
 * 
 * @author NorrapatN
 * @since Mon May 29 2017
 */
export class EAFRestUtil {

    private constructor() { }

    /**
     * Auto fix for Search options
     * 
     * @param searchOption EAF Rest search options
     */
    public static safeSearchOption(searchOption: IEAFRestHeader): IEAFRestHeader {

        if (searchOption) {
            // Convert to string
            searchOption.page = searchOption.page || 1;
            searchOption.volumePerPage = searchOption.volumePerPage || 0; // FAK
        }

        let search: IEAFRestHeader = {
            page: '1',
            volumePerPage: '0',
            handleForm: 'Y',
            cbMethod: EAFRestApi.CALLBACK_METHOD,
            ...searchOption
        };
        // Object.assign(search, searchOption);
        return search;
    }

    /**
     * Auto fix for Save options
     * 
     * @param searchOption EAF Rest search options
     */
    public static safeSaveOption(searchOption: IEAFRestHeader): IEAFRestHeader {
        return {
            handleForm: 'Y',
            cbMethod: EAFRestApi.CALLBACK_METHOD,
            ...searchOption,
        };
    }

    /**
     * Create property "__eaf__" in EAF Module model
     * @param target EAF Module model
     * @param value object
     * @param force Overwrite
     */
    public static createPropertyEAF(target: IEAFModuleModel, value: Object, force?: boolean): IEAFModuleMetadata {
        if (force || !('__eaf__' in target)) {
            Object.defineProperty(target, '__eaf__', {
                value,
                enumerable: false,
            });
        }

        return target['__eaf__'];
    }

    /**
     * Create property "__eafmap__" in EAF Module model
     * 
     * @param target EAF Module model
     * @param value Response object from EAF Rest
     * @param force Overwrite create property to target object when True
     */
    public static createPropertyEAFMap(target: IEAFModuleModel, value: Object, force?: boolean): void {
        if (force || !('__eafmap__' in target)) {

            /*
             * We will pick only fields that used in model only!. Then ignore (omit) from only GUI fields.
             */
            // value = ObjectsUtil.omit(value, ...target.__eaf__.onlyGuiFieldList);

            Object.defineProperty(target, '__eafmap__', {
                value,
                enumerable: false,
            });
        }
    }

    /**
     * Map EAF Module class model with response data from EAF Rest
     * 
     * @param type EAF Module class
     * @param value Map value from response
     */
    public static mapEAFResponseModel<T extends EAFModuleBase>(clazz: EAFModuleClass<T>, value: Object): T {
        let eafModel: T = ObjectsUtil.instantiate(clazz);
        this.createPropertyEAFMap(eafModel, value);

        return eafModel;
    }

    /**
     * Build EAF request model in JSON shape
     * 
     * @param modelsWithMethod Specified EAF Module models with method ['INSERT' or 'UPDATE']
     */
    public static buildEAFRequestModel(modelsWithMethod: EAFModelWithMethod[]) {
        let requestObject = {};

        if (!modelsWithMethod || !modelsWithMethod.length) {
            console.warn('Model list is empty !');
            return requestObject;
        }

        modelsWithMethod.forEach((modelWithMethod) => {

            if (!modelWithMethod.eafModel['__eaf__']) {
                console.error('⛔️️ EAF Request model error !!');
                throw new Error('EAF Request : Invalid EAF Model - (Model have no __eaf__)');
            }

            // Find if module id existed
            let eafModuleId = modelWithMethod.eafModuleId || modelWithMethod.eafModel['__eaf__'].eafModuleId;
            let mappedModel = this.mapEAFRequestModelAction(modelWithMethod);

            if (eafModuleId in requestObject) {
                requestObject[eafModuleId].push(mappedModel);
            } else {
                requestObject[eafModuleId] = [mappedModel];
            }
        });

        // console.debug('Request object :', requestObject);
        // console.debug(' JSON : \n' + JSON.stringify(requestObject, null, 2));

        return requestObject;
    }

    // public static buildJSONRequestModel(modelsWithMethod) {
    //   let responseObject = ObjectsUtil.clone(modelsWithMethod);
    //   if (!responseObject || !responseObject.length) {
    //     console.warn('Model list is empty !');
    //     return responseObject;
    //   }

    //   if (responseObject.eafModel && responseObject.eafModel['__eaf__']) {
    //     for (let member in responseObject.eafModel['__eaf__']) {
    //       responseObject[member]=responseObject.eafModel['__eaf__'][member];
    //     }
    //   }

    // }

    public static buildJSONRequestModel<T>(original: T): T {
        let cloneObject = null;
        if (original instanceof Array) {
            cloneObject = [];
            for (let member in original) {
                cloneObject.push(this.buildJSONRequestModel(original[member]));
            }
        } else if (original instanceof Object) {
            cloneObject = this.buildJSONObject(original);
        } else {
            cloneObject = original;
        }
        return cloneObject;
    }
    private static buildJSONObject<T>(original: any): T {
        //mapEAFResponseModel
        //this.createPropertyEAFMap(Object.getPrototypeOf(original).constructor, original);
        //original=this.mapEAFResponseModel(Object.getPrototypeOf(original).constructor,original);
        // let clone = Object.create(Object.getPrototypeOf(original));
        let clone: any = {};
        if (original && original['__eafmap__']) {
            for (let member in original['__eafmap__']) {
                clone[member] = this.buildJSONRequestModel(original['__eafmap__'][member]);
            }
        }

        for (let member in original) {
            if (['__eafmap__', '__eaf__'].indexOf(member) > -1) {
                continue;
            }

            if (original[member] instanceof Function) {

            } else {
                clone[member] = this.buildJSONRequestModel(original[member]);
            }

        }

        return clone;
    }

    /**
     * Map EAF Request model with Action method
     * 
     * @param modelWithMethod EAF Model with action method
     */
    private static mapEAFRequestModelAction(modelWithMethod: EAFModelWithMethod) {
        // must clone before use.
        modelWithMethod = ObjectsUtil.deepClone(modelWithMethod);

        let method = modelWithMethod.method;
        let { tableName, fieldList, onlyGuiFieldList } = modelWithMethod.eafModel['__eaf__'];
        let fieldMap = modelWithMethod.eafModel['__eafmap__'] || {};

        // Fill key to field map
        fieldList && fieldList.forEach((fieldName => {

            // Ignore only gui fields
            if (onlyGuiFieldList.indexOf(fieldName) > -1) {
                fieldMap[fieldName] = void 0; // Remove from model first
                return; // Skip
            }

            if (modelWithMethod.method !== 'DELETE') {
                if (!(fieldName in fieldMap)) {
                    fieldMap[fieldName] = null;
                }
            } else {
                // DELETE method will omit null fields
                if (fieldMap[fieldName] === null) {
                    fieldMap[fieldName] = void 0; // 'void 0' is represent to 'undefined'. It will not put in JSON.stringify().
                }
            }
        }));

        let modelWrapped = {};
        modelWrapped[method] = {};
        modelWrapped[method][tableName] = fieldMap;

        return modelWrapped;
    }

    /**
     * Map response list into Specified model
     * 
     * @param clazz EAF Module class type
     * @param rawObject EAF Response data
     */
    public static mapResponseList<T extends EAFModuleBase>(clazz: EAFModuleClass<T>, rawObject: EAFRestResponse): T[] {
        if (!rawObject) {
            return null;
        }

        if (Array.isArray(rawObject.DATA)) {
            let listOfModel: T[] = [];
            for (let model of rawObject.DATA) {
                listOfModel.push(EAFRestUtil.mapEAFResponseModel(clazz, model));
            }
            return listOfModel;
        }
    }

    public static mapResponseMultiClazz(mapModuleId: string, rawObject: EAFRestEntityResponse, classes?: { [key: string]: EAFModuleClass<IEAFModuleModel> }): { [key: string]: IEAFModuleModel[] } {
        if (!rawObject) {
            return null;
        }
        let responseMap: { [key: string]: IEAFModuleModel[] } = null;
        let data = rawObject.DATA;
        if (data && data.MODULE_ID) {
            responseMap = {};
            let moduleList = data.MODULE_ID;
            for (let moduleId in moduleList) {
                let thisModule = moduleList[moduleId];
                let eafModule: EAFModuleClass<IEAFModuleModel> = classes && classes[moduleId] || EAFContext.findEAFModuleClass(moduleId);
                if (eafModule) {
                    for (let action of thisModule) {
                        let updateAction = action.UPDATE;
                        for (let tableName in updateAction) {
                            let row = updateAction[tableName];
                            if (row) {
                                let instantiatedModel: IEAFModuleModel = EAFRestUtil.mapEAFResponseModel(eafModule, row);
                                responseMap[moduleId] = responseMap[moduleId] || [];
                                responseMap[moduleId].push(instantiatedModel);
                            }
                        }
                    }
                }
            }
        } else {
            responseMap = {};
            /**
             * Customize to get single module from response result,work around
            */
            let eafModule: EAFModuleClass<IEAFModuleModel> = EAFContext.findEAFModuleClass(mapModuleId);
            if (eafModule) {
                let thisModule = data[mapModuleId];
                for (let action of thisModule) {
                    let updateAction = action["UPDATE"];
                    for (let tableName in updateAction) {
                        let row = updateAction[tableName];
                        if (row) {
                            let instantiatedModel: IEAFModuleModel = EAFRestUtil.mapEAFResponseModel(eafModule, row);
                            responseMap[mapModuleId] = responseMap[mapModuleId] || [];
                            responseMap[mapModuleId].push(instantiatedModel);
                        }
                    }
                }
            }
        }
        return responseMap;
    }

    /**
     * Map Response Multi class
     * 
     * @param rawObject EAF Entity response data
     * @param classes Map of EAF Module classes
     */
    public static mapResponseMultiClass(rawObject: EAFRestEntityResponse, classes?: { [key: string]: EAFModuleClass<IEAFModuleModel> }): { [key: string]: IEAFModuleModel[] } {
        if (!rawObject) {
            return null;
        }

        let responseMap: { [key: string]: IEAFModuleModel[] } = null;

        let data = rawObject.DATA;
        if (data) {

            if (data.MODULE_ID) {
                responseMap = {};

                let moduleList = data.MODULE_ID;

                for (let moduleId in moduleList) {
                    let thisModule = moduleList[moduleId];
                    let eafModule: EAFModuleClass<IEAFModuleModel> = classes && classes[moduleId] || EAFContext.findEAFModuleClass(moduleId);
                    if (!eafModule) {
                        // EAF Module have not found in application
                        console.warn(`☹️ I have no EAF Module class for handle this module "${moduleId}".\nYou may need to specific class to handle this module.`);
                        continue;
                    }

                    for (let action of thisModule) {
                        // Action must be 'UPDATE'
                        let updateAction = action.UPDATE;

                        /*
                         * NorrapatN : Is it need to know? .. What is table name to get data from ??
                         * And Is it has only one table ?
                         * Use for to iterate into first one. For workaround.
                         */
                        for (let tableName in updateAction) {
                            let row = updateAction[tableName];
                            if (row) {
                                let instantiatedModel: IEAFModuleModel = EAFRestUtil.mapEAFResponseModel(eafModule, row);

                                responseMap[moduleId] = responseMap[moduleId] || [];
                                responseMap[moduleId].push(instantiatedModel);
                                break; // Exit, Get only one
                            }
                        }
                    }
                }
            }

        }

        return responseMap;
    }

    public static mapResponseModules<T extends EAFModuleBase>(moduleMap: {
        [eafModuleId: string]: IEAFModuleModel[];
    }, clazz: EAFModuleClass<IEAFModuleModel>): T {
        if (!moduleMap) {
            console.warn('⚠️ Module map is required');
            return null;
        }

        let mainModuleArr: IEAFModuleModel[];
        let mainModule: IEAFModuleModel; // Main class
        if (!!clazz) {
            // Found specified main module
            mainModuleArr = moduleMap[clazz.prototype['__eaf__'].eafModuleId];
        } else {
            console.warn('⚠️ To make sure response is correctly please specified Main module class.', );
            mainModuleArr = moduleMap[Object.keys(moduleMap)[0]];
        }

        if (!mainModuleArr || !mainModuleArr.length) {
            console.warn('⚠️ Main module found nothing .. ☹️');
            return null;
        } else if (mainModuleArr.length > 1) {
            console.warn('⚠️ Main module that response from request has more than one instances!');
            console.warn('   I just use one instance for Main module.');
        }
        mainModule = mainModuleArr[0];

        delete moduleMap[mainModule['__eaf__'].eafModuleId];

        let subModelMap = mainModule['__eaf__'].subModelMap;
        for (let subModuleId in moduleMap) {
            mainModule[subModelMap[subModuleId].fieldName] = moduleMap[subModuleId];
        }

        return <T>mainModule;
    }

}
