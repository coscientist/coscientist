#!/bin/sh
set -eu

cd "$(dirname "$0")/.."

export POSTGRES_PORT=${POSTGRES_PORT:-5435}

log() { printf '%s\n' "$*"; }
die() { printf '%s\n' "$*" >&2; exit 1; }
secret() { head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n'; }

if docker info >/dev/null 2>&1; then compose='docker compose'
elif podman info >/dev/null 2>&1; then compose='podman compose'
else die 'docker info and podman info both failed: no reachable container engine'
fi

$compose up -d --wait || die "$compose up failed; with podman, enable the API socket first: systemctl --user enable --now podman.socket"

if [ -f .env.local ]; then
  log '.env.local exists; left untouched'
else
  umask 077
  cat > .env.local <<EOF
DATABASE_URL=postgres://coscientist_app:coscientist_app@localhost:${POSTGRES_PORT}/coscientist
MIGRATION_DATABASE_URL=postgres://coscientist:coscientist@localhost:${POSTGRES_PORT}/coscientist
BETTER_AUTH_SECRET=$(secret)
BETTER_AUTH_URL=http://localhost:3100
EOF
  log 'wrote .env.local for the local stack'
fi

log 'next: bun --env-file=.env.local run db:migrate, then bun run dev'
