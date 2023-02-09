"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logResponse = exports.log = void 0;
require("colors");
function log(message, type) {
    switch (type) {
        case 'debug':
            break;
        case 'error':
            break;
        case 'log':
            break;
        case 'warn':
            break;
        default:
            break;
    }
}
exports.log = log;
function logResponse(res) {
    return __awaiter(this, void 0, void 0, function* () {
        var str = statusToString(res.status) + " " + res.method.toUpperCase() + " " + res.endpoint + " " + (res.body ? res.body.length : 0) + " " + res.ms + " ms";
        console.log(str);
    });
}
exports.logResponse = logResponse;
function statusToString(status) {
    switch (status) {
        case 200:
            return '200'.green;
        case 404:
            return '404'.red;
        case 500:
            return '500'.red;
        default:
            return "200".green;
    }
}
