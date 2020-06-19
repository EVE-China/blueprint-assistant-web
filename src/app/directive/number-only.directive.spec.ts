import { NumberOnlyDirective } from './number-only.directive';
import { TestBed } from '@angular/core/testing';

describe('NumberOnlyDirective', () => {
  let directive: NumberOnlyDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    directive = TestBed.inject(NumberOnlyDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
