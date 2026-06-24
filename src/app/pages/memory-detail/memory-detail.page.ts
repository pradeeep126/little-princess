import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonIcon, IonImg, IonChip, IonLabel, IonActionSheet, IonAlert,
  IonBackButton, IonFab, IonFabButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline, ellipsisVertical, createOutline, trashOutline,
  chevronForwardOutline, chevronBackCircleOutline, chevronForwardCircleOutline,
  calendarOutline, pricetagOutline, documentTextOutline
} from 'ionicons/icons';
import { MemoryService } from '../../core/services/memory.service';
import { Memory, CATEGORY_META } from '../../core/models/memory.model';

@Component({
  selector: 'app-memory-detail',
  standalone: true,
  imports: [
    CommonModule, DatePipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonImg, IonChip, IonLabel, IonActionSheet, IonAlert,
    IonBackButton, IonFab, IonFabButton,
  ],
  template: `
    @if (memory()) {
      <ion-header class="ion-no-border detail-header">
        <ion-toolbar [style.--background]="'transparent'">
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/tabs/home" text=""></ion-back-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button fill="clear" (click)="showActions.set(true)">
              <ion-icon name="ellipsis-vertical" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="detail-content" fullscreen>

        <!-- Photo Carousel -->
        @if (memory()!.photos.length > 0) {
          <div class="photo-carousel">
            <div class="carousel-track" [style.transform]="'translateX(-' + (photoIndex() * 100) + '%)'">
              @for (photo of memory()!.photos; track $index) {
                <div class="carousel-slide">
                  <ion-img [src]="photo" class="carousel-img"></ion-img>
                </div>
              }
            </div>
            @if (memory()!.photos.length > 1) {
              <button class="carousel-prev" (click)="prevPhoto()" [hidden]="photoIndex() === 0">
                <ion-icon name="chevron-back-circle-outline"></ion-icon>
              </button>
              <button class="carousel-next" (click)="nextPhoto()" [hidden]="photoIndex() >= memory()!.photos.length - 1">
                <ion-icon name="chevron-forward-circle-outline"></ion-icon>
              </button>
              <div class="carousel-dots">
                @for (p of memory()!.photos; track $index) {
                  <div class="dot" [class.active]="$index === photoIndex()" (click)="photoIndex.set($index)"></div>
                }
              </div>
            }
          </div>
        }

        <!-- Memory Info -->
        <div class="detail-body">
          <!-- Category Tag -->
          <div class="cat-tag" [style.background]="catMeta().color + '22'" [style.color]="catMeta().color">
            <ion-icon [name]="catMeta().icon"></ion-icon>
            {{ catMeta().label }}
          </div>

          <h1 class="memory-title">{{ memory()!.title }}</h1>

          <div class="meta-row">
            <ion-icon name="calendar-outline" class="meta-icon"></ion-icon>
            <span>{{ memory()!.date | date:'MMMM d, yyyy' }}</span>
          </div>

          @if (memory()!.notes) {
            <div class="notes-section">
              <div class="notes-label">
                <ion-icon name="document-text-outline"></ion-icon>
                Our Memory Note
              </div>
              <p class="notes-text">{{ memory()!.notes }}</p>
            </div>
          }

          @if (memory()!.photos.length > 1) {
            <div class="photo-grid-section">
              <div class="section-label">All Photos</div>
              <div class="mini-grid">
                @for (photo of memory()!.photos; track $index) {
                  <div class="mini-thumb" (click)="photoIndex.set($index)">
                    <ion-img [src]="photo"></ion-img>
                    @if ($index === photoIndex()) {
                      <div class="mini-selected"></div>
                    }
                  </div>
                }
              </div>
            </div>
          }

          <div class="meta-created">
            Added {{ memory()!.createdAt | date:'MMM d, yyyy' }}
          </div>
        </div>

        <div style="height: 80px;"></div>
      </ion-content>

      <!-- Edit FAB -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button class="lm-fab-edit" (click)="editMemory()">
          <ion-icon name="create-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- Action Sheet -->
      <ion-action-sheet
        [isOpen]="showActions()"
        [buttons]="actionButtons"
        (didDismiss)="showActions.set(false)"
      ></ion-action-sheet>

      <!-- Delete Alert -->
      <ion-alert
        [isOpen]="showDeleteAlert()"
        header="Delete Memory"
        message="This memory will be permanently deleted. This cannot be undone."
        [buttons]="alertButtons"
        (didDismiss)="showDeleteAlert.set(false)"
      ></ion-alert>
    }
  `,
  styleUrls: ['./memory-detail.page.scss'],
})
export class MemoryDetailPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private memoryService = inject(MemoryService);

  readonly memory = signal<Memory | null>(null);
  readonly photoIndex = signal(0);
  readonly showActions = signal(false);
  readonly showDeleteAlert = signal(false);

  readonly catMeta = computed(() => {
    const m = this.memory();
    return m ? CATEGORY_META[m.category] : CATEGORY_META['other'];
  });

  readonly actionButtons = [
    {
      text: 'Edit Memory',
      icon: 'create-outline',
      handler: () => this.editMemory(),
    },
    {
      text: 'Delete Memory',
      role: 'destructive',
      icon: 'trash-outline',
      handler: () => this.showDeleteAlert.set(true),
    },
    { text: 'Cancel', role: 'cancel' },
  ];

  readonly alertButtons = [
    { text: 'Cancel', role: 'cancel' },
    {
      text: 'Delete',
      role: 'destructive',
      handler: () => this.deleteMemory(),
    },
  ];

  constructor() {
    addIcons({
      chevronBackOutline, ellipsisVertical, createOutline, trashOutline,
      chevronForwardOutline, chevronBackCircleOutline, chevronForwardCircleOutline,
      calendarOutline, pricetagOutline, documentTextOutline,
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const mem = this.memoryService.getMemoryById(id);
      this.memory.set(mem ?? null);
    }
  }

  prevPhoto() {
    const i = this.photoIndex();
    if (i > 0) this.photoIndex.set(i - 1);
  }

  nextPhoto() {
    const i = this.photoIndex();
    const max = (this.memory()?.photos.length ?? 1) - 1;
    if (i < max) this.photoIndex.set(i + 1);
  }

  editMemory() {
    this.router.navigate(['/edit-memory', this.memory()!.id]);
  }

  async deleteMemory() {
    await this.memoryService.deleteMemory(this.memory()!.id);
    this.router.navigate(['/tabs/home'], { replaceUrl: true });
  }
}
