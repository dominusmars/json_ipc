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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _JsonIpc_routes, _JsonIpc_debug;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonIpc = void 0;
const message_1 = require("./message");
const output_1 = require("./output");
const events_1 = __importDefault(require("events"));
function invalidRequest(error) {
    return JSON.stringify({
        'body': error,
        'status': 500,
    });
}
class JsonIpc extends events_1.default {
    constructor() {
        super();
        _JsonIpc_routes.set(this, void 0);
        _JsonIpc_debug.set(this, void 0);
        __classPrivateFieldSet(this, _JsonIpc_routes, new Map(), "f");
        __classPrivateFieldSet(this, _JsonIpc_debug, false, "f");
        if (!process || process == undefined) {
            throw new Error("Not a Node Process ");
        }
        if (!process.send) {
            throw new Error("Ipc not connected");
        }
        process.on('message', (m) => __awaiter(this, void 0, void 0, function* () {
            var then = Date.now();
            if (!process || process == undefined) {
                throw new Error("Not a Node Process ");
            }
            if (!process.send) {
                throw new Error("Ipc not connected");
            }
            var message = (0, message_1.parseMessage)(m);
            if (!message) {
                (0, output_1.send)(invalidRequest("Unable to parse Message"));
                return;
            }
            if (!message.method || !message.endpoint) {
                (0, output_1.send)(invalidRequest("Unable to read Message"));
                return;
            }
            if (!__classPrivateFieldGet(this, _JsonIpc_routes, "f").has(message.method)) {
                (0, output_1.send)(invalidRequest("Invalid Method"));
                return;
            }
            var route = __classPrivateFieldGet(this, _JsonIpc_routes, "f").get(message.method);
            if (!(route === null || route === void 0 ? void 0 : route.has(message.endpoint))) {
                return (0, output_1.send)(invalidRequest("Invalid Endpoint"));
            }
            var func = route.get(message.endpoint);
            if (func == undefined) {
                return (0, output_1.send)(invalidRequest("Invalid Endpoint"));
            }
            try {
                func(message, this.response.bind(this, message, then));
            }
            catch (error) {
                console.log(error);
            }
        }));
        this.set('get', 'endpoints', (res, req) => {
            req(this.api(), 200);
        });
    }
    response(m, ms, body, status) {
        if (!process || process == undefined) {
            throw new Error("Not a Node Process ");
        }
        if (!process.send) {
            throw new Error("Ipc not connected");
        }
        if (!body) {
            body = "";
        }
        if (typeof body != 'string') {
            body = JSON.stringify(body);
        }
        var now = Date.now();
        (0, output_1.send)((0, message_1.createResponse)(m, status, body, now - ms), __classPrivateFieldGet(this, _JsonIpc_debug, "f"));
    }
    debugging() {
        __classPrivateFieldSet(this, _JsonIpc_debug, true, "f");
    }
    get(endpoint, func) {
        var method = __classPrivateFieldGet(this, _JsonIpc_routes, "f").get('get');
        if (!method) {
            __classPrivateFieldGet(this, _JsonIpc_routes, "f").set('get', new Map());
        }
        method = __classPrivateFieldGet(this, _JsonIpc_routes, "f").get('get');
        method === null || method === void 0 ? void 0 : method.set(endpoint, func);
    }
    post(endpoint, func) {
        var method = __classPrivateFieldGet(this, _JsonIpc_routes, "f").get('post');
        if (!method) {
            __classPrivateFieldGet(this, _JsonIpc_routes, "f").set('post', new Map());
        }
        method = __classPrivateFieldGet(this, _JsonIpc_routes, "f").get('post');
        method === null || method === void 0 ? void 0 : method.set(endpoint, func);
    }
    del(endpoint, func) {
        var method = __classPrivateFieldGet(this, _JsonIpc_routes, "f").get('del');
        if (!method) {
            __classPrivateFieldGet(this, _JsonIpc_routes, "f").set('del', new Map());
        }
        method = __classPrivateFieldGet(this, _JsonIpc_routes, "f").get('del');
        method === null || method === void 0 ? void 0 : method.set(endpoint, func);
    }
    set(method, endpoint, func) {
        var methodRoute = __classPrivateFieldGet(this, _JsonIpc_routes, "f").get(method);
        if (!methodRoute) {
            __classPrivateFieldGet(this, _JsonIpc_routes, "f").set(method, new Map());
        }
        methodRoute = __classPrivateFieldGet(this, _JsonIpc_routes, "f").get(method);
        methodRoute === null || methodRoute === void 0 ? void 0 : methodRoute.set(endpoint, func);
    }
    endpoints() {
        var routes = [];
        let routeList = [];
        for (let method of Object.keys(__classPrivateFieldGet(this, _JsonIpc_routes, "f"))) {
            if (method != 'get' && method != 'post' && method != 'del') {
                continue;
            }
            var route = __classPrivateFieldGet(this, _JsonIpc_routes, "f").get(method);
            if (!route) {
                continue;
            }
            for (let endpoint of Object.keys(route)) {
                routeList.push(`${method} ${endpoint}`);
            }
        }
        return routeList;
        return routes;
    }
    api() {
        var _a;
        let result = {};
        for (let method of Array.from(__classPrivateFieldGet(this, _JsonIpc_routes, "f").keys())) {
            result[method] = Array.from(((_a = __classPrivateFieldGet(this, _JsonIpc_routes, "f").get(method)) === null || _a === void 0 ? void 0 : _a.keys()) || []);
        }
        return result;
    }
}
exports.JsonIpc = JsonIpc;
_JsonIpc_routes = new WeakMap(), _JsonIpc_debug = new WeakMap();
