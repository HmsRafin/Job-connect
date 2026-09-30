#!/usr/bin/env bash
# Deploy a prebuilt and validated archive from the LOCAL machine. Prefer GitHub Actions.
set -euo pipefail
project_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$project_root"
: "${DEPLOY_KEY:?Set DEPLOY_KEY to your separate deployment private-key path}"
[[ -f "$DEPLOY_KEY" ]]
python3 scripts/check-release.py release.tar.gz
release_hash="$(sha256sum release.tar.gz | cut -d ' ' -f 1)"
# Uses the host key already verified in ~/.ssh/known_hosts. Never silently trusts a new host.
scp -i "$DEPLOY_KEY" -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=yes \
    release.tar.gz s20210104034@187.52.122.100:release.tar.gz
ssh -i "$DEPLOY_KEY" -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=yes \
    s20210104034@187.52.122.100 "bash -s -- $release_hash" < scripts/remote-deploy.sh
