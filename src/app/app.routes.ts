import { Routes } from '@angular/router';

/** Cada pantalla se carga "perezosamente" (lazy loading): solo se descarga cuando se visita. */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tarjetas' },
  {
    path: 'tarjetas',
    title: 'Mis tarjetas Bip!',
    loadComponent: () => import('./features/tarjetas/tarjetas.page').then((m) => m.TarjetasPage),
  },
  {
    path: 'tarjetas/nueva',
    title: 'Nueva tarjeta',
    loadComponent: () => import('./features/tarjetas/tarjeta-form.page').then((m) => m.TarjetaFormPage),
  },
  {
    path: 'tarjetas/:id/editar',
    title: 'Editar tarjeta',
    loadComponent: () => import('./features/tarjetas/tarjeta-form.page').then((m) => m.TarjetaFormPage),
  },
  { path: '**', redirectTo: 'tarjetas' },
];
