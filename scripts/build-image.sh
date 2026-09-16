#!/bin/bash

# Read name/version from package.json using only POSIX tools, so the image can
# be built on hosts where Node.js/npm is not installed (see #219). Anchored on
# the key and limited to the first match, so a dependency whose name happens to
# contain "name" or "version" cannot add a second line to the result.
read_pkg_field() {
  grep -m1 "\"$1\"[[:space:]]*:" package.json |
    sed -E "s/.*\"$1\"[[:space:]]*:[[:space:]]*\"([^\"]+)\".*/\1/"
}

SPLITSIMPLE_APP_NAME=$(read_pkg_field name)
SPLITSIMPLE_VERSION=$(read_pkg_field version)

# we need to set dummy data for POSTGRES env vars in order for build not to fail
docker buildx build \
    -t ${SPLITSIMPLE_APP_NAME}:${SPLITSIMPLE_VERSION} \
    -t ${SPLITSIMPLE_APP_NAME}:latest \
    .

docker image prune -f
