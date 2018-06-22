/**
 * Security Constant
 * @author NorrapatN
 * @since Sat Jun 24 2017
 */

// TODO: Load from server OR Fixed into application
export class SecurityCosntant {

  private constructor() { }

  public static readonly PASSWORD_SALT = {
    salt1: 'Cyo8;k,0eglnjv,',
    salt2: "ihv'wsh0ow,j,uohe9k",
  };

  public static readonly USER_SALT = {
    salt: 'Vy]Fs]aviN,fbvvgmviNw:fN',
    cost: 37,
  };

  public static readonly PW_RECOVERY_SALT = {
    salt: ']n,isyl',
    cost: 69,
  };

}
