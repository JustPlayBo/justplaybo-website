import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { ActivatedRoute } from '@angular/router';

declare const Papa: any;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ListService]
})
export class ListComponent implements OnInit {
  list: any[];
  selectedList: string;
  title: string;

  loading = false;

  displayedColumns = ['name', 'players', 'duration', 'complexity', 'bggurl'];

  constructor(
    private listService: ListService,
    private route: ActivatedRoute
  ) {
    this.listService.loaded.subscribe(data => this.updateList());
  }

  isRowVisible(game): boolean {
    if (this.selectedList) {
      if (game && game.list) {
        if (game.list.$t !== this.selectedList) {
          return false;
        }
      }
    }
    return true;
  }

  isSustainLinkVisible(): boolean {
    if ('A' === this.selectedList || 'B' === this.selectedList) {
      return true;
    }
    return false;
  }

  getClassName(game): string {
    if (game && game.complexity) {
      switch (game.complexity.$t) {
        case 'Semplice':
          return 'green';
        case 'Media':
          return 'yellow';
        case 'Elevata':
          return 'red';
        default:
          return 'gray';
      }
    }
  }

  ngOnInit() {
    this.loading = true;
    this.selectedList = this.route.snapshot.paramMap.get('list');
    //this.updateList();
  }

  updateList() {
    this.listService.getList().subscribe(data => {
      console.error(data);

      this.loading = false;
      if (data.length > 0) {
        this.list = data;
      } else {
        this.list = [];
      }

      switch (this.selectedList) {
        case 'A':
          this.title = 'Lista A';
          break;
        case 'B':
          this.title = 'Lista B';
          break;
        default:
          this.title = 'La Nostra Collezione';
      }
    });
  }
}
