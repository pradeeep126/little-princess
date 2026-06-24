import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonSelect, IonSelectOption, IonIcon, IonButton, IonButtons,
  IonChip, IonLabel, IonFab, IonFabButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, filterOutline, searchOutline } from 'ionicons/icons';
import { MemoryService } from '../../core/services/memory.service';
import { Memory, MemoryCategory, CATEGORY_META } from '../../core/models/memory.model';
import { MemoryCardComponent } from '../../shared/components/memory-card/memory-card.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
    IonSelect, IonSelectOption, IonIcon, IonButton, IonButtons,
    IonChip, IonLabel, IonFab, IonFabButton,
    MemoryCardComponent,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Timeline</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="showFilter.set(!showFilter())">
            <ion-icon name="filter-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          [(ngModel)]="searchQuery"
          (ionInput)="onSearch()"
          placeholder="Search memories…"
          [debounce]="300"
          class="lm-searchbar"
        ></ion-searchbar>
      </ion-toolbar>
      @if (showFilter()) {
        <div class="filter-chips">
          <div
            class="filter-chip"
            [class.active]="activeCategory() === null"
            (click)="setCategory(null)"
          >All</div>
          @for (cat of categories; track cat.key) {
            <div
              class="filter-chip"
              [class.active]="activeCategory() === cat.key"
              (click)="setCategory(cat.key)"
            >
              <ion-icon [name]="cat.icon" style="font-size:12px;"></ion-icon>
              {{ cat.label }}
            </div>
          }
        </div>
      }
    </ion-header>

    <ion-content class="timeline-content">
      @if (filteredMemories().length === 0) {
        <div class="empty-state">
          <div class="empty-emoji">🔍</div>
          <h3>No memories found</h3>
          <p>Try a different search or add a new memory</p>
        </div>
      } @else {
        @for (yearEntry of memoriesByYear(); track yearEntry.year) {
          <div class="year-section">
            <div class="year-header">
              <div class="year-line"></div>
              <div class="year-badge">{{ yearEntry.year }}</div>
              <div class="year-line"></div>
            </div>
            <div class="timeline-list">
              @for (memory of yearEntry.memories; track memory.id) {
                <div class="timeline-item">
                  <div class="tl-connector">
                    <div class="tl-dot" [style.background]="getCatColor(memory.category)"></div>
                    <div class="tl-line"></div>
                  </div>
                  <app-memory-card
                    [memory]="memory"
                    class="tl-card"
                    (click)="openMemory(memory.id)"
                  ></app-memory-card>
                </div>
              }
            </div>
          </div>
        }
      }
      <div style="height: 100px;"></div>
    </ion-content>

    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button class="lm-fab" (click)="addMemory()">
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  `,
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage {
  private router = inject(Router);
  private memoryService = inject(MemoryService);

  searchQuery = '';
  readonly showFilter = signal(false);
  readonly activeCategory = signal<MemoryCategory | null>(null);

  readonly categories = Object.entries(CATEGORY_META).map(([key, meta]) => ({
    key: key as MemoryCategory, ...meta,
  }));

  readonly filteredMemories = computed(() =>
    this.memoryService.searchMemories(this.searchQuery, this.activeCategory() ?? undefined)
  );

  readonly memoriesByYear = computed(() => {
    const map = new Map<number, Memory[]>();
    for (const m of this.filteredMemories()) {
      const year = new Date(m.date).getFullYear();
      if (!map.has(year)) map.set(year, []);
      map.get(year)!.push(m);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, memories]) => ({ year, memories }));
  });

  constructor() {
    addIcons({ add, filterOutline, searchOutline });
  }

  onSearch() { /* reactive via computed */ }
  setCategory(cat: MemoryCategory | null) { this.activeCategory.set(cat); }
  getCatColor(cat: MemoryCategory) { return CATEGORY_META[cat]?.color ?? '#9888a0'; }
  openMemory(id: string) { this.router.navigate(['/memory', id]); }
  addMemory() { this.router.navigate(['/add-memory']); }
}
