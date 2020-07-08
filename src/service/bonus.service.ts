import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BonusService {

  /**
   * 总税率
   */
  private taxRate = 0.0515;

  /**
   * 星系成本
   */
  private systemCost = 0.15;

  /**
   * 设施税
   */
  private facilityTax = 0.10;

  /**
   * 变更通知
   */
  private changeNotify = new Subject<void>();

  constructor() {
  }

  getChangeNotify(): Observable<void> {
    return this.changeNotify;
  }

  setTaxRate(taxRate: number) {
    // 满技能税率5.15%, 没技能10%
    if (taxRate < 0.0515) {
      this.taxRate = 0.0515;
    } else if (taxRate > 0.1) {
      this.taxRate = 0.1;
    } else {
      this.taxRate = taxRate;
    }
    this.changeNotify.next();
  }

  getTaxRate() {
    return this.taxRate;
  }

  setFacilityTax(facilityTax: number) {
    if (facilityTax < 0.01) {
      this.facilityTax = 0.01;
    } else if (facilityTax > 2) {
      this.facilityTax = 2;
    } else {
      this.facilityTax = facilityTax;
    }
    this.changeNotify.next();
  }

  getFacilityTax() {
    return this.facilityTax;
  }
}
