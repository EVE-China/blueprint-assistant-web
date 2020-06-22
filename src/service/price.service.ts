import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Price } from './vo/common';

@Injectable({
  providedIn: 'root'
})
export class PriceService extends AbstractService {

  constructor(private http: HttpClient) {
    super();
  }

  query(typeId: number): Observable<Price> {
    return this.http.get<Price>(`${this.API_PREFIX}/type/${typeId}/price`)
      .pipe(this.mapToError());
  }
}
