import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonAlert, IonToast,
  IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  downloadOutline, cloudUploadOutline, trashOutline,
  informationCircleOutline, chevronForwardOutline, heartOutline
} from 'ionicons/icons';
import { MemoryService } from '../../core/services/memory.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonAlert, IonToast,
    IonBackButton,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="settings-content">

      <!-- Backup Section -->
      <div class="settings-section">
        <div class="section-title">Backup & Restore</div>

        <div class="settings-card">
          <div class="settings-item" (click)="exportBackup()">
            <div class="item-icon" style="background: #e8f4e8;">
              <ion-icon name="download-outline" style="color: #4a9d4a;"></ion-icon>
            </div>
            <div class="item-text">
              <div class="item-label">Export Backup</div>
              <div class="item-hint">Save all memories as a JSON file</div>
            </div>
            <ion-icon name="chevron-forward-outline" class="item-chevron"></ion-icon>
          </div>

          <div class="item-divider"></div>

          <div class="settings-item" (click)="importTrigger.click()">
            <div class="item-icon" style="background: #e8eef8;">
              <ion-icon name="cloud-upload-outline" style="color: #4a70c0;"></ion-icon>
            </div>
            <div class="item-text">
              <div class="item-label">Import Backup</div>
              <div class="item-hint">Restore from a backup JSON file</div>
            </div>
            <ion-icon name="chevron-forward-outline" class="item-chevron"></ion-icon>
          </div>
          <input #importTrigger type="file" accept=".json" style="display:none"
            (change)="importBackup($event)" />
        </div>
      </div>

      <!-- Data Section -->
      <div class="settings-section">
        <div class="section-title">Data</div>
        <div class="settings-card">
          <div class="settings-item danger" (click)="showResetAlert.set(true)">
            <div class="item-icon" style="background: #fde8e8;">
              <ion-icon name="trash-outline" style="color: #d04040;"></ion-icon>
            </div>
            <div class="item-text">
              <div class="item-label" style="color: #d04040;">Reset All Data</div>
              <div class="item-hint">Delete all memories and profile</div>
            </div>
            <ion-icon name="chevron-forward-outline" class="item-chevron"></ion-icon>
          </div>
        </div>
      </div>

      <!-- App Info -->
      <div class="settings-section">
        <div class="section-title">About</div>
        <div class="settings-card info-card">
          <div class="app-logo-row">
            <span class="logo-emoji">🌸</span>
            <div>
              <div class="app-name-text">Little Memories</div>
              <div class="app-version">Version 1.0.0</div>
            </div>
          </div>
          <p class="app-desc">
            A private, offline-first app to preserve your child's most precious moments.
            No account required. All data stays on your device.
          </p>
          <div class="made-with">Made with <ion-icon name="heart-outline" style="color:#e05070;"></ion-icon> for parents everywhere</div>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-chip">
          <div class="stat-n">{{ memoryService.memoryCount() }}</div>
          <div class="stat-l">Memories saved</div>
        </div>
        <div class="stat-chip">
          <div class="stat-n">{{ photoCount() }}</div>
          <div class="stat-l">Photos stored</div>
        </div>
      </div>

      <div style="height: 40px;"></div>
    </ion-content>

    <!-- Reset Alert -->
    <ion-alert
      [isOpen]="showResetAlert()"
      header="Reset All Data"
      message="This will permanently delete all memories, photos, and your child's profile. This cannot be undone."
      [buttons]="resetButtons"
      (didDismiss)="showResetAlert.set(false)"
    ></ion-alert>

    <ion-toast
      [isOpen]="showToast()"
      [message]="toastMsg()"
      duration="3000"
      (didDismiss)="showToast.set(false)"
    ></ion-toast>
  `,
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  readonly memoryService = inject(MemoryService);
  private router = inject(Router);

  readonly showResetAlert = signal(false);
  readonly showToast = signal(false);
  readonly toastMsg = signal('');

  readonly resetButtons = [
    { text: 'Cancel', role: 'cancel' },
    {
      text: 'Delete Everything',
      role: 'destructive',
      handler: () => this.resetData(),
    },
  ];

  constructor() {
    addIcons({ downloadOutline, cloudUploadOutline, trashOutline, informationCircleOutline, chevronForwardOutline, heartOutline });
  }

  photoCount() {
    return this.memoryService.memories().reduce((s, m) => s + m.photos.length, 0);
  }

  exportBackup() {
    const data = this.memoryService.exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `little-memories-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('Backup exported successfully!');
  }

  async importBackup(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await this.memoryService.importData(data);
      this.toast(`Restored ${data.memories?.length ?? 0} memories!`);
    } catch (err: any) {
      this.toast('Import failed. Please check the file.');
    }

    // reset input
    (event.target as HTMLInputElement).value = '';
  }

  async resetData() {
    await this.memoryService.resetAllData();
    this.toast('All data has been deleted');
    setTimeout(() => this.router.navigate(['/tabs/home'], { replaceUrl: true }), 800);
  }

  private toast(msg: string) {
    this.toastMsg.set(msg);
    this.showToast.set(true);
  }
}
