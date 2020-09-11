import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BonusService } from 'src/service/bonus.service';
import { PriceService } from 'src/service/price.service';
import { GetPriceMethod } from 'src/service/vo/common';
import { getBonus, Bonus, saveBonus } from './vo';

@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.component.html',
  styleUrls: ['./bonus.component.scss']
})
export class BonusComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  @ViewChild('agencyFee')
  agencyFeeInput: ElementRef;

  @ViewChild('salesTax')
  salesTaxInput: ElementRef;

  @ViewChild('systemCost')
  systemCostInput: ElementRef;

  @ViewChild('facilityTax')
  facilityTaxInput: ElementRef;

  /**
   * 中介费
   */
  agencyFee: number;

  /**
   * 销售税
   */
  salesTax: number;

  /**
   * 星系成本
   */
  systemCost: number;

  /**
   * 设施税
   */
  facilityTax: number;

  /**
   * 价格获取方式
   */
  getPriceMethod = GetPriceMethod.SellMin;

  constructor(private bonusService: BonusService, private priceService: PriceService) {
    // 从存储中获取上次的配置
    const bonus = getBonus();
    this.agencyFee = bonus.agencyFee;
    this.salesTax = bonus.salesTax;
    this.systemCost = bonus.systemCost;
    this.facilityTax = bonus.facilityTax;
    this.calcTaxRate();
  }

  ngAfterViewInit(): void {
    this.agencyFeeInput.nativeElement.value = this.agencyFee * 100;
    this.salesTaxInput.nativeElement.value = this.salesTax * 100;
    this.systemCostInput.nativeElement.value = this.systemCost * 100;
    this.facilityTaxInput.nativeElement.value = this.facilityTax * 100;
    this.subscriptions.push(fromEvent<any>(this.agencyFeeInput.nativeElement, 'input')
      .pipe(debounceTime(300))
      .subscribe(event => {
        this.agencyFee = parseFloat(event.target.value) / 100;
        this.calcTaxRate();
      }));
    this.subscriptions.push(fromEvent<any>(this.salesTaxInput.nativeElement, 'input')
      .pipe(debounceTime(300))
      .subscribe(event => {
        this.salesTax = parseFloat(event.target.value) / 100;
        this.calcTaxRate();
      }));
    this.subscriptions.push(fromEvent<any>(this.systemCostInput.nativeElement, 'input')
      .pipe(debounceTime(300))
      .subscribe(event => {
        this.systemCost = parseFloat(event.target.value) / 100;
        this.calcFacilityTax();
      }));
    this.subscriptions.push(fromEvent<any>(this.facilityTaxInput.nativeElement, 'input')
      .pipe(debounceTime(300))
      .subscribe(event => {
        this.facilityTax = parseFloat(event.target.value) / 100;
        this.calcFacilityTax();
      }));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(v => v.unsubscribe());
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
   * 计算设施税(包含星系成本)
   */
  calcFacilityTax() {
    const tax = this.systemCost * (1 + this.facilityTax);
    this.bonusService.setFacilityTax(tax);
    this.save();
  }

  getPriceMethodChange(method: number) {
    switch (method) {
      case GetPriceMethod.SellMin:
        this.priceService.setGetPriceMethod(GetPriceMethod.SellMin);
        break;
      case GetPriceMethod.BuyMax:
        this.priceService.setGetPriceMethod(GetPriceMethod.BuyMax);
        break;
      default:
        this.priceService.setGetPriceMethod(GetPriceMethod.SellMin);
    }
  }

  /**
   * 保存加成配置
   */
  save() {
    const bonus = new Bonus();
    bonus.agencyFee = this.agencyFee;
    bonus.salesTax = this.salesTax;
    bonus.systemCost = this.systemCost;
    bonus.facilityTax = this.facilityTax;
    saveBonus(bonus);
  }
}
