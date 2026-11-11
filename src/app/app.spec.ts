import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('muestra la cabecera y las tarjetas que entrega la API', async () => {
    const http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/tarjetas');

    http.expectOne('/api/tarjetas').flush([
      {
        id: 1,
        numero: '12345678',
        titular: 'María González',
        alias: 'Trabajo',
        tipo: 'NORMAL',
        saldo: 5200,
        estado: 'ACTIVA',
        creadaEn: '2026-10-15T10:00:00',
        actualizadaEn: '2026-10-15T10:00:00',
      },
    ]);
    harness.detectChanges();

    const texto = (harness.routeNativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Mis tarjetas Bip!');
    expect(texto).toContain('María González');
    expect(texto).toContain('1234 5678');
  });
});
