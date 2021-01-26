/*!
 * mxn-favicons
 * Copyright(c) 2012 Tommaso Lanza and The Workers Ltd.
 * Copyright(c) 2020 Ilya A. Zimnovich
 * MIT Licensed
 */

"use strict"

var fs = require("fs");
var crypto = require("crypto");
var path = require("path");
var URL = require("url");

/**
 * Module variables.
 * @private
 */

var filenames = [
    "favicon.ico",
    "favicon.png",
    "apple-touch-icon.png",
    "apple-touch-icon-precomposed.png",
    "apple-touch-icon-57x57.png",
    "apple-touch-icon-57x57-precomposed.png",
    "apple-touch-icon-72x72.png",
    "apple-touch-icon-72x72-precomposed.png",
    "apple-touch-icon-76x76.png",
    "apple-touch-icon-76x76-precomposed.png",
    "apple-touch-icon-114x114.png",
    "apple-touch-icon-114x114-precomposed.png",
    "apple-touch-icon-120x120.png",
    "apple-touch-icon-120x120-precomposed.png",
    "apple-touch-icon-144x144.png",
    "apple-touch-icon-144x144-precomposed.png",
    "apple-touch-icon-152x152.png",
    "apple-touch-icon-152x152-precomposed.png",
    "apple-touch-icon-180x180.png",
    "apple-touch-icon-180x180-precomposed.png",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "favicon-128x128.png",
    "mstile-150x150.png",
    "safari-pinned-tab.svg"
];

/**
 * Get the request pathname.
 *
 * @param {object} req
 * @return {string}
 */

function getPathname (req) {
    try {
        // Request URL string. This contains only the URL that is present
        // in the actual HTTP request. Examples are:
        // - /proxies/css/maxi.css
        // - /favicon.ico
        var absURL = req.url;
        if (absURL === undefined) return undefined;

        // Test RegEx here: https://regexr.com/39o0i
        // var parts = /(?:https?:\/\/)?(?:[^?\/\s]+[?\/])(.*)/;

        var parsedURL = new URL.parse(absURL);
        return parsedURL.pathname;
    }
    catch (e) {
        return undefined;
    }
}

/**
 * Serves favicons located at the given `directory`.
 *
 * @public
 * @param {String} directory
 * @param {Object} [options]
 * @return {Function} middleware
 */

module.exports = function (directory, options)
{
    // Check "options" arguments
    if (typeof options === "undefined") {
        options = {};
    }

    // Check if "directory" argument is a string
    if (typeof directory !== "string") {
        throw new TypeError("Path to favicons is required");
    }

    var cache  = Object.create(null);
    var maxAge = options.maxAge || 86400000;

    return function favicons(req, res, next) {
        var pathname = getPathname(req);
        if (!pathname) {
            return next();
        }

        var basename = path.basename(pathname);
        var index = filenames.indexOf(basename);

        if ( index < 0 ) {
            return next();
        }

        if ( pathname.split("/").length > 2 ) {
            return next();
        }

        var extname = path.extname(basename);
        var cached = cache[basename];

        if (cached) {
            res.writeHead(200, cached.headers);
            res.end(cached.body);
            return;
        }

        var filename = path.join(directory, basename);

        fs.readFile(filename, function(err, buf) {
            if (err) {
                if (err.errno && err.errno === 34) {
                    res.statusCode = 404;
                }

                return next(err);
            }

            cached = cache[basename] = {
                headers: {
                    "Content-Type": (extname === ".ico") ? "image/x-icon" : "image/" + extname.split(".").pop(),
                    "Content-Length": buf.length,
                    "ETag": "\"" + crypto.createHash("md5").update(buf).digest("hex") + "\"",
                    "Cache-Control": "public, max-age=" + (maxAge / 1000)
                },
                body: buf
            };

            res.writeHead(200, cached.headers);
            res.end(cached.body);
        });
    };
};
