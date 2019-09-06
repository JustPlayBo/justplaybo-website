import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  list: any[];

  constructor(private listService: ListService) { }

  ngOnInit() {
    this.listService.getList().subscribe(data => {
      if (data && data.feed) {
        this.list = data.feed.entry;
      } else {
        this.list = [];
      }
    });
  }
}
