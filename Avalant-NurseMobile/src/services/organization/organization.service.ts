import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from '../../app/app.state';
import { AuthenticationAllowModel } from '../../model/authentication/authentication-allow.model';
import { EAFModelWithMethod } from '../../model/eaf-rest/eaf-model-with-method.model';
import { ShopTypeMasterModel } from '../../model/master-data/shop-type.master.model';
import { OrganizationFollowerModel } from '../../model/organization/organization-follower.model';
import { OrganizationImage } from '../../model/organization/organization-image.model';
import { OrganizationTabEntityModel } from '../../model/organization/organization-tab.model';
import { OrganizationModel } from '../../model/organization/organization.model';
import { ShopTabModel } from '../../model/organization/shop-tab.model';
import { EAFRestService } from '../eaf-rest/eaf-rest.service';
import { HttpService } from '../http-services/http.service';


/**
 * Organization Service
 * 
 * @author NorrapatN
 * @since Wed May 17 2017
 */
@Injectable()
export class OrganizationService {

  constructor(
    private httpService: HttpService,
    private eafRestService: EAFRestService,
    private appState: AppState
  ) {

  }

  public getOrganizationList(parameters?: Object): Observable<OrganizationModel[]> {
    return this.eafRestService.searchEntity(OrganizationModel, OrganizationModel.ENTITY_ID, parameters, EAFRestService.cfgSearch);
  }

  /**
   * Get Organization data by specified ID
   * 
   * @param organizationId string
   */
  public getOrganization(organizationId: string): Observable<OrganizationModel> {
    // return this.httpService.httpGet(MockRestApi.URL + '/organization/' + organizationId + '.json');

    return this.getOrganizationList({
      ID: organizationId,
    }).map((resp) => {
      let orgItem = resp && resp.length && resp[0];
      if (orgItem) {
        this.getOrganizationImageByOrgId(orgItem.id).subscribe(resp => {
          orgItem.organizationImage = resp;
        }, error => {
          console.warn('Error => ', error);
        });
      }
      return orgItem;
    });
  }

  public getOrganizationImageByOrgId(orgId: string): Observable<OrganizationImage[]> {
    return this.eafRestService.searchEntity(OrganizationImage, OrganizationImage.ENTITY_ID, {
      ORG_ID: orgId,
    }, EAFRestService.cfgSearch);
  }

  // MOCK STATUS DATA TODO: REMOVE
  private _isFollowed: boolean;

  /**
   * Get following status for specified Organization
   * 
   * @param organizationId string
   */
  public getFollowStatusByOrganization(organizationId: string, businessUserId: string): Observable<OrganizationFollowerModel> {
    // TODO: Call real rest
    // return Observable.create((observer: Observer<any>) => {
    //   observer.next(this._isFollowed);
    //   observer.complete();
    // });
    return this.eafRestService.searchEntity(OrganizationFollowerModel, OrganizationFollowerModel.ENTITY_ID, {
      ORG_ID: organizationId,
      BUSINESS_USER_ID: businessUserId,
    }, EAFRestService.cfgSearch).map((response) => response && response[0]);

  }

  // TODO: Send real request
  /**
   * Send a toggle follow command
   * 
   * @param organizationId
   */
  public toggleFollowOrganization(orgFollowItm: OrganizationFollowerModel): Observable<any> {
    return this.eafRestService.saveEntity(OrganizationFollowerModel.ENTITY_ID, [new EAFModelWithMethod(orgFollowItm, EAFRestService.getInsertUpdateByPrimaryKey(orgFollowItm.orgFollowerId))], {});
  }

  public getMasterShopType(): Observable<ShopTypeMasterModel[]> {
    return this.eafRestService.searchEntity(ShopTypeMasterModel, ShopTypeMasterModel.ENTITY_ID);
  }

  public getShopTabsByOrganization(ID: string, LANGUAGE: string): Observable<ShopTabModel[]> {
    return this.eafRestService.searchEntity(ShopTabModel, ShopTabModel.ENTITY_ID, {
      ID,
      LANGUAGE,
    });
  }

  public getOrganizationProductTab(): Observable<OrganizationTabEntityModel[]> {
    return this.eafRestService.searchEntity(OrganizationTabEntityModel, OrganizationTabEntityModel.ENTITY_ID, { 'STATUS': 'A' });
  }

  public getAuthMethodFromOrgID(): Observable<AuthenticationAllowModel[]> {
    return this.eafRestService.searchEntity(AuthenticationAllowModel, AuthenticationAllowModel.ENTITY_ID, { 'ORG_ID': this.appState.currentOrganizationId });
  }

}
