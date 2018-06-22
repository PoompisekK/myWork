import { EAFRestResponse } from './eaf-rest-response.model';
import { ResponseBaseModel } from '../rest/response-base.model';
/**
 * EAF Rest Entity response
 * @author NorrapatN
 * @since Tue May 30 2017
 */
export class EAFRestEntityResponse extends ResponseBaseModel {

  public DATA: {
    ENTITY_ID: string;
    MODULE_ID: { [key: string]: [{ [key: string]: any }] } // TODO: Use declare type structure
  };

}
