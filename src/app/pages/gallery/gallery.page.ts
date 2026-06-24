import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
  IonButton, IonButtons, IonModal, IonImg
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';
import { MemoryService } from '../../core/services/memory.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
    IonButton, IonButtons, IonModal, IonImg,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Gallery</ion-title>
      </ion-toolbar>
      <!-- Year filter -->
      @if (years().length > 1) {
        <div class="year-filter">
          <div
            class="year-chip"
            [class.active]="activeYear() === null"
            (click)="activeYear.set(null)"
          >All</div>
          @for (year of years(); track year) {
            <div
              class="year-chip"
              [class.active]="activeYear() === year"
              (click)="activeYear.set(year)"
            >{{ year }}</div>
          }
        </div>
      }
    </ion-header>

    <ion-content class="gallery-content">
      @if (filteredPhotos().length === 0) {
        <div class="empty-state">
          <div class="empty-emoji">🖼️</div>
          <h3>No photos yet</h3>
          <p>Add memories with photos to see them here</p>
        </div>
      } @else {
        <div class="photo-grid">
          @for (item of filteredPhotos(); track $index) {
            <div class="grid-cell" (click)="openFullscreen($index)">
              <ion-img [src]="item.photo" class="grid-img"></ion-img>
            </div>
          }
        </div>
      }
      <div style="height: 60px;"></div>
    </ion-content>

    <!-- Fullscreen Modal -->
    <ion-modal
      [isOpen]="fullscreenOpen()"
      [breakpoints]="[0, 1]"
      [initialBreakpoint]="1"
      (didDismiss)="closeFullscreen()"
    >
      <ng-template>
        <div class="fullscreen-view">
          <button class="fs-close" (click)="closeFullscreen()">
            <ion-icon name="close-outline"></ion-icon>
          </button>

          <div class="fs-img-wrap">
            <ion-img
              [src]="filteredPhotos()[fullscreenIndex()]?.photo"
              class="fs-img"
            ></ion-img>
          </div>

          <div class="fs-caption" (click)="goToMemory()">
            {{ filteredPhotos()[fullscreenIndex()]?.memory?.title }}
          </div>

          <div class="fs-controls">
            <button class="fs-btn" (click)="prevPhoto()" [disabled]="fullscreenIndex() === 0">
              <ion-icon name="chevron-back-outline"></ion-icon>
            </button>
            <div class="fs-counter">
              {{ fullscreenIndex() + 1 }} / {{ filteredPhotos().length }}
            </div>
            <button class="fs-btn" (click)="nextPhoto()" [disabled]="fullscreenIndex() >= filteredPhotos().length - 1">
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>
          </div>
        </div>
      </ng-template>
    </ion-modal>
  `,
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage {
  private router = inject(Router);
  private memoryService = inject(MemoryService);

  readonly activeYear = signal<number | null>(null);
  readonly fullscreenOpen = signal(false);
  readonly fullscreenIndex = signal(0);

  readonly years = computed(() => {
    const set = new Set<number>();
    for (const item of this.memoryService.allPhotos()) {
      set.add(new Date(item.memory.date).getFullYear());
    }
    return Array.from(set).sort((a, b) => b - a);
  });

  readonly filteredPhotos = computed(() => {
    const all = this.memoryService.allPhotos();
    const year = this.activeYear();
    if (!year) return all;
    return all.filter(item => new Date(item.memory.date).getFullYear() === year);
  });

  constructor() {
    addIcons({ closeOutline, chevronForwardOutline, chevronBackOutline });
  }

  openFullscreen(index: number) {
    this.fullscreenIndex.set(index);
    this.fullscreenOpen.set(true);
  }

  closeFullscreen() { this.fullscreenOpen.set(false); }

  prevPhoto() {
    const i = this.fullscreenIndex();
    if (i > 0) this.fullscreenIndex.set(i - 1);
  }

  nextPhoto() {
    const i = this.fullscreenIndex();
    if (i < this.filteredPhotos().length - 1) this.fullscreenIndex.set(i + 1);
  }

  goToMemory() {
    const item = this.filteredPhotos()[this.fullscreenIndex()];
    if (item) {
      this.closeFullscreen();
      this.router.navigate(['/memory', item.memory.id]);
    }
  }
}
