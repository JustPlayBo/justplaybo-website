import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

declare const Papa: any;

@Injectable()
export class ListService {
  private listUrl = 'assets/ludoteca.csv';

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
