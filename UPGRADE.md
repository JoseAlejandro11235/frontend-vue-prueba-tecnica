# Vue 2 → Vue 3 + Vite + Pinia — problemas y soluciones

Migración del frontend legacy a **Vue 3**, **Vite 5**, **Vue Router 4** y **Pinia 2**, manteniendo las mismas rutas y contrato con la API Laravel.

---

## Resumen

| Antes | Después |
|-------|---------|
| Vue 2.7 + Options API | Vue 3.5 + Composition API (`<script setup>`) |
| Vue Router 3 | Vue Router 4 (`createRouter`, `createWebHistory`) |
| Sin store global | **Pinia** (`stores/auth.js`) |
| Axios duplicado en cada vista | Cliente único `@/api/client` |
| `@vitejs/plugin-vue2` | `@vitejs/plugin-vue` |
| Vite 4 | Vite 5 |
| `src/router.js` | `src/router/index.js` |
| `src/api.js` | `src/api/client.js` |

---

## Problemas y soluciones

### 1. Arranque de aplicación (Vue 2 → Vue 3)

**Problema:** `new Vue({ router, render })` ya no existe en Vue 3.

**Solución:** `createApp(App).use(createPinia()).use(router).mount('#app')` en `src/main.js`.

---

### 2. Router (v3 → v4)

**Problema:** `Vue.use(Router)` y `new Router({ mode: 'history' })` son API de Vue 2.

**Solución:**

- `createRouter` + `createWebHistory()` en `src/router/index.js`.
- Rutas con `name` para navegación tipada (`router.push({ name: 'dashboard' })`).
- Guard global con `useAuthStore()` y meta `guest` en `/login`.

---

### 3. Estado de autenticación disperso

**Problema:** Token solo en `localStorage`; login/logout repetidos; vistas con `Authorization` manual.

**Solución:** Store Pinia `useAuthStore`:

- `token`, `user`, `isAuthenticated`
- `login()`, `logout()`, `clearSession()`
- Persistencia en `localStorage` centralizada

El interceptor de Axios lee el token desde `localStorage` (evita dependencia circular store ↔ api).

---

### 4. Llamadas HTTP duplicadas

**Problema:** Cada vista importaba `axios` y armaba URLs con `import.meta.env.VITE_API_URL`.

**Solución:** Módulo `@/api/client.js` con `baseURL: '/api'` y vistas que usan `api.get/post/put/delete`.

---

### 5. Plugin Vite para Vue 2

**Problema:** `@vitejs/plugin-vue2` solo compila SFC de Vue 2.

**Solución:** `@vitejs/plugin-vue` + alias `@` → `src/` en `vite.config.js`.

---

### 6. Proxy Docker / local (sin cambio de comportamiento)

**Problema:** El navegador no resuelve el hostname Docker `api`.

**Solución:** Se mantiene:

- `VITE_API_URL=/api` en el cliente Axios.
- Proxy Vite `/api` → `VITE_PROXY_TARGET` (`http://api:8000` en Docker).

Ver [DOCKER.md](./DOCKER.md).

---

### 7. Interceptor 401

**Problema:** Antes no había redirección ante sesión inválida.

**Solución:** Respuesta 401 elimina `token` en `localStorage`; el guard de rutas envía a login si no hay sesión. (Mejora menor respecto al legacy.)

---

### 8. Composition API en vistas

**Problema:** Options API (`data`, `methods`, `mounted`) acoplada a Vue 2.

**Solución:** Todas las vistas usan `<script setup>` con `ref`, `reactive`, `computed`, `onMounted`.

---

## Estructura de carpetas

```text
src/
  api/client.js       # Axios configurado
  stores/auth.js      # Pinia auth
  router/index.js     # Vue Router 4
  views/              # Pantallas (Composition API)
  App.vue
  main.js
```

---

## Comandos

```bash
cp .env.example .env
npm install
npm run dev
```

Docker: ver [README.md](./README.md).

---

## Plan de migración (frontend)

| Paso | Acción |
|------|--------|
| 1 | Sustituir arranque Vue 2 por `createApp` + Pinia + Router 4 |
| 2 | Centralizar HTTP en `@/api/client` y auth en `stores/auth.js` |
| 3 | Reescribir vistas a `<script setup>` manteniendo rutas y pantallas |
| 4 | Ajustar Vite 5 + `@vitejs/plugin-vue`; proxy `/api` sin cambiar URL en el navegador |
| 5 | Validar con backend en Docker (`legacy_shared`, `VITE_PROXY_TARGET=http://api:8000`) |

---

## Decisiones técnicas

| Decisión | Elección | Motivo |
|----------|----------|--------|
| Estado global | **Pinia** solo para auth | Evita sobre-ingeniería; listados siguen en vistas con `api` |
| HTTP | **Axios** + `baseURL: '/api'` | Mismo patrón que legacy; proxy resuelve host Docker `api` |
| Build | **Vite 5** | Arranque rápido y HMR; reemplaza cadena Vue CLI/webpack |
| API en contenedor | **Entrypoint espera `/api/health`** | El frontend no arranca antes que la API en paso 2 de Docker |
| Errores 401 | Limpiar token + guard de rutas | Mejora UX frente al legacy sin cambiar contrato de login |

---

## UI — Tailwind CSS v4

- `@tailwindcss/vite` + `tailwindcss` en `vite.config.js`
- Estilos globales: `src/styles.css` (`@import 'tailwindcss'`, tema oscuro, componentes `.glass-card`, `.btn-*`, `.input-field`)
- Componentes: `AlertBanner`, `PageHeader`, `LoadingSpinner`
- Tipografía: **DM Sans** (Google Fonts)

## Qué no se incluyó (fuera de alcance)

- Normalización avanzada de errores API
- Stores Pinia para productos/categorías (solo auth; el resto usa `api` en vistas)
- Tests E2E / unitarios frontend

La lógica de negocio visible (validaciones débiles, etc.) se mantiene alineada al espíritu “legacy” del proyecto de prueba.

---

## Referencias

- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
