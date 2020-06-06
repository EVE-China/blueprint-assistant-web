import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BluePrint, Manufacturing } from './vo/blue-print';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BluePrintService extends AbstractService {

  constructor(private http: HttpClient) {
    super();
  }

  findAllByName(name: string): Observable<BluePrint[]> {
    return this.http.get<BluePrint[]>(`${this.API_PREFIX}/blueprints`, {
      params: new HttpParams().append('name', name)
    }).pipe(this.mapToError());
  }

  getManufacturingByTypeId(typeId: number): Observable<Manufacturing> {
    return this.http.get<Manufacturing>(`${this.API_PREFIX}/blueprints/${typeId}/manufacturing`)
      .pipe(this.mapToError());
  }
}
