#!/bin/sh
set -eu

if [ -z "${POSTGRES_URL_NON_POOLING:-}" ]; then
  echo "POSTGRES_URL_NON_POOLING is required" >&2
  exit 1
fi

backup_dir="${1:-./backups}"
mkdir -p "$backup_dir"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_file="$backup_dir/splitsimple-$timestamp.dump"

pg_dump --dbname="$POSTGRES_URL_NON_POOLING" --format=custom --compress=9 --no-owner --no-acl --file="$backup_file"
pg_restore --list "$backup_file" >/dev/null
echo "$backup_file"
