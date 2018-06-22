import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslationModule } from 'angular-l10n';
import { LayoutModule } from '../../layout-module/layout.module';
import { SearchPage } from './search.page';
import { SearchResultPage } from '../search-result-page/search-result.page';
import { SearchService } from '../../services/search-services/search.service';

const SEARCH_PAGES = [
  SearchPage,
  SearchResultPage
];

/**
 * Search page Module
 * 
 * @author NorrapatN
 * @since Fri Jul 14 2017
 */
@NgModule({
  imports: [
    IonicPageModule.forChild(SearchPage),
    TranslationModule,
    LayoutModule,
  ],
  declarations: [
    ...SEARCH_PAGES,
  ],
  entryComponents: [
    ...SEARCH_PAGES,
  ],
  providers: [
    SearchService,
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SearchPageModule {

}
