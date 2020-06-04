import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PriceService extends AbstractService {

  constructor(private http: HttpClient) {
    super();
  }

  query(typeId: number): Observable<number> {
    return this.http.get<any>(`${this.API_PREFIX}/${typeId}/price`)
      .pipe(this.mapToError(),
        flatMap(rsp => of(rsp.min as number))
      );
  }
}
