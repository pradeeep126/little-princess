import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonIcon, IonActionSheet, IonToast, IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline, cameraOutline, imagesOutline, trashOutline,
  checkmarkOutline, closeOutline, chevronBackOutline
} from 'ionicons/icons';
import { MemoryService } from '../../core/services/memory.service';
import { CameraService } from '../../core/services/camera.service';
import { Memory, MemoryCategory, CATEGORY_META } from '../../core/models/memory.model';

@Component({
  selector: 'app-add-memory',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonActionSheet, IonToast, IonBackButton,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>{{ isEdit() ? 'Edit Memory' : 'New Memory' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="save()" [disabled]="!canSave()">
            <ion-icon name="checkmark-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="add-content">

      <!-- Photo Upload Area -->
      <div class="photo-section">
        @if (selectedPhotos().length === 0) {
          <div class="photo-placeholder" (click)="presentPhotoAction()">
            <ion-icon name="images-outline"></ion-icon>
            <p>Add Photos</p>
            <span>Tap to select from gallery</span>
          </div>
        } @else {
          <div class="photo-preview-grid">
            @for (photo of selectedPhotos(); track $index) {
              <div class="photo-thumb">
                <img [src]="photo" style="width:100%;height:100%;object-fit:cover;" />
                <button class="remove-photo" (click)="removePhoto($index)">
                  <ion-icon name="close-outline"></ion-icon>
                </button>
              </div>
            }
            @if (selectedPhotos().length < 5) {
              <div class="add-more-photo" (click)="presentPhotoAction()">
                <ion-icon name="add-outline"></ion-icon>
              </div>
            }
          </div>
        }
      </div>

      <!-- Form Fields -->
      <div class="form-section">

        <div class="form-field">
          <label class="field-label">Memory Title *</label>
          <input
            class="field-input"
            type="text"
            placeholder="What happened?"
            [(ngModel)]="title"
            maxlength="80"
          />
        </div>

        <div class="form-field">
          <label class="field-label">Date *</label>
          <input
            class="field-input"
            type="date"
            [(ngModel)]="date"
            [max]="todayStr"
          />
        </div>

        <div class="form-field">
          <label class="field-label">Category</label>
          <div class="category-grid">
            @for (cat of categories; track cat.key) {
              <div
                class="cat-chip"
                [class.selected]="category() === cat.key"
                (click)="category.set(cat.key)"
                [style.--cat-color]="cat.color"
              >
                <span>{{ cat.label }}</span>
              </div>
            }
          </div>
        </div>

        <div class="form-field">
          <label class="field-label">Your Notes</label>
          <textarea
            class="field-textarea"
            placeholder="Write about this special moment…"
            [(ngModel)]="notes"
            rows="4"
            maxlength="1000"
          ></textarea>
          <div class="char-count">{{ notes.length }}/1000</div>
        </div>

      </div>

      <div class="save-section">
        <button class="lm-btn-primary" [disabled]="!canSave()" (click)="save()">
          {{ isEdit() ? 'Update Memory' : 'Save Memory 🌸' }}
        </button>
      </div>

      <div style="height: 40px;"></div>
    </ion-content>

    <ion-action-sheet
      [isOpen]="showPhotoSheet()"
      header="Add Photos"
      [buttons]="photoSheetButtons"
      (didDismiss)="showPhotoSheet.set(false)"
    ></ion-action-sheet>

    <ion-toast
      [isOpen]="showToast()"
      [message]="toastMessage()"
      duration="2500"
      position="bottom"
      (didDismiss)="showToast.set(false)"
    ></ion-toast>
  `,
  styleUrls: ['./add-memory.page.scss'],
})
export class AddMemoryPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private memoryService = inject(MemoryService);
  private cameraService = inject(CameraService);

  title = '';
  date = new Date().toISOString().split('T')[0];
  notes = '';
  todayStr = new Date().toISOString().split('T')[0];

  readonly category = signal<MemoryCategory>('everyday');
  readonly selectedPhotos = signal<string[]>([]);
  readonly showPhotoSheet = signal(false);
  readonly showToast = signal(false);
  readonly toastMessage = signal('');
  readonly editId = signal<string | null>(null);
  readonly isEdit = computed(() => this.editId() !== null);
  readonly canSave = computed(() => this.title.trim().length > 0 && this.date.length > 0);

  readonly categories = Object.entries(CATEGORY_META).map(([key, meta]) => ({
    key: key as MemoryCategory,
    ...meta,
  }));

  readonly photoSheetButtons = [
    {
      text: 'Choose from Gallery',
      icon: 'images-outline',
      handler: () => this.pickFromGallery(),
    },
    {
      text: 'Take Photo',
      icon: 'camera-outline',
      handler: () => this.takePhoto(),
    },
    { text: 'Cancel', role: 'cancel' },
  ];

  constructor() {
    addIcons({ addOutline, cameraOutline, imagesOutline, trashOutline, checkmarkOutline, closeOutline, chevronBackOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const memory = this.memoryService.getMemoryById(id);
      if (memory) {
        this.editId.set(id);
        this.title = memory.title;
        this.date = memory.date;
        this.notes = memory.notes;
        this.category.set(memory.category);
        this.selectedPhotos.set([...memory.photos]);
      }
    }
  }

  presentPhotoAction() { this.showPhotoSheet.set(true); }

  async pickFromGallery() {
    try {
      const photos = await this.cameraService.pickFromGallery();
      this.selectedPhotos.set([...this.selectedPhotos(), ...photos].slice(0, 5));
    } catch {
      try {
        const photos = await this.cameraService.pickFromGalleryWeb();
        this.selectedPhotos.set([...this.selectedPhotos(), ...photos].slice(0, 5));
      } catch {
        this.toast('Could not access photos');
      }
    }
  }

  async takePhoto() {
    try {
      const photo = await this.cameraService.takePhoto();
      if (photo) this.selectedPhotos.set([...this.selectedPhotos(), photo].slice(0, 5));
    } catch {
      this.toast('Could not access camera');
    }
  }

  removePhoto(index: number) {
    this.selectedPhotos.set(this.selectedPhotos().filter((_, i) => i !== index));
  }

  async save() {
    if (!this.canSave()) return;
    const data = {
      title: this.title.trim(),
      date: this.date,
      category: this.category(),
      notes: this.notes.trim(),
      photos: this.selectedPhotos(),
    };
    if (this.isEdit()) {
      await this.memoryService.updateMemory(this.editId()!, data);
      this.toast('Memory updated!');
    } else {
      await this.memoryService.addMemory(data);
      this.toast('Memory saved! 🌸');
    }
    setTimeout(() => this.router.navigate(['/tabs/home']), 600);
  }

  private toast(msg: string) {
    this.toastMessage.set(msg);
    this.showToast.set(true);
  }
}
