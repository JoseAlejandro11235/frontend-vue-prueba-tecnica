# Debian slim: Tailwind v4 (@tailwindcss/oxide) needs glibc native bindings (Alpine/musl fails)
FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN chmod +x docker/entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["sh", "docker/entrypoint.sh"]
CMD ["npm", "run", "dev"]
