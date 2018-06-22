export class AuthenticationRequestModel {
  constructor(
    public username?: string,
    public password?: string,
  ) { }
}
export class SocialAuthenRequestModel {
  constructor(
    public fb_id_user?: string,
    public fb_name_user?: string,
    public fb_user_email?: string,
    public fb_pic_user?: string,
    public fb_tel_user?: string,
  ) { }
}

export class SocialComRegisterRequestModel {
  constructor(
    public signUp_Email?: string,
    public signUp_Pwd?: string,
    public signUp_Username?: string,
    public signUp_Language?: string,
    public signUp_custNickName?: string,
    public signUp_custFname?: string,
    public signUp_custLname?: string,
    public signUp_signinType?: string,
    public signUp_companyCode?: string,
  ) { }
}
