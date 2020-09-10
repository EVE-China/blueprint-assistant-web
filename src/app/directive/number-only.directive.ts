import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[numberOnly]'
})
export class NumberOnlyDirective {

  /**
   * 是否允许小数
   */
  @Input()
  float = false;

  @Input()
  min: string;

  @Input()
  max: string;

  constructor(private el: ElementRef) {

  }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initalValue.replace(this.getRegex(), '');
    if ( initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }

    if (null == initalValue || '' === initalValue) {
      event.stopPropagation();
      this.el.nativeElement.value = this.min;
    }
    if (initalValue < this.getMin() || initalValue > this.getMax()) {
      event.stopPropagation();
      if (initalValue < this.getMin()) {
        this.el.nativeElement.value = this.min;
      } else if (initalValue > this.getMax()) {
        this.el.nativeElement.value = this.max;
      }
    }
  }

  private getMin(): number {
    return parseFloat(this.min);
  }

  private getMax(): number {
    return parseFloat(this.max);
  }

  private getRegex() {
    if (false === this.float || null == this.float) {
      return /[^0-9]*/g;
    }
    return /[^0-9.]*/g;
  }
}
