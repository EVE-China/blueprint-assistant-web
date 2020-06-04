import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BluePrintDetailComponent } from './blue-print-detail.component';

describe('BluePrintDetailComponent', () => {
  let component: BluePrintDetailComponent;
  let fixture: ComponentFixture<BluePrintDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BluePrintDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BluePrintDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
