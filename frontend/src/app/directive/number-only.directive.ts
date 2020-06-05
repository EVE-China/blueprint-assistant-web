import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[numberOnly]'
})
export class NumberOnlyDirective {

  @Input()
  min: string;

  @Input()
  max: string;

  constructor(private _el: ElementRef) {

  }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
    if (null == initalValue || '' === initalValue) {
      event.stopPropagation();
      this._el.nativeElement.value = this.min;
    }
    if (initalValue < this.getMin() || initalValue > this.getMax()) {
      event.stopPropagation();
      if (initalValue < this.getMin()) {
        this._el.nativeElement.value = this.min;
      } else if (initalValue > this.getMax()) {
        this._el.nativeElement.value = this.max;
      }
    }
  }

  private getMin(): number {
    return parseInt(this.min, 10);
  }

  private getMax(): number {
    return parseInt(this.max, 10);
  }
}
