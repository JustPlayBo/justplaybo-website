import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ListService],
  standalone: false,
})
export class ListComponent implements OnInit {
  list: any[] = [];
  filteredList: any[] = [];
  selectedList: string | null = null;
  title = 'La Nostra Collezione';
  loading = false;
  searchTerm = '';

  displayedColumns = ['name', 'players', 'duration', 'complexity', 'bggurl'];

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
  ) {
    this.listService.loaded.subscribe(() => this.updateList());
  }

  ngOnInit() {
    this.loading = true;
    this.selectedList = this.route.snapshot.paramMap.get('list');
    this.title = this.computeTitle(this.selectedList);
  }

  isRowVisible(game: any): boolean {
    if (!this.selectedList) return true;
    if (!game?.list) return true;
    return game.list.$t === this.selectedList;
  }

  isSustainLinkVisible(): boolean {
    return this.selectedList === 'A' || this.selectedList === 'B';
  }

  getClassName(game: any): string {
    switch (game?.complexity?.$t) {
      case 'Semplice': return 'green';
      case 'Media': return 'yellow';
      case 'Elevata': return 'red';
      default: return 'gray';
    }
  }

  onSearchInput(term: string) {
    this.searchTerm = term;
    this.applyFilter();
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilter();
  }

  private applyFilter() {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) {
      this.filteredList = this.list;
      return;
    }
    this.filteredList = this.list.filter(g => {
      const fields = [g?.titolo, g?.players, g?.duration, g?.complexity];
      return fields.some(v =>
        v != null && String(v).toLowerCase().includes(q),
      );
    });
  }

  private computeTitle(selectedList: string | null): string {
    switch (selectedList) {
      case 'A': return 'Lista A';
      case 'B': return 'Lista B';
      default: return 'La Nostra Collezione';
    }
  }

  private updateList() {
    this.listService.getList().subscribe(data => {
      this.loading = false;
      this.list = data?.length ? data : [];
      this.applyFilter();
    });
  }
}
