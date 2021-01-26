# mxn-favicons

[![npm@latest](https://badgen.net/npm/v/mxn-favicons)](https://www.npmjs.com/package/mxn-favicons)
[![Install size](https://packagephobia.now.sh/badge?p=mxn-favicons)](https://packagephobia.now.sh/result?p=mxn-favicons)
[![Downloads](https://img.shields.io/npm/dm/mxn-favicons.svg)](https://npmjs.com/package/mxn-favicons)

**mxn-favicons** is a fork of [**connect-favicons**](https://github.com/theworkers/connect-favicons), a simple [**connect**](https://github.com/senchalabs/connect) middleware to serve site icons (favicon.ico and apple-touch-icon.png and all its flavours) from any directory.

## Install

```
$ npm install mxn-favicons
```

## Usage

Add **mxn-favicons** to your middleware stack before everything else. The whole point here is to serve **favicon.ico** and **apple-touch-icon.png** (et al.) quickly, without involving any routing.

In this case, you may have all your site icons, including favicon.ico in `/public/icons`:

```js
app.use(favicons(__dirname + "/public/icons"));
```

Now any request to the `example.com/favicon.ico` or `example.com/apple-touch-icon.png` will be served by MXN Favicons, reading from the folder you specified.

Example:

```js
// HTTP server
const http  = require("http");

// MXN Connect Framework and Middleware
const connect = require("mxn-connect");
const favicon = require("mxn-favicons");
const sstatic = require("serve-static");

// Instantiating the App
const app = connect();

// Adding Middleware
app.use(favicon(__dirname + "/public/icons"));
app.use(sstatic(__dirname + "/public"));

// Create node.js http server and listen on port
const options = { };
const server = http.createServer(options, app).listen(3000, function() {
    console.log("MXN Connect server is running on port " + 3000);
});

server.on("error" , function(error) {
    console.error("Error event handler called: " + error);
});
```

## License

This module is released under the MIT license.
The original author of **connect-favicons** is [Tommaso Lanza and The Workers Ltd](https://github.com/theworkers/connect-favicons).

## Related

- [mxn-connect](https://github.com/ZimNovich/mxn-connect) - High performance middleware framework based on connect
- [mxn-jsx-ast-transformer](https://github.com/ZimNovich/mxn-jsx-ast-transformer) - Transforms JSX AST into regular JS AST
- [mxn-jsx-transpiler](https://github.com/ZimNovich/mxn-jsx-transpiler) - Transpiles JSX to regular JavaScript
