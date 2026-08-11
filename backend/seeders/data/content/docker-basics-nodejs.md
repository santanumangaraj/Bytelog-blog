## What Docker Solves

"It works on my machine" is a familiar problem. Different developers have different OS versions, Node versions, and installed dependencies, which can cause an app to behave differently across environments.

Docker packages an application together with everything it needs to run — runtime, libraries, configuration — into a single, portable image.

## Images vs Containers

An image is a snapshot: a read-only template describing what should be installed and how the app should start. A container is a running instance of that image.

```
Dockerfile
   ↓ (docker build)
Image
   ↓ (docker run)
Container
```

You build an image once and can run as many containers from it as you like.

## A Minimal Dockerfile for a Node.js App

```
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8002
CMD ["node", "app.js"]
```

## Running It

```
docker build -t bytelog-backend .
docker run -p 8002:8002 --env-file .env bytelog-backend
```

## Multi-Container Apps with Docker Compose

A real backend usually depends on other services — a database, Redis, maybe a queue dashboard. Docker Compose lets you describe all of them in one file and start them together.

```
services:
  api:
    build: .
    ports:
      - "8002:8002"
    depends_on:
      - mysql
      - redis
  mysql:
    image: mysql:8
  redis:
    image: redis:7
```

## Important Considerations

- Keep images small by using slim/alpine base images and a `.dockerignore` file
- Don't bake secrets into images — pass them as environment variables at runtime
- Use volumes for data that needs to persist (like MySQL data)
- Separate development and production Dockerfiles/Compose configs when they diverge significantly

## Conclusion

Docker doesn't just standardize deployment — it also makes local development more predictable, since every developer runs the exact same environment. Starting with a simple Dockerfile and a Compose file for local dependencies is usually enough for most projects.
