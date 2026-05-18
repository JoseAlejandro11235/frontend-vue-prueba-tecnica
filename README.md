# Frontend Legacy — Vue 3

SPA: **Vue 3 + Vite + Pinia + Tailwind CSS v4** + Composition API.

## Docker — paso 2 (frontend)

> **Evaluador:** ejecutar **después** del backend. El paso 1 levanta **MySQL + API**; este paso solo levanta el **frontend**.

### 1. Backend (obligatorio primero)

```bash
cd ../backend-legacy-laravel8
docker compose up -d --build
```

Comprobar: http://localhost:8000/api/health

### 2. Frontend (esta carpeta)

```bash
cd ../frontend-legacy-vue2
docker compose up -d --build
docker compose logs -f frontend
```

Esperar: `Backend is ready. Starting Vite...`

| Recurso | URL |
|---------|-----|
| **Aplicación** | http://localhost:5173 |

Las peticiones van a `/api` en el mismo origen; Vite las reenvía a `http://api:8000` dentro de Docker.

**No es necesario:** `npm install` ni `.env` en el host para Docker.

Detalle: [DOCKER.md](./DOCKER.md) · Guía completa evaluador: [../README.md](../README.md)

### Credenciales API (login en la SPA)

```txt
email: admin@legacy.test
password: password
```

### Parar

```bash
docker compose down
```

---

## Instalación local (sin Docker)

Backend en http://127.0.0.1:8000.

```bash
cp .env.example .env
npm install
npm run dev
```

Variables típicas:

```txt
VITE_API_URL=/api
VITE_PROXY_TARGET=http://127.0.0.1:8000
```

---

## Documentación

- [DOCKER.md](./DOCKER.md) — proxy, red `legacy_shared`, entrypoint
- [UPGRADE.md](./UPGRADE.md) — migración Vue 2 → 3
