import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  list: any[];
  selectedList: string;
  title: string;

  constructor(
    private listService: ListService,
    private route: ActivatedRoute
    ) { }

  isRowVisible(game): boolean {
    if (this.selectedList === 'null') {
      return true;
    }
    if (game && game.gsx$list) {
      if (game.gsx$list.$t === this.selectedList) {
        return true;
      }
    }
    return false;
  }

  isSustainLinkVisible(): boolean {
    if ('A' === this.selectedList || 'B' === this.selectedList) {
      return true;
    }
    return false;
  }

  getClassName(game): string {
    if (game && game.gsx$complexity) {
      switch (game.gsx$complexity.$t) {
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
    this.listService.getList().subscribe(data => {
      if (data && data.feed) {
        this.list = data.feed.entry;
      } else {
        this.list = [];
      }

      this.selectedList = '' + this.route.snapshot.paramMap.get('list');
      console.error('lista selezionata', this.selectedList);

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
