#!/bin/bash

set -e

# Make sure we're in the right directory
cd "$(dirname "$BASH_SOURCE")/../"

RELEASE_DIR="$(pwd -P)"
VHOST_ROOT="$(cd ../ && pwd -P)"

NODE_VERSION="v0.10.31"
NODE_PLATFORM="linux"
NODE_ARCH="x64"
NODE_DOWNLOAD_URL="http://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-$NODE_PLATFORM-$NODE_ARCH.tar.gz"

NODE_DIR="$VHOST_ROOT/node"
mkdir -p "$NODE_DIR"

install_node() {
    echo "------> Installing nodejs $NODE_VERSION"
    (
        cd "$NODE_DIR"
        curl -# "$NODE_DOWNLOAD_URL" | tar xz --strip-components=1
    )
}

if [[ ! -e "$NODE_DIR/bin/node" ]]; then
    # node isn't installed, install it.
    install_node
elif [[ "$("$NODE_DIR/bin/node" -v)" != "$NODE_VERSION" ]]; then
    # node is installed but isn't the correct version, install it.
    install_node

    # rebuild npm modules for the new node version
    "$NODE_DIR/bin/npm" rebuild || true
fi

export PATH="$NODE_DIR/bin:$PATH"

CACHE_DIR="$VHOST_ROOT/cache"
mkdir -p "$CACHE_DIR"

mkdir -p "$CACHE_DIR/vendor"
bundle install --deployment --path "$CACHE_DIR/vendor/bundle" --binstubs "$CACHE_DIR/vendor/bundle-bin"
export PATH="$CACHE_DIR/vendor/bundle-bin:$PATH"

mkdir -p "$CACHE_DIR/node_modules"

# We copy rather than symlink to make rolling back to previous versions easier.
cp -R "$CACHE_DIR/node_modules" "$RELEASE_DIR/"

# Fetch NPM modules, compile CSS
make all public-production

# Take a copy of the updated node_modules directory.
cp -R "$RELEASE_DIR/node_modules" "$CACHE_DIR/"
