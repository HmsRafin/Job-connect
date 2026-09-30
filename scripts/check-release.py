#!/usr/bin/env python3
"""Validate the deployable archive without extracting or revealing file contents."""
import posixpath
import sys
import tarfile
from pathlib import PurePosixPath

archive = sys.argv[1] if len(sys.argv) > 1 else 'release.tar.gz'
allowed_roots = {'app', 'artisan', 'bootstrap', 'config', 'database', 'public', 'resources', 'routes', 'vendor', 'composer.json', 'composer.lock'}
required = {'artisan', 'vendor/autoload.php', 'public/index.php', 'public/app/index.html'}
seen = set()
with tarfile.open(archive, 'r:gz') as release:
    for member in release:
        path = PurePosixPath(member.name)
        parts = path.parts
        if not parts or path.is_absolute() or '..' in parts or parts[0] not in allowed_roots:
            raise SystemExit('Unsafe or unexpected archive path: ' + member.name)
        if any(p.startswith('.env') or p in {'.git', 'node_modules', 'storage', 'keys', 'Keys'} for p in parts):
            raise SystemExit('Private/generated content in release: ' + member.name)
        if path.suffix in {'.sqlite', '.pem', '.key'} or '.sqlite-' in path.name:
            raise SystemExit('Database/key file in release: ' + member.name)
        if member.isdev() or member.isfifo() or member.islnk():
            raise SystemExit('Unsupported archive entry: ' + member.name)
        if member.issym():
            target = posixpath.normpath(posixpath.join(str(path.parent), member.linkname))
            if member.linkname.startswith('/') or target == '..' or target.startswith('../'):
                raise SystemExit('Escaping archive symlink: ' + member.name)
        seen.add(str(path))
missing = required - seen
if missing:
    raise SystemExit('Missing release files: ' + ', '.join(sorted(missing)))
print(f'Release validated: {len(seen)} entries; backend dependencies and built frontend included.')
