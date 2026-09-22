import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

declare const Papa: any;

/**
 * One row of the published sheet. CSV header:
 * `bgg,title,players,duration,complexity,y,ab`
 */
export interface Game {
  bgg: string;        // BoardGameGeek URL, may be empty
  title: string;
  players: string;    // e.g. "2-4", often empty
  duration: string;   // minutes, e.g. "30-45", often empty
  complexity: string; // "Semplice" | "Media" | "Elevata"
  y: string;          // "Y" or empty
  ab: string;         // support-campaign list: "A", "B" or empty
}

@Injectable()
export class ListService {
  private listUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRe2tbs2pHuZmyBFgG2bztrdGwXingue0uhh1_3SJxtrTrU_9j92U3Q6U5D6VmseREVh05pqf8JGV26/pub?gid=1287005740&single=true&output=csv';

  data: Game[] = [];

  loaded: EventEmitter<Game[]> = new EventEmitter<Game[]>();

  constructor(
    private http: HttpClient,
  ) {
    Papa.parse(this.listUrl, {
      download: true,
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (h: string) => h.trim().toLowerCase(),
      transform: (v: string) => v.trim(),
      complete: (results)=>{
        this.data = results.data.filter((row: Game) => row.title);
        this.loaded.emit(this.data);
      }
    })
  }

  public getList(): Observable<Game[]> {
    return of(this.data);
  }
}
