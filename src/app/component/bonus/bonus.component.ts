import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BonusService } from 'src/service/bonus.service';
import { getBonus, Bonus, saveBonus } from './vo';

@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.component.html',
  styleUrls: ['./bonus.component.scss']
})
export class BonusComponent implements OnInit, AfterViewInit {

  @ViewChild('agencyFee')
  agencyFeeInput: ElementRef;

  @ViewChild('salesTax')
  salesTaxInput: ElementRef;

  /**
   * 中介费
   */
  agencyFee: number;

  /**
   * 销售税
   */
  salesTax: number;

  constructor(private bonusService: BonusService) {
    // 从存储中获取上次的配置
    const bonus = getBonus();
    this.agencyFee = bonus.agencyFee;
    this.salesTax = bonus.salesTax;
    this.calcTaxRate();
  }

  ngAfterViewInit(): void {
    this.agencyFeeInput.nativeElement.value = this.agencyFee * 100;
    this.salesTaxInput.nativeElement.value = this.salesTax * 100;
    fromEvent<any>(this.agencyFeeInput.nativeElement, 'input')
      .pipe(debounceTime(300))
      .subscribe(event => {
        this.agencyFee = parseFloat(event.target.value) / 100;
        this.calcTaxRate();
      });
    fromEvent<any>(this.salesTaxInput.nativeElement, 'input')
      .pipe(debounceTime(300))
      .subscribe(event => {
        this.salesTax = parseFloat(event.target.value) / 100;
        this.calcTaxRate();
      });
  }

  ngOnInit(): void {
  }

  /**
   * 计算税率
   */
  calcTaxRate() {
    const taxRate = this.agencyFee + this.salesTax;
    this.bonusService.setTaxRate(taxRate);
    this.save();
  }

  /**
   * 保存加成配置
   */
  save() {
    const bonus = new Bonus();
    bonus.agencyFee = this.agencyFee;
    bonus.salesTax = this.salesTax;
    saveBonus(bonus);
  }
}
