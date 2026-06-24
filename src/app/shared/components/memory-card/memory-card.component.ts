import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonIcon, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Memory, CATEGORY_META } from '../../../core/models/memory.model';

@Component({
  selector: 'app-memory-card',
  standalone: true,
  imports: [CommonModule, DatePipe, IonIcon, IonImg],
  template: `
    <div class="memory-card">
      @if (memory.photos.length > 0) {
        <div class="card-photo">
          <ion-img [src]="memory.photos[0]" class="card-img"></ion-img>
          @if (memory.photos.length > 1) {
            <div class="photo-count">+{{ memory.photos.length - 1 }}</div>
          }
        </div>
      }
      <div class="card-body">
        <div class="card-cat" [style.color]="catColor" [style.background]="catColor + '18'">
          <ion-icon [name]="catIcon" style="font-size: 11px;"></ion-icon>
          {{ catLabel }}
        </div>
        <div class="card-title">{{ memory.title }}</div>
        <div class="card-date">{{ memory.date | date:'MMM d, yyyy' }}</div>
        @if (memory.notes) {
          <div class="card-notes">{{ memory.notes | slice:0:80 }}{{ memory.notes.length > 80 ? '…' : '' }}</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .memory-card {
      background: var(--lm-surface);
      border-radius: 16px;
      border: 0.5px solid var(--lm-border);
      overflow: hidden;
      margin-bottom: 10px;
      display: flex;
      cursor: pointer;
      transition: opacity 0.15s;
      &:active { opacity: 0.7; }
    }

    .card-photo {
      width: 88px;
      flex-shrink: 0;
      position: relative;
      background: var(--lm-bg-alt);

      .card-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        min-height: 88px;
      }

      .photo-count {
        position: absolute;
        bottom: 4px;
        right: 4px;
        background: rgba(0,0,0,0.5);
        color: white;
        font-size: 10px;
        padding: 2px 5px;
        border-radius: 8px;
        font-weight: 600;
      }
    }

    .card-body {
      flex: 1;
      padding: 12px 14px;
      min-width: 0;
    }

    .card-cat {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 20px;
      margin-bottom: 6px;
    }

    .card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--lm-text);
      margin-bottom: 3px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .card-date {
      font-size: 12px;
      color: var(--lm-muted);
      margin-bottom: 5px;
    }

    .card-notes {
      font-size: 12px;
      color: var(--lm-text-secondary);
      line-height: 1.4;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  `],
})
export class MemoryCardComponent {
  @Input({ required: true }) memory!: Memory;

  get catMeta() { return CATEGORY_META[this.memory.category]; }
  get catColor() { return this.catMeta.color; }
  get catIcon() { return this.catMeta.icon; }
  get catLabel() { return this.catMeta.label; }

  constructor() {
    addIcons({
      heart: 'heart', happy: 'happy', 'happy-outline': 'happy-outline',
      star: 'star', footsteps: 'footsteps', walk: 'walk',
      chatbubble: 'chatbubble', gift: 'gift', school: 'school',
      airplane: 'airplane', balloon: 'balloon', ribbon: 'ribbon',
      camera: 'camera', ellipse: 'ellipse',
    });
  }
}
