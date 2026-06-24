import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, homeOutline, timeOutline, time, imagesOutline, images, personOutline, person } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" class="lm-tab-bar">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon name="home-outline" class="tab-icon"></ion-icon>
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="timeline" href="/tabs/timeline">
          <ion-icon name="time-outline" class="tab-icon"></ion-icon>
          <ion-label>Timeline</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="gallery" href="/tabs/gallery">
          <ion-icon name="images-outline" class="tab-icon"></ion-icon>
          <ion-label>Gallery</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon name="person-outline" class="tab-icon"></ion-icon>
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    .lm-tab-bar {
      --background: var(--lm-surface);
      --border: 0.5px solid var(--lm-border);
      padding-bottom: env(safe-area-inset-bottom);
      height: calc(56px + env(safe-area-inset-bottom));
    }
    ion-tab-button {
      --color: var(--lm-muted);
      --color-selected: var(--lm-primary);
      font-size: 10px;
    }
    .tab-icon { font-size: 22px; }
  `],
})
export class TabsComponent {
  constructor() {
    addIcons({ home, homeOutline, timeOutline, time, imagesOutline, images, personOutline, person });
  }
}
