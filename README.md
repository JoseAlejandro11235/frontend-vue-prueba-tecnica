# Frontend Legacy — Vue 3

SPA para la prueba técnica. Migrado de Vue 2 a **Vue 3 + Vite + Pinia + Composition API**.

## Stack

- Vue 3
- Vite 5
- Vue Router 4
- Pinia 2
- Axios (`@/api/client`)

Documentación de la migración: **[UPGRADE.md](./UPGRADE.md)**  
Docker: **[DOCKER.md](./DOCKER.md)** · Backend: **[../backend-legacy-laravel8/DOCKER.md](../backend-legacy-laravel8/DOCKER.md)**

## Instalación (local)

```bash
cp .env.example .env
npm install
npm run dev
```

Requiere el backend en `http://127.0.0.1:8000` (Vite proxy hacia `/api`).

## Docker

Orden: **backend primero**, luego frontend.

```bash
cd ../backend-legacy-laravel8
docker compose up -d --build

cd ../frontend-legacy-vue2
docker compose up -d --build
```

App: http://localhost:5173

| Servicio | DNS | Puerto |
|----------|-----|--------|
| Vite | `frontend` | 5173 |

## Variables

```txt
VITE_API_URL=/api
VITE_PROXY_TARGET=http://127.0.0.1:8000   # local
VITE_PROXY_TARGET=http://api:8000         # Docker
```

## Credenciales (API)

```txt
email: admin@legacy.test
password: password
```

## Nota

Persisten debilidades intencionales en validación y UX. El stack ya cumple Vue 3, Pinia y servicio HTTP centralizado.
