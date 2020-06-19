import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BonusService {

  /**
   * 总税率
   */
  private taxRate = 0.0515;

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
}
