import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Tarjeta, TarjetaEdicionRequest, TarjetaRequest } from '../models/tarjeta.model';

/** Único lugar que conoce las rutas HTTP del backend (Spring Boot, /api/tarjetas). */
@Injectable({ providedIn: 'root' })
export class TarjetaApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/tarjetas';

  listar(): Observable<Tarjeta[]> {
    return this.http.get<Tarjeta[]>(this.base);
  }

  obtener(id: number): Observable<Tarjeta> {
    return this.http.get<Tarjeta>(`${this.base}/${id}`);
  }

  crear(request: TarjetaRequest): Observable<Tarjeta> {
    return this.http.post<Tarjeta>(this.base, request);
  }

  actualizar(id: number, request: TarjetaEdicionRequest): Observable<Tarjeta> {
    return this.http.put<Tarjeta>(`${this.base}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
