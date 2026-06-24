import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton,
  IonIcon, IonCard, IonCardContent, IonButton, IonButtons, IonBadge,
  IonAvatar, IonImg, IonSkeletonText, IonLabel, IonChip
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, settingsOutline, heartOutline, calendarOutline, imagesOutline } from 'ionicons/icons';
import { MemoryService } from '../../core/services/memory.service';
import { CATEGORY_META } from '../../core/models/memory.model';
import { MemoryCardComponent } from '../../shared/components/memory-card/memory-card.component';
import { AgePipe } from '../../shared/pipes/age.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, DatePipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton,
    IonIcon, IonCard, IonCardContent, IonButton, IonButtons, IonBadge,
    IonAvatar, IonImg, IonSkeletonText, IonLabel, IonChip,
    MemoryCardComponent, AgePipe,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>
          <div class="app-title">
            <span class="app-logo">🌸</span>
            Little Memories
          </div>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="goSettings()">
            <ion-icon name="settings-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="home-content">

      <!-- Child Profile Card -->
      <div class="profile-card" (click)="goProfile()">
        <div class="profile-avatar">
          @if (child()?.photoUri) {
            <ion-avatar class="avatar-lg">
              <ion-img [src]="child()!.photoUri"></ion-img>
            </ion-avatar>
          } @else {
            <div class="avatar-placeholder">
              {{ child()?.name?.charAt(0) ?? '👶' }}
            </div>
          }
        </div>
        <div class="profile-info">
          @if (child()) {
            <h2 class="child-name">{{ child()!.name }}</h2>
            <p class="child-age">{{ child()!.dateOfBirth | age }}</p>
            <p class="child-dob">Born {{ child()!.dateOfBirth | date:'MMMM d, yyyy' }}</p>
          } @else {
            <h2 class="child-name">Add your child</h2>
            <p class="child-age">Tap to set up your child's profile</p>
          }
        </div>
        <div class="profile-chevron">›</div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-item">
          <div class="stat-value">{{ memoryCount() }}</div>
          <div class="stat-label">Memories</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">{{ milestoneCount() }}</div>
          <div class="stat-label">Milestones</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">{{ photoCount() }}</div>
          <div class="stat-label">Photos</div>
        </div>
      </div>

      <!-- Recent Memories -->
      <div class="section-header">
        <h3 class="section-title">Recent Memories</h3>
        @if (memoryCount() > 0) {
          <ion-button fill="clear" size="small" (click)="goTimeline()">
            See all
          </ion-button>
        }
      </div>

      @if (recentMemories().length === 0) {
        <div class="empty-state">
          <div class="empty-emoji">📷</div>
          <h3>No memories yet</h3>
          <p>Tap the + button below to save your first memory</p>
          <ion-button class="lm-btn-primary" (click)="addMemory()">
            Add First Memory
          </ion-button>
        </div>
      } @else {
        @for (memory of recentMemories(); track memory.id) {
          <app-memory-card [memory]="memory" (click)="openMemory(memory.id)"></app-memory-card>
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
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  private router = inject(Router);
  private memoryService = inject(MemoryService);

  readonly child = this.memoryService.childProfile;
  readonly recentMemories = this.memoryService.recentMemories;
  readonly memoryCount = this.memoryService.memoryCount;

  readonly milestoneCount = computed(() =>
    this.memoryService.memories().filter(m =>
      ['birth','first-smile','first-laugh','first-tooth','first-crawl',
       'first-walk','first-word','first-birthday','first-school'].includes(m.category)
    ).length
  );

  readonly photoCount = computed(() =>
    this.memoryService.memories().reduce((sum, m) => sum + m.photos.length, 0)
  );

  constructor() {
    addIcons({ add, settingsOutline, heartOutline, calendarOutline, imagesOutline });
  }

  addMemory() { this.router.navigate(['/add-memory']); }
  goTimeline() { this.router.navigate(['/tabs/timeline']); }
  goProfile() { this.router.navigate(['/tabs/profile']); }
  goSettings() { this.router.navigate(['/settings']); }
  openMemory(id: string) { this.router.navigate(['/memory', id]); }
}
