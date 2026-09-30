#!/usr/bin/env bash
# Read-only preflight. The class host already provides nginx, PHP-FPM and MySQL.
set -euo pipefail
[[ "$(id -un)" == 's20210104034' ]] || { echo 'Run as s20210104034 on the class VPS.' >&2; exit 1; }
php -r 'exit(PHP_MAJOR_VERSION === 8 && PHP_MINOR_VERSION === 4 ? 0 : 1);'
[[ -S /run/php/php8.4-fpm-s20210104034.sock ]]
for tool in tar curl flock sha256sum; do command -v "$tool" >/dev/null; done
php -r 'foreach (["pdo_mysql", "mbstring", "xml", "ctype", "curl", "fileinfo", "openssl", "tokenizer"] as $extension) { if (!extension_loaded($extension)) { fwrite(STDERR, "Missing PHP extension: $extension\n"); exit(1); } }'
printf '%s\n' 'Class-host prerequisites passed. Follow VPS.md for this project only.'
