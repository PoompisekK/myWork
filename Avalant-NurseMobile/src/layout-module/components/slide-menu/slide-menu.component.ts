import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { SlideMenuItem } from './model/slide-menu-item.model';
import { ValueAccessorBase } from '../form-control-base/value-accessor-base';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Slides } from 'ionic-angular';

/**
 * Slide menu Component - That have ngModel. Its work like Ionic Segment.
 * 
 * @author NorrapatN
 * @since Tue Sep 26 2017
 */
@Component({
  selector: 'slide-menu',
  templateUrl: './slide-menu.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SlideMenuComponent,
      multi: true
    }
  ]
})
export class SlideMenuComponent extends ValueAccessorBase<string> implements AfterViewInit {

  @ViewChild(Slides)
  public slides: Slides;

  @Input()
  get items(): SlideMenuItem[] {
    return this._items;
  }

  set items(value: SlideMenuItem[]) {
    this._items = value;
    this.itemsChanged();
  }

  @Input()
  private selectMode: boolean = false;

  @Input()
  private slidesPerView: number = 5;

  @Input()
  private centeredSlides: boolean = false;

  @Input()
  private selectOnSlide: boolean = true;

  @Output()
  private itemClick = new EventEmitter<SlideMenuItem>();

  private initialized: boolean;

  private selectedItem: SlideMenuItem;
  private selectedIndex: number;

  private _items: SlideMenuItem[];

  constructor() {
    super();

  }

  public ngAfterViewInit(): void {
    this.initialized = true;
    console.debug('ngAfterViewInit initialized');
    this.itemsChanged();
  }

  private itemsChanged(): void {
    console.debug('Item changed init: ' + this.initialized);
    if (!this.initialized) {
      return;
    }

    // Check centered slide.
    // It will select first one as default.
    if (this.centeredSlides) {
      if (this.items && this.items.length) {

        if (!isNaN(this.selectedIndex) && this.selectedIndex !== null) {
          // this.onSlideDidChange(this.slides);
          this.slides.slideTo(this.selectedIndex);
        }
        /* else {
          setTimeout(() => {
            this.slides.slideTo((this.items.length - 1) / 2);
          }, 600);
        } */
      }
    }
  }

  private onItemClick(e: MouseEvent, slideMenuItem: SlideMenuItem): void {
    this.selectedItem = slideMenuItem;
    this.selectedIndex = this.items.indexOf(slideMenuItem);
    this.value = slideMenuItem && slideMenuItem.value;

    // Do with Slides
    if (!!this.slides) { // Check is Slides initialized
      // Make it slide to clicked item
      if (this.centeredSlides) {
        this.slides.slideTo(this.selectedIndex);
      }
    }

    this.itemClick.emit(slideMenuItem);
  }

  private onSlideDidChange(slides: Slides): void {
    // console.debug('💭 DidChange slide : ', slides);

    if (!this.selectOnSlide) {
      return;
    }

    let idx: number | void = slides.getActiveIndex();

    // console.debug(' Index : ', idx);

    // Possible index is undefined.
    if (idx === void 0) {
      idx = 0;
    }

    // It is impossible that index will greater than slides length, But is it. :(
    if (idx > this.items.length - 1) {
      idx = this.items.length - 1;
    }

    this.selectedIndex = idx;
    this.selectedItem = this.items[idx];
    this.value = this.selectedItem && this.selectedItem.value;

    // if (this.centeredSlides && !this.selectedItem) {
    //   this.slides.slideTo(0);
    // }
  }

  private isSelected(slideMenuItem: SlideMenuItem): boolean {
    if (this.centeredSlides) {
      return this.selectedItem === slideMenuItem;
    } else {
      return this.selectMode && this.selectedItem === slideMenuItem;
    }
  }

}
