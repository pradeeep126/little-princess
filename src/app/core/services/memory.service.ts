import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Memory, ChildProfile, MemoryCategory, AppData } from '../models/memory.model';
import { StorageService } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  MEMORIES: 'memories',
  CHILD: 'child_profile',
  VERSION: 'data_version',
} as const;

const DATA_VERSION = 1;

@Injectable({ providedIn: 'root' })
export class MemoryService {
  private storage = inject(StorageService);

  // --- Signals ---
  readonly memories = signal<Memory[]>([]);
  readonly childProfile = signal<ChildProfile | null>(null);
  readonly isLoaded = signal(false);

  // --- Computed ---
  readonly memoriesSortedByDate = computed(() =>
    [...this.memories()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );

  readonly memoryCount = computed(() => this.memories().length);

  readonly recentMemories = computed(() => this.memoriesSortedByDate().slice(0, 5));

  readonly memoriesByYear = computed(() => {
    const map = new Map<number, Memory[]>();
    for (const m of this.memoriesSortedByDate()) {
      const year = new Date(m.date).getFullYear();
      if (!map.has(year)) map.set(year, []);
      map.get(year)!.push(m);
    }
    return map;
  });

  readonly allPhotos = computed(() =>
    this.memoriesSortedByDate()
      .flatMap(m => m.photos.map(p => ({ photo: p, memory: m })))
  );

  // --- Init ---
  async init(): Promise<void> {
    const [memories, child] = await Promise.all([
      this.storage.get<Memory[]>(STORAGE_KEYS.MEMORIES),
      this.storage.get<ChildProfile>(STORAGE_KEYS.CHILD),
    ]);
    this.memories.set(memories ?? []);
    this.childProfile.set(child ?? null);
    this.isLoaded.set(true);
  }

  // --- Memory CRUD ---
  async addMemory(data: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memory> {
    const now = new Date().toISOString();
    const memory: Memory = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...this.memories(), memory];
    this.memories.set(updated);
    await this.storage.set(STORAGE_KEYS.MEMORIES, updated);
    return memory;
  }

  async updateMemory(id: string, changes: Partial<Omit<Memory, 'id' | 'createdAt'>>): Promise<void> {
    const updated = this.memories().map(m =>
      m.id === id ? { ...m, ...changes, updatedAt: new Date().toISOString() } : m
    );
    this.memories.set(updated);
    await this.storage.set(STORAGE_KEYS.MEMORIES, updated);
  }

  async deleteMemory(id: string): Promise<void> {
    const updated = this.memories().filter(m => m.id !== id);
    this.memories.set(updated);
    await this.storage.set(STORAGE_KEYS.MEMORIES, updated);
  }

  getMemoryById(id: string): Memory | undefined {
    return this.memories().find(m => m.id === id);
  }

  searchMemories(query: string, category?: MemoryCategory): Memory[] {
    const q = query.toLowerCase().trim();
    return this.memoriesSortedByDate().filter(m => {
      const matchesSearch = !q ||
        m.title.toLowerCase().includes(q) ||
        m.notes.toLowerCase().includes(q);
      const matchesCategory = !category || m.category === category;
      return matchesSearch && matchesCategory;
    });
  }

  // --- Child Profile ---
  async saveChildProfile(profile: ChildProfile): Promise<void> {
    this.childProfile.set(profile);
    await this.storage.set(STORAGE_KEYS.CHILD, profile);
  }

  // --- Backup & Restore ---
  exportData(): AppData {
    return {
      version: DATA_VERSION,
      child: this.childProfile(),
      memories: this.memories(),
      exportedAt: new Date().toISOString(),
    };
  }

  async importData(data: AppData): Promise<void> {
    if (data.version !== DATA_VERSION) {
      throw new Error('Incompatible backup version');
    }
    this.memories.set(data.memories ?? []);
    this.childProfile.set(data.child ?? null);
    await Promise.all([
      this.storage.set(STORAGE_KEYS.MEMORIES, data.memories ?? []),
      this.storage.set(STORAGE_KEYS.CHILD, data.child ?? null),
    ]);
  }

  async resetAllData(): Promise<void> {
    await this.storage.clear();
    this.memories.set([]);
    this.childProfile.set(null);
  }
}
