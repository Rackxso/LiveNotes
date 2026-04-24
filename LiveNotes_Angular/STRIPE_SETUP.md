# Stripe — Pasos pendientes

## 1. Stripe Dashboard (5 min)

1. En **Products** → crear un producto llamado "LiveNotes Premium"
2. Añadir un precio recurrente (ej. 4,99 €/mes) → copiar el `price_xxx`
3. En **Developers → API keys** → copiar la `sk_test_xxx`

---

## 2. Variables de entorno — Backend (2 min)

Añadir al `.env` del backend (el `whsec_` se obtiene en el paso 3):

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=   # dejar vacío hasta el paso 3
FRONTEND_URL=http://localhost:4200
```

---

## 3. Pruebas locales con Stripe CLI (10 min)

### Instalación
- **Windows:** `scoop install stripe` o descargar desde https://stripe.com/docs/stripe-cli
- **Mac:** `brew install stripe/stripe-cli/stripe`

### Uso
```bash
# 1. Autenticarse
stripe login

# 2. Reenviar webhooks al backend local (imprime el whsec_ → copiarlo al .env)
stripe listen --forward-to localhost:4000/api/stripe/webhook

# 3. En otra terminal — simular pago completado
stripe trigger checkout.session.completed

# 4. Simular cancelación de suscripción
stripe trigger customer.subscription.deleted
```

### Verificar en MongoDB
- Tras `checkout.session.completed` → el usuario debe tener `permisos: 2`, `stripeCustomerId` y `stripeSubscriptionId` rellenos
- Tras `customer.subscription.deleted` → `permisos: 1`, `stripeSubscriptionId: null`

---

## 4. Crear `environment.prod.ts` — Frontend (5 min)

Crear `src/environments/environment.prod.ts` para producción:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://tu-dominio-backend.com/api',
  posthogKey: 'phc_...',
  posthogHost: 'https://eu.i.posthog.com'
};
```

Asegurarse de que `angular.json` tiene la sustitución de fichero para el build de producción.

---

## 5. Despliegue (cuando llegue el momento)

1. Desplegar el backend (Railway, Render, Fly.io, etc.)
2. Desplegar el frontend (Vercel, Netlify, etc.)
3. En Stripe Dashboard → **Developers → Webhooks** → añadir endpoint:
   ```
   https://tu-dominio-backend.com/api/stripe/webhook
   ```
   Eventos a escuchar:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copiar el `whsec_` de producción al `.env` del servidor
5. Cambiar claves `test` por `live`:
   - `sk_test_` → `sk_live_`
   - `price_test_` → `price_live_`
