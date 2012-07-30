mkdir -p ../node
NODE_DIR=`(cd ../node && pwd)`

if [ ! -e ../node/bin/npm ]; then
    mkdir -p ../node-src
    cd ../node-src
    curl http://nodejs.org/dist/v0.8.4/node-v0.8.4.tar.gz | tar xz --strip-components=1
    ./configure --prefix=$NODE_DIR
    make install
    cd -
fi

export PATH=$NODE_DIR/bin:$PATH
npm install
npm prune
compass compile
