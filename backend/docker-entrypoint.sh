#!/bin/sh
set -eu

# Keep the APP_KEY in the host .env stable across rebuilds and restarts.
: "${APP_KEY:?APP_KEY is required. Run scripts/init-docker-env.ps1 on the host.}"
php -r '$key = getenv("APP_KEY"); if (!str_starts_with($key, "base64:") || strlen(base64_decode(substr($key, 7), true) ?: "") !== 32) { fwrite(STDERR, "APP_KEY must be a base64-encoded 32-byte key.\n"); exit(1); }'
mkdir -p storage/app/private storage/app/public storage/framework/cache/data \
    storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

php artisan config:clear
php artisan migrate --force
php artisan db:seed --force
if [ ! -L public/storage ]; then
    php artisan storage:link
fi
php artisan optimize
chown -R www-data:www-data storage bootstrap/cache

exec docker-php-entrypoint "$@"
