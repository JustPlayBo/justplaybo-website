import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private listUrl = 'https://spreadsheets.google.com/feeds/list/1DIsGpjlwx6AhUIzspwqq6fGBWp6D5lDWbZqyYOMzCRU/1/public/values?alt=json';

  constructor(private http: HttpClient) { }

  public getList(): Observable<any> {
    return this.http.get(this.listUrl);
  }
}
