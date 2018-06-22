/**
 * EAF Rest Request header
 * 
 * @author NorrapatN
 * @since Mon May 29 2017
 */
export interface IEAFRestHeader {

  page?: string | number;
  volumePerPage?: string | number;
  handleForm?: 'Y' | 'N';
  cbMethod?: string;
  cache?: boolean;

}