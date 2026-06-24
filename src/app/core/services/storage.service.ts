import { Injectable, inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class StorageService {

  private readonly PREFIX = 'lm_';

  async get<T>(key: string): Promise<T | null> {
    try {
      const { value } = await Preferences.get({ key: this.PREFIX + key });
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    await Preferences.set({
      key: this.PREFIX + key,
      value: JSON.stringify(value)
    });
  }

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key: this.PREFIX + key });
  }

  async clear(): Promise<void> {
    await Preferences.clear();
  }

  async keys(): Promise<string[]> {
    const { keys } = await Preferences.keys();
    return keys.filter(k => k.startsWith(this.PREFIX)).map(k => k.replace(this.PREFIX, ''));
  }
}
