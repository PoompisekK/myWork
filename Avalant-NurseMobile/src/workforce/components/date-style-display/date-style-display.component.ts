import { Component, Input } from '@angular/core';

import { AnimateCss } from '../../../animations/animate-store';

@Component({
  selector: 'date-style-display',
  templateUrl: 'date-style-display.component.html',
  animations: [
    AnimateCss.peek()
  ]
})
export class DateStyleDisplayComponent {
  @Input("displayDate") private displayDate: Date | string;
  @Input("displayLabel") private displayLabel: Date | string;
  constructor() {
  }

}