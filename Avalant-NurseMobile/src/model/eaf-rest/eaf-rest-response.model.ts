import { ResponseBaseModel } from '../rest/response-base.model';
/**
 * EAF Rest Response model
 * 
 * @author NorrapatN
 * @since Mon May 29 2017
 */
export class EAFRestResponse extends ResponseBaseModel {

  public DATA: any[];
  public ALL_VOLUME: string;

}
