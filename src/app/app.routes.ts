import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.component').then(m => m.TabsComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
      },
      {
        path: 'timeline',
        loadComponent: () => import('./pages/timeline/timeline.page').then(m => m.TimelinePage),
      },
      {
        path: 'gallery',
        loadComponent: () => import('./pages/gallery/gallery.page').then(m => m.GalleryPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'add-memory',
    loadComponent: () => import('./pages/add-memory/add-memory.page').then(m => m.AddMemoryPage),
  },
  {
    path: 'edit-memory/:id',
    loadComponent: () => import('./pages/add-memory/add-memory.page').then(m => m.AddMemoryPage),
  },
  {
    path: 'memory/:id',
    loadComponent: () => import('./pages/memory-detail/memory-detail.page').then(m => m.MemoryDetailPage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage),
  },
  {
    path: '**',
    redirectTo: 'tabs/home',
  },
];
