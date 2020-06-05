import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BluePrint } from 'src/service/vo/blue-print';
import { fromEvent, Subject } from 'rxjs';
import { MaterialItem } from './vo';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-blue-print-detail',
  templateUrl: './blue-print-detail.component.html',
  styleUrls: ['./blue-print-detail.component.scss']
})
export class BluePrintDetailComponent implements OnInit {

  @Input()
  bluePrint: BluePrint;

  researchMaterial = 10;

  researchTime = 20;

  displayedColumns = [ 'name', 'quantity', 'price', 'totalPrice', 'totalVolume' ];

  materials: MaterialItem[] = [{
    id: 1,
    name: '测试',
    quantity: 100,
    volume: 0.01,
    price: 14.56
  }];

  calcSubject: Subject<string> = new Subject();

  constructor() { }

  ngOnInit(): void {
    this.calcSubject.pipe(debounceTime(150)).subscribe(() => {
      console.log(this.researchMaterial + ', ' + this.researchTime);
    });
  }

  triggerCalc() {
    this.calcSubject.next('');
  }
}
