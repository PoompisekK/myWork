import { Directive, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
/**
 * 
 * @author NorrapatN
 * @since Fri Jul 14 2017
 */
@Directive({
  selector: 'img[safe]',
  host: {
    '(error)': 'errorHandler($event)',
    '[src]': 'src',
  }
})
export class ImageSafeDirective implements OnInit, OnDestroy {

  @Input()
  public src: string;

  private imgInstance: HTMLImageElement;

  constructor(private element: ElementRef) { }

  public ngOnInit(): void {
    this.imgInstance = this.element.nativeElement;
  }

  public ngOnDestroy(): void {

  }

  public errorHandler(ev): void {
    // console.debug('💭 Image Safe Event :', ev);
    this.imgInstance.src = 'assets/img/placeholder.png';
  }

}
