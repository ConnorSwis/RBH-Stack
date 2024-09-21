ARG BUN_VERSION=1.0.29
FROM oven/bun:${BUN_VERSION}-slim as bun

WORKDIR /app

ENV NODE_ENV=production


RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY --link bun.lockb package.json ./
RUN bun install --ci

COPY --link frontend/bun.lockb frontend/package.json ./frontend/
RUN cd frontend && bun install --ci

COPY --link . .

RUN bun run build:frontend

EXPOSE 3000

CMD ["bun", "start"]