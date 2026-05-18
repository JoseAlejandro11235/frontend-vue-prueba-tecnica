# Dockerización — frontend (Vue 3 + Vite + Pinia)

Red compartida `legacy_shared` con el backend. Documentación completa backend + red:

**[../backend-legacy-laravel8/DOCKER.md](../backend-legacy-laravel8/DOCKER.md)**

Migración Vue 2 → 3: **[UPGRADE.md](./UPGRADE.md)**

---

## Stack en contenedor

- Node 18
- Vite 5 dev server (`0.0.0.0:5173`)
- Vue 3 + Pinia (build en imagen; código montado en desarrollo)

---

## Problemas y soluciones (Docker)

### El navegador no resuelve `http://api:8000`

**Solución:** `VITE_API_URL=/api` + proxy Vite → `http://api:8000` (`VITE_PROXY_TARGET`).

### `node_modules` y bind mount

**Solución:** volumen `legacy_frontend_node_modules` en `/app/node_modules`.

### Red externa

**Solución:** levantar el backend antes del frontend (`legacy_shared` external).

### Migración a Vue 3

**Cambio:** `@vitejs/plugin-vue` sustituye a `plugin-vue2`. El `Dockerfile` sigue siendo `npm run dev`; no requiere cambios de puertos ni red.

---

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `docker-compose.yml` | Servicio `frontend`, red `legacy_shared` |
| `vite.config.js` | Proxy `/api`, alias `@`, host `0.0.0.0` |
| `src/api/client.js` | HTTP centralizado |
| `src/stores/auth.js` | Pinia sesión |

Ver [README.md](./README.md) para comandos.
