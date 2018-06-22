/**
 * Generic Response interface
 * 
 * @author NorrapatN
 * @since Wed Oct 04 2017
 */
export interface IGenericResponse<T> {

  status?: string;
  statusCode?: string;

  message?: string;

  data: T;

}
