import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Tarjeta } from '../../core/models/tarjeta.model';
import { ClpPipe } from '../../shared/ui/clp.pipe';
import { ConfirmDialog } from '../../shared/ui/confirm-dialog';
import { TarjetaBipCard } from './components/tarjeta-bip-card/tarjeta-bip-card';
import { FiltroEstado, TarjetasStore } from './tarjetas.store';

/**
 * Página del listado = "Controller" de la vista (MVC): es la única que conoce al store.
 * Las tarjetas las dibuja un componente presentacional (TarjetaBipCard).
 */
@Component({
  selector: 'app-tarjetas-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ClpPipe, TarjetaBipCard, ConfirmDialog],
  templateUrl: './tarjetas.page.html',
  styleUrl: './tarjetas.page.css',
})
export class TarjetasPage implements OnInit {
  protected readonly store = inject(TarjetasStore);

  /** Tarjeta que espera confirmación para eliminarse. */
  protected readonly porEliminar = signal<Tarjeta | null>(null);

  ngOnInit(): void {
    this.store.cargar();
  }

  protected buscar(evento: Event): void {
    this.store.buscar((evento.target as HTMLInputElement).value);
  }

  protected filtrar(evento: Event): void {
    this.store.filtrarPorEstado((evento.target as HTMLSelectElement).value as FiltroEstado);
  }

  protected pedirConfirmacion(tarjeta: Tarjeta): void {
    this.porEliminar.set(tarjeta);
  }

  protected cancelarEliminacion(): void {
    this.porEliminar.set(null);
  }

  protected confirmarEliminacion(): void {
    const tarjeta = this.porEliminar();
    if (!tarjeta) return;
    this.porEliminar.set(null);
    this.store.eliminar(tarjeta.id).subscribe();
  }
}
