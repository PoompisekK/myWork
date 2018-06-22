import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicPageModule } from 'ionic-angular';
import { TranslationModule } from 'angular-l10n';
import { LayoutModule } from '../../layout-module/layout.module';
import { BetterSearchPage } from './better-search.page';

const PAGES = [
  BetterSearchPage
];

/**
 * Better Search page Module
 * 
 * @author NorrapatN
 * @since Thu Oct 05 2017
 */
@NgModule({
  imports: [
    CommonModule, // IMPORTANT THING FOR USE WITH NG VALUE ACCESSOR!!
    IonicPageModule.forChild(BetterSearchPage),
    TranslationModule,
    LayoutModule,
  ],
  declarations: [
    ...PAGES,
  ],
  providers: [
  ],
  entryComponents: [
    ...PAGES,
  ],
  exports: [
    ...PAGES,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class BetterSearchPageModule {

}
