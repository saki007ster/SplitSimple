#!/bin/sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "Usage: npm run db:verify-backup -- path/to/backup.dump" >&2
  exit 1
fi

pg_restore --list "$1" >/dev/null
echo "Backup archive is readable: $1"
