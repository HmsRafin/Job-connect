#!/usr/bin/env bash
# Run on the CI runner or a trusted local build machine, never on the shared VPS.
set -euo pipefail
project_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$project_root"
test -s backend/vendor/autoload.php
test -s backend/public/app/index.html
# An explicit allowlist keeps personal keys, uploads, local databases and tooling out.
tar -czf release.tar.gz \
  --exclude='.env' --exclude='.env.*' --exclude='.git' --exclude='node_modules' \
  --exclude='*.sqlite' --exclude='*.sqlite-*' --exclude='*.pem' --exclude='*.key' \
  --exclude='bootstrap/cache/*' --exclude='public/storage' --exclude='public/hot' \
  -C backend app artisan bootstrap config database/migrations database/factories \
  database/seeders public resources routes vendor composer.json composer.lock
python3 scripts/check-release.py release.tar.gz
