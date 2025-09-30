import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

declare const Papa: any;

@Injectable()
export class ListService {
  private listUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRe2tbs2pHuZmyBFgG2bztrdGwXingue0uhh1_3SJxtrTrU_9j92U3Q6U5D6VmseREVh05pqf8JGV26/pub?gid=1287005740&single=true&output=csv';

  data: any[] = [];

  loaded: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
  ) { 
    Papa.parse(this.listUrl, {
      download: true,
      header: true,
      complete: (results)=>{
        this.data = results.data;
        this.loaded.emit(this.data);
      }
    })
  }

  public getList(): Observable<any> {
    return of(this.data);
  }
}
