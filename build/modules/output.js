'use strict';
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator['throw'](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.send = void 0;
const routeLogger_1 = require('../outs/routeLogger');
require('process');
function send(m, debug) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process || process == undefined) {
            return false;
        }
        if (!process.send) {
            return false;
        }
        if (typeof m == 'string') {
            process.send(m);
            return true;
        }
        debug && (0, routeLogger_1.logResponse)(m);
        process.send(JSON.stringify(m));
        return true;
    });
}
exports.send = send;