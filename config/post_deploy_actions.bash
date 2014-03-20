NODE_VERSION="v0.10.24"
NODE_PLATFORM="linux"
NODE_ARCH="x64"
NODE_DOWNLOAD_URL="http://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-$NODE_PLATFORM-$NODE_ARCH.tar.gz"

mkdir -p ../node
NODE_DIR="`(cd ../node && pwd)`"

install_node() {
    echo "------> Installing nodejs $NODE_VERSION"
    (
        cd "$NODE_DIR"
        curl -# "$NODE_DOWNLOAD_URL" | tar xz --strip-components=1
    )
}

if [ ! -e ../node/bin/node ]; then
    # node isn't installed, install it.
    install_node
elif [ "`../node/bin/node -v`" != "$NODE_VERSION" ]; then
    # node is installed but isn't the correct version, install it.
    install_node

    # rebuild npm modules for the new node version
    ../node/bin/npm rebuild || true
fi

export PATH="$NODE_DIR/bin:$PATH"
# Fetch NPM modules, compile CSS
make all public-production
