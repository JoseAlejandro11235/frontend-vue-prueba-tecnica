#!/bin/sh
set -e

echo "Waiting for backend API (http://api:8000/api/health)..."
echo "Run backend first: cd backend-legacy-laravel8 && docker compose up -d --build"

until wget -qO- http://api:8000/api/health >/dev/null 2>&1; do
  sleep 2
done

echo "Backend is ready. Starting Vite..."
exec "$@"
