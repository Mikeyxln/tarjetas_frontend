# tarjetas-frontend

Pantalla Angular 21 del CRUD de tarjetas Bip!. Mismo estilo y estructura que `crocante-frontend`.
Se conecta al backend `tarjetas-backend` (Spring Boot, puerto 8082).

## Levantar

```bash
npm install        # solo la primera vez
npm start
```

Abrir http://localhost:4200 (con el backend levantado).

## Conexión al backend

`proxy.conf.json` reenvía todo lo que empieza con `/api` hacia `http://localhost:8082`, así el navegador habla solo con el puerto 4200 y no hace falta CORS. Si el backend usa otro puerto, cambia el `target` y reinicia `npm start`.

| Acción | Llamada HTTP |
|---|---|
| Listar | `GET /api/tarjetas` |
| Registrar | `POST /api/tarjetas` |
| Editar | `PUT /api/tarjetas/{id}` |
| Eliminar | `DELETE /api/tarjetas/{id}` |

## Estructura.

```
src/app
├── core/          models, api (TarjetaApi) e interceptor de errores
├── shared/ui/     avisos (toast), badge de estado, diálogo de confirmación y formato de pesos (CLP)
└── features/tarjetas
    ├── tarjetas.store.ts       estado de la pantalla (signals)
    ├── tarjetas.page.*         listado: resumen, buscador, filtro y tarjetas Bip!
    ├── tarjeta-form.page.*     formulario para crear y editar
    └── components/             tarjeta-bip-card
```

Rutas: `/tarjetas`, `/tarjetas/nueva` y `/tarjetas/:id/editar`.
Los componentes solo reciben datos y emiten eventos. Solo las páginas conocen al store, y solo el store conoce al api.

## Pruebas y compilación

```bash
npm test -- --watch=false
npm run build
```

Guía paso a paso: [`../docs/08-guia-angular-paso-a-paso.md`](../docs/08-guia-angular-paso-a-paso.md)
