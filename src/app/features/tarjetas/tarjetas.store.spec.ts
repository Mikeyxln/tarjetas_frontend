import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { errorInterceptor } from '../../core/interceptors/error.interceptor';
import { Tarjeta } from '../../core/models/tarjeta.model';
import { TarjetasStore } from './tarjetas.store';

const ahora = '2026-10-15T10:00:00';
const ana: Tarjeta = {
  id: 1, numero: '11111111', titular: 'Ana', alias: null, tipo: 'NORMAL', saldo: 1000,
  estado: 'ACTIVA', creadaEn: ahora, actualizadaEn: ahora,
};
const luis: Tarjeta = {
  id: 2, numero: '22222222', titular: 'Luis', alias: 'Uni', tipo: 'TNE_SUPERIOR', saldo: 500,
  estado: 'BLOQUEADA', creadaEn: ahora, actualizadaEn: ahora,
};

describe('TarjetasStore', () => {
  let store: TarjetasStore;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors([errorInterceptor])), provideHttpClientTesting()] });
    store = TestBed.inject(TarjetasStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function cargarDatos(): void {
    store.cargar();
    http.expectOne('/api/tarjetas').flush([ana, luis]);
  }

  it('carga las tarjetas', () => {
    store.cargar();
    expect(store.cargando()).toBe(true);

    http.expectOne('/api/tarjetas').flush([ana, luis]);

    expect(store.tarjetas().length).toBe(2);
    expect(store.cargando()).toBe(false);
  });

  it('calcula el resumen: total, activas y saldo', () => {
    cargarDatos();
    expect(store.resumen()).toEqual({ total: 2, activas: 1, saldoTotal: 1500 });
  });

  it('guarda el mensaje si el servidor no responde', () => {
    store.cargar();
    http.expectOne('/api/tarjetas').error(new ProgressEvent('error'), { status: 0 });

    expect(store.error()).toContain('No hay conexión');
    expect(store.cargando()).toBe(false);
  });

  it('filtra por estado y por texto', () => {
    cargarDatos();

    store.filtrarPorEstado('BLOQUEADA');
    expect(store.tarjetasFiltradas()).toEqual([luis]);

    store.filtrarPorEstado('TODAS');
    store.buscar('ana');
    expect(store.tarjetasFiltradas()).toEqual([ana]);
  });

  it('registra con POST y recarga la lista', () => {
    cargarDatos();
    let terminado = false;

    store
      .crear({ numero: '33333333', titular: 'Eva', alias: null, tipo: 'NORMAL', saldo: 100 })
      .subscribe(() => (terminado = true));

    const post = http.expectOne('/api/tarjetas');
    expect(post.request.method).toBe('POST');
    post.flush({ ...ana, id: 3, numero: '33333333', titular: 'Eva' });
    http.expectOne('/api/tarjetas').flush([ana, luis, { ...ana, id: 3 }]);

    expect(terminado).toBe(true);
    expect(store.tarjetas().length).toBe(3);
  });

  it('si el servidor rechaza (409) muestra el error y no emite', () => {
    cargarDatos();
    let terminado = false;

    store
      .crear({ numero: '11111111', titular: 'Ana', alias: null, tipo: 'NORMAL', saldo: 0 })
      .subscribe(() => (terminado = true));

    http.expectOne('/api/tarjetas').flush({ mensaje: 'Ya existe una tarjeta' }, { status: 409, statusText: 'Conflict' });

    expect(terminado).toBe(false);
  });

  it('edita con PUT y elimina con DELETE', () => {
    cargarDatos();

    store.actualizar(1, { titular: 'Ana D', alias: null, tipo: 'NORMAL', saldo: 5, estado: 'ACTIVA' }).subscribe();
    const put = http.expectOne('/api/tarjetas/1');
    expect(put.request.method).toBe('PUT');
    put.flush(ana);
    http.expectOne('/api/tarjetas').flush([ana, luis]);

    store.eliminar(2).subscribe();
    const del = http.expectOne('/api/tarjetas/2');
    expect(del.request.method).toBe('DELETE');
    del.flush(null);
    http.expectOne('/api/tarjetas').flush([ana]);

    expect(store.tarjetas()).toEqual([ana]);
  });
});
