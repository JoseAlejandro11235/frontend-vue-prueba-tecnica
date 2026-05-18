# Docker — frontend (paso 2)

**Evaluador:** leer primero [../README.md](../README.md). El **MySQL** y la **API** se levantan en el paso 1 (`backend-legacy-laravel8`).

---

## Arranque

```bash
# 1) Backend (MySQL + API) — obligatorio
cd ../backend-legacy-laravel8
docker compose up -d --build

# 2) Frontend
cd ../frontend-legacy-vue2
docker compose up -d --build
docker compose logs -f frontend
```

| Servicio | Puerto host | URL |
|----------|-------------|-----|
| `frontend` | 5173 | http://localhost:5173 |

---

## Qué hace Docker automáticamente

- `npm ci` en la imagen (`package-lock.json`)
- `docker/entrypoint.sh` espera `http://api:8000/api/health` (hostname `api` en red `legacy_shared`)
- Vite con `host: 0.0.0.0` y proxy `/api` → `VITE_PROXY_TARGET` (`http://api:8000` en Compose)

**No hace falta** `npm install` ni crear `.env` en el host.

---

## Red Docker

- El backend crea `legacy_shared` (`name: legacy_shared`)
- Este compose usa `networks.legacy_shared.external: true`
- Si falla con *network not found* → ejecutar el paso 1 del backend

---

## Problemas y soluciones

### El navegador no resuelve `http://api:8000`

El navegador está fuera de Docker. **Solución:** `VITE_API_URL=/api` y proxy Vite hacia `http://api:8000` dentro del contenedor.

### Frontend en bucle “Waiting for backend API…”

La API aún no terminó migración/seed o no está healthy. Revisar:

```bash
cd ../backend-legacy-laravel8
docker compose logs -f api
```

### Puerto 5173 ocupado

Cambiar `5173:5173` en `docker-compose.yml` o liberar el puerto.

### “Site can’t be reached” / contenedor `Exited (1)`

Suele ser Vite que no arranca. Ver logs:

```bash
docker compose logs frontend
```

Con **Tailwind v4**, la imagen debe ser `node:20-bookworm-slim` (no Alpine): el error `Cannot find native binding` en `@tailwindcss/oxide` hace caer el contenedor. Reconstruir:

```bash
docker compose up -d --build
```

---

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `docker-compose.yml` | Servicio `frontend`, red externa, `VITE_PROXY_TARGET` |
| `Dockerfile` | Node 20 bookworm-slim, `npm ci`, entrypoint |
| `docker/entrypoint.sh` | Espera health del backend |
| `vite.config.js` | Proxy `/api`, `host: 0.0.0.0` |
| `src/api/client.js` | `baseURL: '/api'` |

Backend (MySQL, API, healthchecks): [../backend-legacy-laravel8/DOCKER.md](../backend-legacy-laravel8/DOCKER.md)
