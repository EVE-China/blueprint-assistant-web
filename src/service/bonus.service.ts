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

  setSystemCost(systemCost: number) {
    // TODO 需要确定一下星系成本的最大值
    if (systemCost < 0) {
      this.systemCost = 0;
    } else if (systemCost > 20) {
      this.systemCost = 20;
    } else {
      this.systemCost = systemCost;
    }
    this.changeNotify.next();
  }

  getSystemCost() {
    return this.systemCost;
  }
}
