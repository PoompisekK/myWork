/**
 * EAF Rest-API Header model
 */
export class EAFSessionModel {

  public get idToken(): string {
    return this.id_token;
  }

  public set idToken(value: string) {
    this.id_token = value;
  }

  public id_token: string;
  public timestamp: string;
  public validity: number;
  public clientId: string;
  public expireDate: Date;
}
