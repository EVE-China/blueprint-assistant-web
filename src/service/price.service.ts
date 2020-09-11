import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { HttpClient } from '@angular/common/http';
import { GetPriceMethod, PriceResponse } from './vo/common';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceService extends AbstractService {

  /**
   * 价格获取方式
   */
  private getPriceMethod = GetPriceMethod.SellMin;

  /**
   * 价格获取方式变更通知
   */
  private getPriceMethodSubject = new Subject<void>();

  constructor(private http: HttpClient) {
    super();
  }

  setGetPriceMethod(getPriceMethod: GetPriceMethod) {
    this.getPriceMethod = getPriceMethod;
    this.getPriceMethodSubject.next();
  }

  getPriceMethodChangeNotify(): Observable<void> {
    return this.getPriceMethodSubject;
  }

  getGetPriceMethod(): GetPriceMethod {
    return this.getPriceMethod;
  }

  query(typeId: number) {
    return this.http.get<PriceResponse>(`${this.API_PREFIX}/type/${typeId}/price`)
      .pipe(this.mapToError());
  }
}
