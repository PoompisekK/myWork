import { Injectable } from '@angular/core';
import { LocaleService } from 'angular-l10n';
import { Observable } from 'rxjs';
import { DistrictMasterModel } from '../../model/master-data/district.master.model';
import { MasterListBoxModel } from '../../model/master-data/list-box.master.model';
import { PostCodeMasterModel } from '../../model/master-data/postcode.master.model';
import { ProvinceMasterModel } from '../../model/master-data/province.master.model';
import { SubDistrictMasterModel } from '../../model/master-data/sub-district.master.model';
import { YBatEducationLevelMasterModel } from '../../model/master-data/ybat-educate-level.master.model';
import { YBatNationalityMasterModel } from '../../model/master-data/ybat-nationality.master.model';
import { YBatOccupationMasterModel } from '../../model/master-data/ybat-occupation.master.model';
import { YBatRaceMasterModel } from '../../model/master-data/ybat-race.master.model';
import { YBatReligionMasterModel } from '../../model/master-data/ybat-religion.master.model';
import { EAFRestService } from '../eaf-rest/eaf-rest.service';
import { HttpService } from '../http-services/http.service';


/**
 * @author Bundit.Ng
 * @since  Tue May 23 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@Injectable()
export class MasterDataService {

  private provinceList: Array<ProvinceMasterModel>;
  private language: string = "TH";
  private cfgParam = {
    page: '1',
    volumePerPage: '300'
  };
  constructor(
    private httpService: HttpService,
    private eafRestService: EAFRestService,
    private localeService: LocaleService,
  ) {
    this.language = this.localeService.getCurrentLanguage().toUpperCase();
  }
  // TODO: Use model
  //public getMasterNationalityList(): Observable<any> {
  //   return this.httpService.httpGet(MockRestApi.URL + '/countries.json');
  // }

  private getProvinceMaster(): Observable<ProvinceMasterModel[]> {
    return this.eafRestService.searchEntity(ProvinceMasterModel, ProvinceMasterModel.ENTITY_ID, {
      LANGUAGE: this.language
    }, this.cfgParam);
  }

  private getDistrictMaster(provinceCode: string): Observable<DistrictMasterModel[]> {
    return this.eafRestService.searchEntity(DistrictMasterModel, DistrictMasterModel.ENTITY_ID, {
      PROVINCE_ID: provinceCode,
      LANGUAGE: this.language
    }, this.cfgParam);
  }

  private getSubDistrictMaster(provinceCode: string, districtCode: string): Observable<SubDistrictMasterModel[]> {
    return this.eafRestService.searchEntity(SubDistrictMasterModel, SubDistrictMasterModel.ENTITY_ID, {
      PROVINCE_ID: provinceCode,
      DISTRICT_ID: districtCode,
      LANGUAGE: this.language
    }, this.cfgParam);
  }

  private getPostCodeMaster(subDistrictCode: string): Observable<PostCodeMasterModel[]> {
    return this.eafRestService.searchEntity(PostCodeMasterModel, PostCodeMasterModel.ENTITY_ID, {
      SUBDISTRICT_CODE: subDistrictCode,
    }, this.cfgParam);
  }

  // private getTitleMaster(ownerType?: string): Observable<SubDistrictMasterModel[]> {
  //   return this.eafRestService.searchEntity(SubDistrictMasterModel, SubDistrictMasterModel.ENTITY_ID, {
  //     OWNER_TYPE: ownerType,
  //     LANGUAGE: this.language
  //   }, this.cfgParam);
  // }

  private getYBatNationalityMaster(): Observable<YBatNationalityMasterModel[]> {
    return this.eafRestService.searchEntity(YBatNationalityMasterModel, YBatNationalityMasterModel.ENTITY_ID, {
      LANGUAGE: this.language
    }, this.cfgParam);
  }

  private getYBatRaceMaster(): Observable<YBatRaceMasterModel[]> {
    return this.eafRestService.searchEntity(YBatRaceMasterModel, YBatRaceMasterModel.ENTITY_ID, {
      LANGUAGE: this.language
    }, this.cfgParam);
  }

  private getYBatReligionMaster(): Observable<YBatReligionMasterModel[]> {
    return this.eafRestService.searchEntity(YBatReligionMasterModel, YBatReligionMasterModel.ENTITY_ID, {
      LANGUAGE: this.language
    }, this.cfgParam);
  }

  private getYBatOccupationMaster(): Observable<YBatOccupationMasterModel[]> {
    return this.eafRestService.searchEntity(YBatOccupationMasterModel, YBatOccupationMasterModel.ENTITY_ID, {
      LANGUAGE: this.language
    }, this.cfgParam);
  }

  private getYBatEducationLevelMaster(): Observable<YBatEducationLevelMasterModel[]> {
    return this.eafRestService.searchEntity(YBatEducationLevelMasterModel, YBatEducationLevelMasterModel.ENTITY_ID, {
      LANGUAGE: this.language
    }, this.cfgParam);
  }

  public getMasterListBoxFromFieldID(fieldID: string): Observable<MasterListBoxModel[]> {
    return this.eafRestService.searchEntity(MasterListBoxModel, MasterListBoxModel.ENTITY_ID, {
      FIELD_ID: fieldID
    });
  }

  public getMasterListBoxFromFieldName(fieldName: string): Observable<MasterListBoxModel[]> {
    return this.eafRestService.searchEntity(MasterListBoxModel, MasterListBoxModel.ENTITY_ID, {
      FIELD_NAME: fieldName
    });
  }

}
