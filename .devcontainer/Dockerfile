FROM node:24-bookworm-slim
COPY --from=oven/bun:1.4.2 /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile && bun run build
CMD ["node", ".output/server/index.mjs"]
