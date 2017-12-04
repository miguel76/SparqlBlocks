# SparqlBlocks
Using Blockly library for building SPARQL queries with blocks.

http://sparqlblocks.org/

## Usage

Just serve statically the content of the directory `./dist`.

For example, if you have python installed you can use SimpleHTTPServer

```sh
cd dist
python -m SimpleHTTPServer 8080
```

and then open http://localhost:8080/.

Alternatively, you can use the nodejs server in [SparqlBlocks-Server](https://github.com/miguel76/SparqlBlocks-Server) that offers also logging capability.

## Contributing

### Prerequisites

To contribute you need to have [Node+npm](https://nodejs.org/), and [gulp](https://gulpjs.com/).

#### Check for Node and npm

Check if you've installed Node and npm.

```sh
node --version
```
```sh
npm --version
```

#### Install Node and npm

If you don't have them, download and install them from [Node.js website](https://nodejs.org/)

#### Check for gulp

Check if you've installed gulp.

```sh
gulp --version
```

#### Install gulp

If you don't have gulp, run the following command to install it.

```sh
npm install --global gulp-cli
```

### Building

To install the dependencies, run this command from the main dir.

```sh
npm install
```

To build the static files in './dist' after a change, run gulp.

```sh
gulp
```

