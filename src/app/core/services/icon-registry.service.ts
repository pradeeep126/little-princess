import { Injectable } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  heart, heartOutline, happy, happyOutline, star, starOutline,
  footsteps, walk, chatbubble, gift, school, airplane,
  balloon, ribbon, camera, ellipse, add, settings, settingsOutline,
  filterOutline, searchOutline, home, homeOutline, timeOutline, time,
  imagesOutline, images, personOutline, person, closeOutline,
  chevronBackOutline, chevronForwardOutline, chevronBackCircleOutline,
  chevronForwardCircleOutline, ellipsisVertical, createOutline,
  trashOutline, calendarOutline, pricetagOutline, documentTextOutline,
  addOutline, cameraOutline, checkmarkOutline, downloadOutline,
  cloudUploadOutline, informationCircleOutline, chevronForward,
  heartFilled
} from 'ionicons/icons';

@Injectable({ providedIn: 'root' })
export class IconRegistryService {
  registerAll() {
    addIcons({
      heart, heartOutline, happy, happyOutline, star, starOutline,
      footsteps, walk, chatbubble, gift, school, airplane,
      balloon, ribbon, camera, ellipse, add, settings, settingsOutline,
      filterOutline, searchOutline, home, homeOutline, timeOutline, time,
      imagesOutline, images, personOutline, person, closeOutline,
      chevronBackOutline, chevronForwardOutline, chevronBackCircleOutline,
      chevronForwardCircleOutline, ellipsisVertical, createOutline,
      trashOutline, calendarOutline, pricetagOutline, documentTextOutline,
      addOutline, cameraOutline, checkmarkOutline, downloadOutline,
      cloudUploadOutline, informationCircleOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'heart-outline': heartOutline,
    });
  }
}
