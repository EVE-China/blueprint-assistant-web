import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BluePrint } from 'src/service/vo/blue-print';
import { fromEvent } from 'rxjs';
import { MaterialItem } from './vo';

@Component({
  selector: 'app-blue-print-detail',
  templateUrl: './blue-print-detail.component.html',
  styleUrls: ['./blue-print-detail.component.scss']
})
export class BluePrintDetailComponent implements OnInit, AfterViewInit {

  @Input()
  bluePrint: BluePrint;

  researchMaterial = 10;

  researchTime = 20;

  @ViewChild('researchMaterial', { static: true })
  researchMaterialRef: ElementRef;

  @ViewChild('researchTime', { static: true })
  researchTimeRef: ElementRef;

  displayedColumns = [ 'name', 'quantity', 'price', 'totalPrice', 'totalVolume' ];

  materials: MaterialItem[] = [{
    id: 1,
    name: '测试',
    quantity: 100,
    volume: 0.01,
    price: 14.56
  }];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    fromEvent<any>(this.researchMaterialRef.nativeElement, 'change').subscribe(event => {
      const value = parseInt(event.target.value, 10);
      if (isNaN(value)) {
        return;
      }
      if (value < 0) {
        this.researchMaterial = 0;
      } else if (value > 10) {
        this.researchMaterial = 10;
      } else {
        this.researchMaterial = Math.floor(value);
      }
      event.target.value = this.researchMaterial;
    });
    fromEvent<any>(this.researchTimeRef.nativeElement, 'change').subscribe(event => {
      const value = parseInt(event.target.value, 10);
      if (isNaN(value)) {
        return;
      }
      if (value < 0) {
        this.researchTime = 0;
      } else if (value > 20) {
        this.researchTime = 20;
      } else {
        this.researchTime = Math.floor(value);
      }
      event.target.value = this.researchTime;
    });
  }
}
