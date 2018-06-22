import { IGenericResponse } from './generic-response.interface';
/**
 * Generic response model
 * 
 * @author NorrapatN
 * @since Tue May 23 2017
 */
export class GenericResponse<T> implements IGenericResponse<T> {

  public status?: string;
  public statusCode?: string;
  public message?: string;
  public data: T;

}
