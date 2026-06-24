import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, GalleryPhoto } from '@capacitor/camera';

@Injectable({ providedIn: 'root' })
export class CameraService {

  async checkPermissions(): Promise<boolean> {
    try {
      const result = await Camera.checkPermissions();
      return result.photos === 'granted' || result.photos === 'limited';
    } catch {
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const result = await Camera.requestPermissions({ permissions: ['photos'] });
      return result.photos === 'granted' || result.photos === 'limited';
    } catch {
      return false;
    }
  }

  async pickFromGallery(): Promise<string[]> {
    const result = await Camera.pickImages({
      quality: 80,
      limit: 5,
    });

    const photos: string[] = [];
    for (const photo of result.photos) {
      const base64 = await this.galleryPhotoToBase64(photo);
      if (base64) photos.push(base64);
    }
    return photos;
  }

  async takePhoto(): Promise<string | null> {
    const photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    return photo.dataUrl ?? null;
  }

  private async galleryPhotoToBase64(photo: GalleryPhoto): Promise<string | null> {
    try {
      // Use webPath (always available on GalleryPhoto)
      if (photo.webPath) {
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      return null;
    } catch {
      return null;
    }
  }

  // Web fallback for browser testing
  async pickFromGalleryWeb(): Promise<string[]> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*';
      input.onchange = async () => {
        const files = Array.from(input.files ?? []);
        const results: string[] = [];
        for (const file of files.slice(0, 5)) {
          const b64 = await fileToBase64(file);
          if (b64) results.push(b64);
        }
        resolve(results);
      };
      input.click();
    });
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
