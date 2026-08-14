# ByteLog

A full-stack blog platform: publish, read, and like articles, with a queue-backed
backend built for production (async processing, rate limiting, caching) rather
than a toy CRUD app.

- **Backend**: Node.js, Express 5, MySQL (Sequelize), Redis, BullMQ — see [backend/README.md](backend/README.md)
- **Frontend**: React, Vite, Tailwind CSS — see [frontend/README.md](frontend/README.md)

## Repository layout

```
backend/    Express API + BullMQ workers + Sequelize migrations
frontend/   React/Vite single-page app
docker-compose.yml   Orchestrates the API, both workers, and Redis for local/dev use
```

## Quick start (local development)

1. **Backend**: follow [backend/README.md](backend/README.md) - copy .env.example to .env, run migrations, start the API and the two workers (directly with npm run dev/npm run worker:*, or via docker compose up).
2. **Frontend**: follow [frontend/README.md](frontend/README.md) - copy .env.example to .env, npm run dev.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full step-by-step production hosting process (recommended platforms, provisioning the database and Redis, env vars, running migrations, deploying all 3 backend processes, and a post-launch smoke-test checklist).
