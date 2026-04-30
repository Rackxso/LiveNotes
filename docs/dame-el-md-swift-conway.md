# Plan: Loader mientras cargan eventos y finanzas en Home

## Context

El Home carga 3 peticiones HTTP al inicializarse (eventos, transacciones, metas de ahorro) sin exponer estado de carga. El usuario ve contenido vacío sin feedback hasta que llegan los datos. Se añade un estado `loading` por servicio y skeletons por sección en el template.

---

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/app/services/eventos.service.ts` | Añadir signal `loading` |
| `src/app/services/finance.service.ts` | Añadir signal `loading` + contador interno |
| `src/app/pages/home/home.ts` | Computed `isLoading` combinado |
| `src/app/pages/home/home.html` | `@if (isLoading())` con skeletons por sección |
| `src/app/pages/home/home.css` | CSS del skeleton (`@keyframes shimmer`) |

---

## Implementación

### 1. `EventosService` — añadir `loading`

```ts
readonly loading = signal(false);

loadEventos(): void {
  if (this._loaded) return;
  this._loaded = true;
  this.loading.set(true);
  this.http.get<CalendarEventResponse[]>(this.base).pipe(
    retry({ count: 3, delay: 1500 }),
    tap(data => this._eventos.set(data.map(e => this.mapToEvento(e)))),
    finalize(() => this.loading.set(false))
  ).subscribe({ error: () => { this._loaded = false; } });
}
```

Importar `finalize` de `rxjs`.

### 2. `FinanceService` — añadir `loading`

Usa un contador para que `loading` sea `true` mientras *cualquiera* de las dos peticiones esté en vuelo.

```ts
readonly loading = signal(false);
private _activeLoads = 0;

private _startLoad(): void { this._activeLoads++; this.loading.set(true); }
private _endLoad(): void   { if (--this._activeLoads === 0) this.loading.set(false); }
```

En `loadTransactions()`:
```ts
loadTransactions(): Observable<ApiMovimiento[]> {
  if (this._txLoaded) return of([]);
  this._txLoaded = true;
  this._startLoad();
  return this.http.get<ApiMovimiento[]>(this.baseMovimientos).pipe(
    tap(data => this.transactions.set(data.map(m => this.mapToTransaction(m)))),
    finalize(() => this._endLoad())
  );
}
```

En `loadSavingsGoals()`: igual, `_startLoad()` al inicio + `finalize(() => this._endLoad())`.

En `resetState()` añadir: `this._activeLoads = 0; this.loading.set(false);`

### 3. `Home` — computed `isLoading`

```ts
readonly isLoading = computed(() =>
  this.eventosService.loading() || this.financeService.loading()
);
```

### 4. Template `home.html` — skeletons por sección

Envolver cada sección con `@if / @else`:

**Q1 (stats rápidas):**
```html
@if (isLoading()) {
  <div class="skeleton skeleton-stat"></div>
  <div class="skeleton skeleton-stat"></div>
} @else {
  <!-- contenido actual de stats -->
}
```

**Q2 (eventos del día seleccionado y próximos eventos):**
```html
@if (isLoading()) {
  <div class="skeleton skeleton-event-row"></div>
  <div class="skeleton skeleton-event-row"></div>
  <div class="skeleton skeleton-event-row"></div>
} @else {
  <!-- @for eventos existente -->
}
```

**Q3 (transacciones recientes y goal progress):**
```html
@if (isLoading()) {
  <div class="skeleton skeleton-tx-row"></div>
  <div class="skeleton skeleton-tx-row"></div>
  <div class="skeleton skeleton-tx-row"></div>
} @else {
  <!-- contenido actual -->
}
```

El greeting (nombre de usuario, fecha) **no** se oculta — está disponible desde `auth` sin petición HTTP.

### 5. CSS en `home.css`

```css
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}

.skeleton {
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    var(--secondary-background-color) 25%,
    color-mix(in srgb, var(--secondary-background-color) 60%, var(--text-color)) 50%,
    var(--secondary-background-color) 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite linear;
}

.skeleton-stat      { height: 48px; width: 100%; margin-bottom: 8px; }
.skeleton-event-row { height: 40px; width: 100%; margin-bottom: 8px; }
.skeleton-tx-row    { height: 36px; width: 100%; margin-bottom: 8px; }
```

---

## Verificación

1. Ejecutar `ng serve` y abrir Home con DevTools Network → throttling a "Slow 3G"
2. Confirmar que los skeletons aparecen en Q1, Q2 y Q3 mientras cargan
3. Confirmar que desaparecen y el contenido real se muestra tras la respuesta
4. Confirmar que Q4 (notas, tareas) no se afecta (no depende de estos servicios)
5. Confirmar que el greeting (nombre, fecha) es visible desde el inicio
6. Verificar en modo oscuro que el shimmer usa los colores del tema correctamente
