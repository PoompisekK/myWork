import { ObjectsUtil } from '../../utilities/objects.util';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { HttpService } from '../http-services/http.service';
import { AppState } from '../../app/app.state';
import { EAFRestService } from '../eaf-rest/eaf-rest.service';
import { SearchResultViewModel } from '../../model/search-result/search-result.model';
/**
 * @author Bundit.Ng
 * @since  Sat May 20 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */
@Injectable()
export class SearchService {

  constructor(
    private httpService: HttpService,
    private eafRestService: EAFRestService,
    private appState: AppState,
  ) { }

  public getSearchItemTagsByNameAndOrgId(searchStr: string, orgnizationId: string): Observable<any> {
    let searchParams: { ORG_ID?: string, CATEGORYTYPE?: string, SHOPID?: string, Q_NAME?: string } = {};
    searchParams.Q_NAME = searchStr;
    if (!ObjectsUtil.isEmptyObject(orgnizationId)) {
      searchParams.ORG_ID = orgnizationId;
    }
    // console.log("getSearchItemTagsByNameAndOrgId searchParams:", searchParams);
    return this.eafRestService.searchEntity(SearchResultViewModel, SearchResultViewModel.ENTITY_ID, searchParams, EAFRestService.cfgSearch);
  }

  public getSearchProductManualServlet(searchStr: string, orgID: string, categoryID?: string, subCategoryID?: string, productID?: string): Observable<any> {
    // if (searchStr) {
    return this.eafRestService.getManualServlet('SearchREST', null, {
      orgId: orgID,
      searchText: searchStr,
      categoryId: categoryID,
      subCategoryId: subCategoryID,
      productId : productID
    });
  }
  // }
}