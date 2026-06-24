import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonIcon, IonImg, IonAvatar, IonActionSheet, IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, createOutline, checkmarkOutline } from 'ionicons/icons';
import { MemoryService } from '../../core/services/memory.service';
import { CameraService } from '../../core/services/camera.service';
import { ChildProfile } from '../../core/models/memory.model';
import { AgePipe } from '../../shared/pipes/age.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DatePipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonImg, IonAvatar, IonActionSheet, IonToast,
    AgePipe,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Child Profile</ion-title>
        <ion-buttons slot="end">
          @if (editing()) {
            <ion-button fill="clear" (click)="save()">
              <ion-icon name="checkmark-outline" slot="icon-only"></ion-icon>
            </ion-button>
          } @else {
            <ion-button fill="clear" (click)="editing.set(true)">
              <ion-icon name="create-outline" slot="icon-only"></ion-icon>
            </ion-button>
          }
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="profile-content">

      <!-- Avatar -->
      <div class="avatar-section">
        <div class="avatar-wrap" (click)="editing() && pickPhoto()">
          @if (photoUri()) {
            <ion-img [src]="photoUri()" class="avatar-img"></ion-img>
          } @else {
            <div class="avatar-placeholder">
              {{ name ? name.charAt(0).toUpperCase() : '👶' }}
            </div>
          }
          @if (editing()) {
            <div class="avatar-overlay">
              <ion-icon name="camera-outline"></ion-icon>
            </div>
          }
        </div>
      </div>

      <!-- Form / Display -->
      <div class="profile-form">
        @if (editing()) {
          <!-- Edit mode -->
          <div class="form-field">
            <label class="field-label">Child's Name *</label>
            <input class="field-input" type="text" [(ngModel)]="name" placeholder="Enter name" />
          </div>
          <div class="form-field">
            <label class="field-label">Date of Birth *</label>
            <input class="field-input" type="date" [(ngModel)]="dateOfBirth" [max]="todayStr" />
          </div>
          <div class="form-field">
            <label class="field-label">Gender</label>
            <div class="gender-row">
              @for (g of genders; track g.value) {
                <div
                  class="gender-chip"
                  [class.selected]="gender === g.value"
                  (click)="gender = g.value"
                >{{ g.label }}</div>
              }
            </div>
          </div>
          <button class="lm-btn-primary" [disabled]="!name || !dateOfBirth" (click)="save()">
            Save Profile
          </button>
        } @else {
          <!-- Display mode -->
          @if (memoryService.childProfile()) {
            <div class="info-card">
              <div class="info-name">{{ memoryService.childProfile()!.name }}</div>
              <div class="info-age">{{ memoryService.childProfile()!.dateOfBirth | age }}</div>
              <div class="info-dob">Born {{ memoryService.childProfile()!.dateOfBirth | date:'MMMM d, yyyy' }}</div>
            </div>
            <div class="stats-card">
              <div class="stat-item">
                <div class="stat-num">{{ memoryService.memoryCount() }}</div>
                <div class="stat-lbl">Memories</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-num">{{ photoCount() }}</div>
                <div class="stat-lbl">Photos</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-num">{{ monthsOld() }}</div>
                <div class="stat-lbl">Months Old</div>
              </div>
            </div>
          } @else {
            <div class="empty-profile">
              <div class="empty-emoji">👶</div>
              <h3>Set up your child's profile</h3>
              <p>Add your child's name and birthday to get started</p>
              <button class="lm-btn-primary" (click)="editing.set(true)">
                Add Child Profile
              </button>
            </div>
          }
        }
      </div>

    </ion-content>

    <ion-toast
      [isOpen]="showToast()"
      [message]="toastMessage()"
      duration="2000"
      (didDismiss)="showToast.set(false)"
    ></ion-toast>
  `,
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  readonly memoryService = inject(MemoryService);
  private cameraService = inject(CameraService);

  editing = signal(false);
  showToast = signal(false);
  toastMessage = signal('');

  name = '';
  dateOfBirth = '';
  gender: 'boy' | 'girl' | 'prefer-not-to-say' = 'prefer-not-to-say';
  photoUri = signal<string | undefined>(undefined);
  todayStr = new Date().toISOString().split('T')[0];

  readonly genders = [
    { value: 'boy' as const, label: '👦 Boy' },
    { value: 'girl' as const, label: '👧 Girl' },
    { value: 'prefer-not-to-say' as const, label: '🌈 Other' },
  ];

  photoCount() {
    return this.memoryService.memories().reduce((s, m) => s + m.photos.length, 0);
  }

  monthsOld() {
    const dob = this.memoryService.childProfile()?.dateOfBirth;
    if (!dob) return 0;
    const birth = new Date(dob);
    const now = new Date();
    return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  }

  constructor() {
    addIcons({ cameraOutline, createOutline, checkmarkOutline });
  }

  ngOnInit() {
    const profile = this.memoryService.childProfile();
    if (profile) {
      this.name = profile.name;
      this.dateOfBirth = profile.dateOfBirth;
      this.gender = profile.gender;
      this.photoUri.set(profile.photoUri);
    } else {
      this.editing.set(true);
    }
  }

  async pickPhoto() {
    try {
      const photos = await this.cameraService.pickFromGallery();
      if (photos[0]) this.photoUri.set(photos[0]);
    } catch {
      try {
        const photos = await this.cameraService.pickFromGalleryWeb();
        if (photos[0]) this.photoUri.set(photos[0]);
      } catch {}
    }
  }

  async save() {
    if (!this.name || !this.dateOfBirth) return;
    const profile: ChildProfile = {
      name: this.name.trim(),
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      photoUri: this.photoUri(),
    };
    await this.memoryService.saveChildProfile(profile);
    this.editing.set(false);
    this.toastMessage.set('Profile saved!');
    this.showToast.set(true);
  }
}
