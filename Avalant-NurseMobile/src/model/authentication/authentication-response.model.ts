import { UserModel } from '../user/user.model';
import { ResponseBaseModel } from '../rest/response-base.model';

export class AuthenticationResponseModel extends ResponseBaseModel {

  public object: UserModel;

}
