'use strict';

require('dotenv').config(); // this is unconditional, which will require heroku to install it (which is not needed), but since it is listed in core dependencies, it at least won't break heroku. Later learn to do it conditionally.

exports.DATABASE_URL =
    process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://localhost/music-app';
exports.TEST_DATABASE_URL =
    process.env.TEST_DATABASE_URL ||
    global.TEST_DATABASE_URL ||
    'mongodb://localhost/music-app-test';
exports.PORT = process.env.PORT || 8080;
exports.TEST_PORT = process.env.TEST_PORT || 8081;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
