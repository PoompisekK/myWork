import { Component, OnInit, Input } from '@angular/core';
import { App, NavParams, Searchbar } from "ionic-angular";
import { ProductPage } from '../product-page/product.page';
import { SearchService } from '../../services/search-services/search.service';

/**
 * @author Bundit.Ng
 * @since  Tue Jun 13 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

@Component({
  selector: 'search-result-page',
  templateUrl: 'search-result.page.html',
  styleUrls: ['/search-result.page.scss'],
})
export class SearchResultPage implements OnInit {

  @Input('dataResult')
  private dataResult = [];

  constructor(
    private appCtrl: App,
    private navParams: NavParams,
    private searchService: SearchService
  ) {
  }
  public ngOnInit(): void {

  }
  public ionViewDidLoad() {
    // console.log("this.dataResult:", this.dataResult);
  }
}
