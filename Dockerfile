# syntax=docker/dockerfile:1
FROM node:24-alpine AS frontend-build
WORKDIR /build/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build && test -s /build/backend/public/app/index.html

FROM php:8.4-fpm-bookworm AS php-base
RUN apt-get update && apt-get install -y --no-install-recommends \
    libfcgi-bin libicu-dev libonig-dev libsqlite3-dev libzip-dev unzip \
    && docker-php-ext-install -j"$(nproc)" bcmath intl mbstring opcache pcntl pdo_mysql pdo_sqlite zip \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /var/www/html
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && printf 'upload_max_filesize=12M\npost_max_size=16M\nexpose_php=Off\n' > "$PHP_INI_DIR/conf.d/jobconnect.ini" \
    && printf '[www]\nping.path=/fpm-ping\n' > /usr/local/etc/php-fpm.d/zz-jobconnect.conf

FROM php-base AS dependencies
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction --prefer-dist --no-progress
COPY backend/ ./
RUN mkdir -p bootstrap/cache storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs \
    && composer dump-autoload --no-dev --optimize --no-interaction \
    && composer check-platform-reqs --no-dev

FROM php-base AS backend
COPY --from=dependencies /var/www/html /var/www/html
COPY --from=frontend-build /build/backend/public/app ./public/app
COPY backend/docker-entrypoint.sh /usr/local/bin/jobconnect-entrypoint
COPY backend/docker-healthcheck.sh /usr/local/bin/jobconnect-fpm-healthcheck
RUN chmod +x /usr/local/bin/jobconnect-entrypoint /usr/local/bin/jobconnect-fpm-healthcheck \
    && chown -R www-data:www-data storage bootstrap/cache
EXPOSE 9000
ENTRYPOINT ["jobconnect-entrypoint"]
CMD ["php-fpm", "-F"]

FROM nginx:stable-alpine AS web
WORKDIR /var/www/html
COPY backend/public/ ./public/
COPY --from=frontend-build /build/backend/public/app ./public/app
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
