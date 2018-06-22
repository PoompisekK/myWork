import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StepItem } from './step-item';

/**
 * Step Bar Component
 * 
 * @author NorrapatN
 * @since Wed Nov 01 2017
 * 
 * @see https://www.cssscript.com/animated-step-progress-bar-pure-javascript/
 */
@Component({
  selector: 'step-bar',
  templateUrl: 'step-bar.component.html',
})
export class StepBarComponent {

  @Input()
  get progress(): number {
    return this._progress;
  }

  set progress(value: number) {
    if (isNaN(value)) {
      value = 0;
    }
    this._progress = value;

    let total = this.stepItemList.length - 1;
    
    this._currentStep = Math.floor((value * total) / (this.max)) + 1;
    this.progressChange.emit(value);
  }

  @Input()
  private max: number = 100;

  @Input()
  get currentStep(): number {
    return this._currentStep;
  }

  set currentStep(value: number) {
    if (value < 1) {
      value = 1;
    }

    this._currentStep = value;
    this.goToStep(value);
  }

  @Input()
  private stepItemList: StepItem[];

  @Output()
  public progressChange: EventEmitter<number> = new EventEmitter();

  private _progress: number = 0;
  private _currentStep: number = 1;

  /**
   * Go to specified step number.
   * 
   * @param step Step start at 1
   */
  public goToStep(step: number): void {
    if (step < 1) {
      step = 1;
    }

    let total = this.stepItemList.length - 1;
    this._progress = (step - 1) * (this.max / total) || 0;
  }

  public nextStep(): void {
    this.currentStep++;
  }

  public prevStep(): void {
    this.currentStep--;
  }

  private calcStepPosition(index: number): number {
    let max = this.max;
    let total = this.stepItemList.length - 1;

    return index * (max / total) || 0;
  }

  private isStepPassed(index): boolean {
    return this.progress >= this.calcStepPosition(index);
  }

}
