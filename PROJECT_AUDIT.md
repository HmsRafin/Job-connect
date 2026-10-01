# Project audit against the final-checkpoint PDF

Audit date: 2026-10-01. Source: `Keys/CSE 3100 - Final Checkpoint Guidelines (1).pdf` in the parent workspace. The PDF is a deployment rubric, not a detailed feature specification.

## Required outcomes

| PDF requirement | Implementation | Verification |
| --- | --- | --- |
| Working live project (5 marks) | Laravel API and React SPA; three roles; persisted workflows | Local API and browser tests; live verification recorded after pipeline deployment |
| Own MySQL database/user (3 marks) | `jobconnect_db` and limited `jobconnect` user on instructor-managed `cse3100-db`, localhost port 3307 | Created through authorized setup; CI runs backend tests on MySQL; pipeline runs live migrations |
| End-to-end QA (2 marks) | Same-origin `/api`; static assets under `/app/`; Laravel SPA fallback | PHPUnit API tests and Chromium UI tests, including direct-route reload and mobile layout |
| CI/CD (10 marks) | Push to master or main triggers tests, production Composer install, npm ci/build, validated archive, SCP, SSH migrations/optimize | A successful Actions run and exact deployed commit are required evidence |
| Instructor-visible public repository | `HmsRafin/Job-Connect` | Repository currently private; owner decision on public visibility is pending |
| PHP-FPM and nginx on assigned domain | Per-user PHP 8.4 socket; JobConnect-only nginx site | Socket confirmed; domain resolves; `nginx -t` passed before reload |
| No builds/dev servers on class VPS | All dependency installation and asset compilation happen in Actions | Deployment scripts run only extraction, permissions, Artisan migrations/cache and HTTP checks |
| Preserve secrets and data | Private environment on server, dedicated deploy key in encrypted Actions secret, persistent runtime directories | Release allowlist and validator reject environment files, keys, databases and runtime storage |

## Problems corrected

- Original documentation described a live deployment whose folders no longer existed. Deployment now targets the actual class environment.
- Replaced SQLite-on-VPS and development server containers with the PDF's PHP-FPM/shared-MySQL production model.
- Kept a separate local Docker stack with PHP-FPM/nginx/MySQL, stable secrets, persistent storage and strict readiness checks.
- Fixed frontend builds and relative API URLs for one-domain deployment.
- Blocked public administrator signup and inactive accounts. Added ownership checks for jobs, applications, tasks, interviews, payments and support.
- Removed success fallbacks that fabricated jobs, applications or other records after failed API calls. Authentication is verified with the API.
- Restricted public job listings to approved jobs; removed candidate data from public listing responses.
- Persisted bookmarks, categories and notifications in the database.
- Stored CVs/task submissions privately and required authorization for downloads.
- Made initial administrator provisioning require supplied credentials, without resetting existing administrators.
- Implemented explicitly labeled demo checkout with server-calculated prices and Demo transaction records. No card information or money is collected.
- Updated vulnerable locked dependencies and aligned CI with PHP 8.4 and Node 24.

## Validation

- PHP syntax checks passed for application, routes, configuration, migrations and tests.
- Composer strict validation passed.
- Backend suite: 11 tests and 53 assertions passed on local SQLite after dependency updates. GitHub Actions also passed the suite on SQLite and MySQL.
- Frontend production build passed. Lint has existing non-fatal unused-import and hook-dependency warnings; these are not represented as a clean warning-free run.
- All three local Chromium tests passed, covering public/mobile pages, registration and route guards, profile updates, private CV upload, job approval/application, demo advertisement checkout, and all role pages.
- Local Docker execution is unavailable because this Windows computer has no Docker engine. CI builds and exercises the actual Docker stack on an isolated runner.

## Deliberate limits

Payments are a course demonstration, as requested. Real billing and SMTP delivery are not configured. AI candidate scores are not fabricated; unscored candidates are shown as such. The course domain currently uses HTTP, matching the PDF. The app should receive HTTPS and a separate operational review before use with real hiring data. No claim of zero defects or guaranteed marks is made.

See the repository's Actions tab for the final deployment result, and `VPS.md` / `DOCKER.md` for repeatable operation.
