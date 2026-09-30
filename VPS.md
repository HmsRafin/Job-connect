# Class-server deployment

This procedure follows `CSE 3100 - Final Checkpoint Guidelines (1).pdf` supplied in the workspace's `Keys` directory. It supersedes the previous Docker-on-VPS instructions.

| Setting | Value |
| --- | --- |
| Public domain | http://jobconnect.austattendance.online |
| SSH account | s20210104034@187.52.122.100 |
| Application root | /home/s20210104034/laravel |
| PHP service | /run/php/php8.4-fpm-s20210104034.sock |
| MySQL address | 127.0.0.1:3307 |
| Database / application user | jobconnect_db / jobconnect |
| Shared DB container | cse3100-db (instructor managed) |
| Repository | https://github.com/HmsRafin/Job-Connect |

## One-time setup

Verify the per-user FPM socket exists. Prepare only this user's `~/laravel/public`, configure the project's limited database user, and create `~/laravel/.env` from `.env.vps.example`. Generate unique keys/passwords. The pipeline must preserve that file. Give nginx traversal/read permissions for this project's public directory; private files stay restricted.

Install `scripts/nginx-class-vps.conf` as `/etc/nginx/sites-available/jobconnect.austattendance.online` and enable only that site. Run `sudo nginx -t` successfully before any nginx reload. Never edit another student's configuration or stop/restart `cse3100-db`.

Create a separate SSH key for GitHub Actions, append only its public key to this account's authorized keys, and preserve existing entries. Repository settings require:

- Actions secret `SSH_PRIVATE_KEY`: dedicated deployment private key.
- Actions variable `SSH_HOST_FINGERPRINT`: verified SHA-256 ED25519 server fingerprint.

The deployment compares a fresh `ssh-keyscan` result to that fingerprint before SCP or SSH.

## Release process

Push to `main`. The `Deploy to VPS` workflow invokes CI, including MySQL integration tests and a running Docker/browser test. Only after it succeeds does the release job:

1. Install production PHP packages on the GitHub runner with an optimized autoloader.
2. Run Node 24, `npm ci` and the React production build into `backend/public/app`.
3. Pack the backend, `vendor/` and built assets in `release.tar.gz` and validate its contents.
4. Copy the archive with `scp` using the dedicated key.
5. Verify its checksum, extract under `~/laravel` while preserving `.env` and runtime storage, run migrations and first-admin seeding, and rebuild caches.
6. Verify database-backed HTTP readiness and the React entry point before reporting success.

The server never runs Composer install, npm install/build, a Node development server or `artisan serve`. The supplied manual deployment helper is for recovery; a manual copy is not evidence of the required CI/CD marks.

## Operation

Inspect the repository's Actions tab for the exact deployed commit and successful run. After changing server `.env`, rebuild Laravel's configuration with `php artisan optimize` as the project user. Keep the database, uploads and application key across releases. Do not run `migrate:fresh`, truncate live tables or delete persistent storage.

Checkout is an explicitly labeled demo. Password recovery is handled through the support form until an SMTP service is configured. The course URL uses HTTP as prescribed by the PDF; configure HTTPS before treating this as a real public hiring service handling personal data.
