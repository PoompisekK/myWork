import { Component } from '@angular/core';

@Component({
  selector: 'product-info-slides',
  templateUrl: 'product-info-slides.component.html',
  styleUrls: ['/product-info-slides.component.scss']
})
export class ProductInfoSlidesComponent {
  private slidesFiles: any = [];
  constructor() {
    let files = [
    ];
    this.slidesFiles = files;
  }
}