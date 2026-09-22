import { Component, OnInit } from '@angular/core';
import { Game, ListService } from '../list.service';
import { ActivatedRoute } from '@angular/router';

/** Shelf of box covers, or the dense sortable table. */
export type ListView = 'shelf' | 'table';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', './list.component.kallax.scss'],
  providers: [ListService],
  standalone: false,
})
export class ListComponent implements OnInit {
  list: Game[] = [];
  filteredList: Game[] = [];
  selectedList: string | null = null;
  title = 'La Nostra Collezione';
  loading = false;
  searchTerm = '';

  displayedColumns = ['name', 'players', 'duration', 'complexity', 'bggurl'];

  view: ListView = 'shelf';
  private readonly viewKey = 'jp-list-view';

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
  ) {
    this.listService.loaded.subscribe(() => this.updateList());
    this.view = this.storedView() ?? 'shelf';
  }

  ngOnInit() {
    this.loading = true;
    this.selectedList = this.route.snapshot.paramMap.get('list');
    this.title = this.computeTitle(this.selectedList);
  }

  isRowVisible(game: Game): boolean {
    if (!this.isSustainLinkVisible()) return true;
    return game.ab?.toUpperCase() === this.selectedList;
  }

  setView(view: ListView) {
    this.view = view;
    try { localStorage.setItem(this.viewKey, view); } catch { /* private mode: keep the choice for this visit only */ }
  }

  /** Complexity as an Italian label, for the box plate on the shelf. */
  getComplexityDotClass(game: Game): string {
    return `dot-${this.getClassName(game)}`;
  }

  isSustainLinkVisible(): boolean {
    return this.selectedList === 'A' || this.selectedList === 'B';
  }

  getClassName(game: Game): string {
    switch (game?.complexity) {
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
      const fields = [g?.title, g?.players, g?.duration, g?.complexity];
      return fields.some(v =>
        v != null && String(v).toLowerCase().includes(q),
      );
    });
  }

  private storedView(): ListView | null {
    try {
      const v = localStorage.getItem(this.viewKey);
      return v === 'shelf' || v === 'table' ? v : null;
    } catch {
      return null;
    }
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
      this.list = (data ?? []).filter(g => this.isRowVisible(g));
      this.applyFilter();
    });
  }
}
