import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

declare const Papa: any;

/**
 * One row of the published sheet. CSV header:
 * `bgg,title,players,duration,complexity,y,ab`
 *
 * `bggId` and `cover` are joined in by the service, not columns of the sheet.
 */
export interface Game {
  bgg: string;        // BoardGameGeek URL, may be empty
  title: string;
  players: string;    // e.g. "2-4", often empty
  duration: string;   // minutes, e.g. "30-45", often empty
  complexity: string; // "Semplice" | "Media" | "Elevata"
  y: string;          // "Y" or empty
  ab: string;         // support-campaign list: "A", "B" or empty
  bggId: string;      // parsed out of `bgg`, empty when there is no URL
  cover: string;      // cover art URL from assets/covers.json, may be empty
}

/** Cover art map, `bggId` → image URL. Built by `tools/fetch-covers.mjs`. */
type Covers = Record<string, string>;

@Injectable()
export class ListService {
  private listUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRe2tbs2pHuZmyBFgG2bztrdGwXingue0uhh1_3SJxtrTrU_9j92U3Q6U5D6VmseREVh05pqf8JGV26/pub?gid=1287005740&single=true&output=csv';
  private coversUrl = 'assets/covers.json';

  data: Game[] = [];

  loaded: EventEmitter<Game[]> = new EventEmitter<Game[]>();

  constructor(
    private http: HttpClient,
  ) {
    // The shelf needs both halves before it can render a box, so wait for the
    // pair. Missing cover art is not fatal — the shelf draws a blank box.
    forkJoin([
      this.rows(),
      this.http.get<Covers>(this.coversUrl).pipe(catchError(() => of({} as Covers))),
    ]).subscribe(([rows, covers]) => {
      this.data = rows.map(row => this.withCover(row, covers));
      this.loaded.emit(this.data);
    });
  }

  public getList(): Observable<Game[]> {
    return of(this.data);
  }

  private rows(): Observable<Game[]> {
    return new Observable<Game[]>(subscriber => {
      Papa.parse(this.listUrl, {
        download: true,
        header: true,
        skipEmptyLines: 'greedy',
        transformHeader: (h: string) => h.trim().toLowerCase(),
        transform: (v: string) => v.trim(),
        complete: (results: { data: Game[] }) => {
          subscriber.next(results.data.filter(row => row.title));
          subscriber.complete();
        },
        error: () => {
          subscriber.next([]);
          subscriber.complete();
        },
      });
    });
  }

  private withCover(row: Game, covers: Covers): Game {
    const bggId = /\/boardgame(?:expansion)?\/(\d+)/.exec(row.bgg || '')?.[1] ?? '';
    return { ...row, bggId, cover: covers[bggId] ?? '' };
  }
}
