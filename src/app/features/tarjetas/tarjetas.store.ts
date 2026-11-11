import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, Observable, catchError, finalize, map, switchMap, tap } from 'rxjs';

import { TarjetaApi } from '../../core/api/tarjeta.api';
import { ApiError } from '../../core/models/api-error';
import {
  EstadoTarjeta,
  Tarjeta,
  TarjetaEdicionRequest,
  TarjetaRequest,
} from '../../core/models/tarjeta.model';
import { ToastService } from '../../shared/ui/toast.service';

export type FiltroEstado = 'TODAS' | EstadoTarjeta;

/**
 * Estado de las pantallas (patrón Store/Facade con signals).
 * Las páginas leen signals y llaman a métodos; nunca hablan con la API directamente.
 */
@Injectable({ providedIn: 'root' })
export class TarjetasStore {
  private readonly api = inject(TarjetaApi);
  private readonly toast = inject(ToastService);

  /** Todas las tarjetas que hay en el servidor. */
  readonly tarjetas = signal<Tarjeta[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly busqueda = signal('');
  readonly filtroEstado = signal<FiltroEstado>('TODAS');

  /** Las tarjetas que se ven según el texto buscado y el estado elegido. */
  readonly tarjetasFiltradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const estado = this.filtroEstado();
    return this.tarjetas().filter((t) => {
      const coincideEstado = estado === 'TODAS' || t.estado === estado;
      const coincideTexto =
        !texto ||
        t.numero.includes(texto) ||
        t.titular.toLowerCase().includes(texto) ||
        (t.alias ?? '').toLowerCase().includes(texto);
      return coincideEstado && coincideTexto;
    });
  });

  /** Datos de las tres cajas de resumen. */
  readonly resumen = computed(() => {
    const todas = this.tarjetas();
    return {
      total: todas.length,
      activas: todas.filter((t) => t.estado === 'ACTIVA').length,
      saldoTotal: todas.reduce((suma, t) => suma + t.saldo, 0),
    };
  });

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.refrescar()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({ error: (e: ApiError) => this.error.set(e.message) });
  }

  buscar(texto: string): void {
    this.busqueda.set(texto);
  }

  filtrarPorEstado(estado: FiltroEstado): void {
    this.filtroEstado.set(estado);
  }

  /** Para la pantalla de edición: trae una tarjeta por id. */
  obtener(id: number): Observable<Tarjeta> {
    return this.api.obtener(id);
  }

  /**
   * Cada operación devuelve un Observable que emite solo si salió bien;
   * así la pantalla navega o cierra el diálogo únicamente en caso de éxito.
   */
  crear(request: TarjetaRequest): Observable<void> {
    return this.api.crear(request).pipe(
      switchMap(() => this.refrescar()),
      tap(() => this.toast.exito('Tarjeta registrada')),
      catchError(this.fallar),
    );
  }

  actualizar(id: number, request: TarjetaEdicionRequest): Observable<void> {
    return this.api.actualizar(id, request).pipe(
      switchMap(() => this.refrescar()),
      tap(() => this.toast.exito('Tarjeta actualizada')),
      catchError(this.fallar),
    );
  }

  eliminar(id: number): Observable<void> {
    return this.api.eliminar(id).pipe(
      switchMap(() => this.refrescar()),
      tap(() => this.toast.exito('Tarjeta eliminada')),
      catchError(this.fallar),
    );
  }

  /** Vuelve a pedir la lista al servidor. */
  private refrescar(): Observable<void> {
    return this.api.listar().pipe(
      tap((tarjetas) => this.tarjetas.set(tarjetas)),
      map(() => undefined),
    );
  }

  /** Muestra el error y corta el flujo: el Observable termina sin emitir. */
  private readonly fallar = (error: ApiError): Observable<never> => {
    this.toast.error(error.message);
    return EMPTY;
  };
}
