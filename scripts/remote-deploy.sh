#!/usr/bin/env bash
# Receives release.tar.gz in this user's home. No installs/builds or privileged changes.
set -euo pipefail
umask 027
expected_hash="${1:?Expected release SHA-256 is required}"
[[ "$expected_hash" =~ ^[a-f0-9]{64}$ ]]
[[ "$(id -un)" == 's20210104034' ]] || { echo 'Wrong deployment user.' >&2; exit 1; }
php -r 'exit(PHP_MAJOR_VERSION === 8 && PHP_MINOR_VERSION === 4 ? 0 : 1);'
release="$HOME/release.tar.gz"
app_dir="$HOME/laravel"
[[ -f "$release" && -d "$app_dir" && ! -L "$app_dir" && -f "$app_dir/.env" ]]
[[ "$(realpath "$app_dir")" == "$HOME/laravel" ]]
[[ -S /run/php/php8.4-fpm-s20210104034.sock ]]
exec 9>"$HOME/.jobconnect-deploy.lock"
flock -n 9 || { echo 'Another deployment is active.' >&2; exit 1; }
printf '%s  %s\n' "$expected_hash" "$release" | sha256sum --check --status
archive_list="$(tar -tzf "$release")"
while IFS= read -r entry; do
    case "/$entry/" in
        *'/../'*|*'/.env'*|*'/storage/'*|*'/node_modules/'*|*'/.git/'*|*'/*.sqlite'*)
            echo 'Archive contains a forbidden path.' >&2; exit 1 ;;
    esac
    case "$entry" in /*) echo 'Absolute archive path rejected.' >&2; exit 1 ;; esac
done <<< "$archive_list"
cd "$app_dir"
env_hash="$(sha256sum .env)"
if [[ -f vendor/autoload.php && -f artisan ]]; then
    php artisan down --retry=30
fi
# Excluded runtime paths retain their existing data and production configuration.
tar -xzf "$release" --no-same-owner --no-same-permissions -C "$app_dir"
[[ "$(sha256sum .env)" == "$env_hash" ]]
mkdir -p storage/app/private storage/app/public storage/framework/cache/data \
    storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chmod -R u+rwX,go+rX app bootstrap config database public resources routes vendor
chmod -R u+rwX storage bootstrap/cache
chmod 700 storage storage/app storage/app/private
setfacl -m u:www-data:x storage storage/app
setfacl -R -m u:www-data:rX -m d:u:www-data:rX storage/app/public
chmod 600 .env
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan package:discover --ansi
php artisan migrate --force
php artisan db:seed --force
if [[ ! -L public/storage ]]; then
    php artisan storage:link
fi
php artisan optimize
php artisan up
curl --fail --silent --show-error --retry 5 --retry-all-errors --retry-delay 2 --max-time 15 \
    --resolve jobconnect.austattendance.online:80:127.0.0.1 \
    http://jobconnect.austattendance.online/api/health \
    | php -r '$r = json_decode(stream_get_contents(STDIN), true); exit(($r["status"] ?? null) === "ok" ? 0 : 1);'
curl --fail --silent --show-error --max-time 15 \
    --resolve jobconnect.austattendance.online:80:127.0.0.1 \
    http://jobconnect.austattendance.online/ | grep -q 'id="root"'
rm -- "$release"
printf '%s\n' 'Deployment verified: http://jobconnect.austattendance.online'
