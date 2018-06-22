import { Component, ViewChild } from '@angular/core';
import { IonicPage, Searchbar } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

/**
 * Better Search page
 * @author NorrapatN
 * @since Thu Oct 05 2017
 */
@IonicPage({
  segment: 'search',
})
@Component({
  selector: 'better-search-page',
  templateUrl: './better-search.page.html',
})
export class BetterSearchPage {

  @ViewChild(Searchbar)
  private searchbar: Searchbar;

  private searchKeyword: string;
  private searchResultList: string[];
  private suggestedList: string[];
  private isSearching: boolean;

  constructor(
    private keyboard: Keyboard,
  ) {

    // Mocked up data
    this.suggestedList = [
      'ล้อรถ', 'หม้อน้ำ', 'ไฟหน้า', 'สายพาน'
    ];

  }

  public ionViewDidEnter(): void {

    setTimeout(() => {
      this.searchbarFocus();
      setTimeout(() => {
        this.searchbarFocus();
      }, 500);
    }, 500);
  }

  private searchbarFocus(): void {
    this.keyboard.show();
    this.searchbar.setFocus();
  }

  private search(keyword: string): void {
    keyword = (keyword || '');

    this.isSearching = !!keyword;
  }

  private onSuggestedItemClick(suggestedKeyword: string): void {
    let keyword = this.searchKeyword || '';

    keyword += suggestedKeyword;

    this.searchKeyword = keyword;

    this.search(keyword);
    this.searchbar.setFocus();
  }

}
