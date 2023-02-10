'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.JsonRequest = exports.JsonIpc = void 0;
require('module-alias/register');
const jsonipc_1 = require('./modules/jsonipc');
Object.defineProperty(exports, 'JsonIpc', {
    enumerable: true,
    get: function () {
        return jsonipc_1.JsonIpc;
    }
});
const request_1 = require('./modules/request');
Object.defineProperty(exports, 'JsonRequest', {
    enumerable: true,
    get: function () {
        return request_1.JsonRequest;
    }
});