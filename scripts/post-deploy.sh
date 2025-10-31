#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-/opt/expandmatrix/shared/env/.env.production}"

if [ -f "$ENV_FILE" ]; then
  echo "[post-deploy] Loading env vars from $ENV_FILE"
  # shellcheck source=/dev/null
  set -a
  . "$ENV_FILE"
  set +a
else
  echo "[post-deploy] Env file $ENV_FILE not found; continuing with current environment" >&2
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[post-deploy] npm is required on PATH" >&2
  exit 1
fi

echo "[post-deploy] Running Payload migrations"
npm run payload:migrate

if [[ "${RUN_SEED:-true}" == "true" ]]; then
  echo "[post-deploy] Running Payload seed script"
  npm run payload:seed
else
  echo "[post-deploy] Skipping seed (RUN_SEED=$RUN_SEED)"
fi
