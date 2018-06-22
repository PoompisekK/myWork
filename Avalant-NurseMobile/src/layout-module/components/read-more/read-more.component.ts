import { Component, Input, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';

/**
 * Read more Component
 * 
 * Use to collapse long message text or something. Then use Read more button to show all.
 * 
 * @author NorrapatN
 * @since Thu Nov 16 2017
 * 
 * @see https://stackoverflow.com/questions/37819312/angular-2-read-more-directive/37820535
 */
@Component({
  selector: 'read-more',
  templateUrl: 'read-more.component.html',
  animations: [
    /*
     * TODO: Expanding animation :)...  I have no time to do this thing :(
     * So if you have, just do it, Thank sand goodbye.
     */
  ],
})
export class ReadMoreComponent implements OnInit, AfterViewInit {

  private static readonly DEFAULT_COLLAPSED_HEIGHT: number = 100;

  @Input()
  private isCollapsed: boolean;

  @Input()
  private collapsedHeight: number;

  @ViewChild('readMoreWrapper')
  private readMoreWrapper: ElementRef;

  constructor(private elementRef: ElementRef) { }

  public ngOnInit(): void {
    this.collapsedHeight = ReadMoreComponent.DEFAULT_COLLAPSED_HEIGHT;
  }

  public ngAfterViewInit(): void {
    let currentHeight: number = this.readMoreWrapper.nativeElement.offsetHeight;

    // Set value that bind to template will product "ExpressionChangedAfterItHasBeenCheckedError".
    // use timeout to avoid this error.

    setTimeout(() => {
      if (currentHeight < this.collapsedHeight) {
        this.isCollapsed = false;
      } else {
        this.isCollapsed = true;
      }
    });
  }

}
