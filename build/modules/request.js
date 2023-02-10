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
var __classPrivateFieldSet = this && this.__classPrivateFieldSet || function (receiver, state, value, kind, f) {
    if (kind === 'm')
        throw new TypeError('Private method is not writable');
    if (kind === 'a' && !f)
        throw new TypeError('Private accessor was defined without a setter');
    if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError('Cannot write private member to an object whose class did not declare it');
    return kind === 'a' ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = this && this.__classPrivateFieldGet || function (receiver, state, kind, f) {
    if (kind === 'a' && !f)
        throw new TypeError('Private accessor was defined without a getter');
    if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError('Cannot read private member from an object whose class did not declare it');
    return kind === 'm' ? f : kind === 'a' ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { 'default': mod };
};
var _JsonRequest_instances, _JsonRequest_server, _JsonRequest_messages, _JsonRequest_ready, _JsonRequest_timeout, _JsonRequest_parseMessages, _JsonRequest_createRequest, _JsonRequest_sendRequest;
Object.defineProperty(exports, '__esModule', { value: true });
exports.JsonRequest = void 0;
const make_id_1 = require('../utils/make_id');
const child_process_1 = require('child_process');
const delay_1 = __importDefault(require('delay'));
class JsonRequest {
    constructor(location) {
        _JsonRequest_instances.add(this);
        _JsonRequest_server.set(this, void 0);
        _JsonRequest_messages.set(this, void 0);
        _JsonRequest_ready.set(this, void 0);
        _JsonRequest_timeout.set(this, 100000);
        __classPrivateFieldSet(this, _JsonRequest_messages, new Map(), 'f');
        __classPrivateFieldSet(this, _JsonRequest_ready, false, 'f');
        this.endpoints = {};
        __classPrivateFieldSet(this, _JsonRequest_server, (0, child_process_1.fork)(location, ['child'], {
            stdio: [
                'inherit',
                'inherit',
                'inherit',
                'ipc'
            ]
        }), 'f');
        __classPrivateFieldGet(this, _JsonRequest_server, 'f').on('spawn', () => {
            __classPrivateFieldGet(this, _JsonRequest_server, 'f').send(JSON.stringify(__classPrivateFieldGet(this, _JsonRequest_instances, 'm', _JsonRequest_createRequest).call(this, 'get', 'endpoints', '')));
        });
        __classPrivateFieldGet(this, _JsonRequest_server, 'f').on('message', __classPrivateFieldGet(this, _JsonRequest_instances, 'm', _JsonRequest_parseMessages));
    }
    setTimeout(ms) {
        __classPrivateFieldSet(this, _JsonRequest_timeout, ms, 'f');
    }
    get(endpoint, body) {
        return __awaiter(this, void 0, void 0, function* () {
            var req = __classPrivateFieldGet(this, _JsonRequest_instances, 'm', _JsonRequest_createRequest).call(this, 'get', endpoint, body);
            return yield __classPrivateFieldGet(this, _JsonRequest_instances, 'm', _JsonRequest_sendRequest).call(this, req);
        });
    }
    post(endpoint, body) {
        return __awaiter(this, void 0, void 0, function* () {
            var req = __classPrivateFieldGet(this, _JsonRequest_instances, 'm', _JsonRequest_createRequest).call(this, 'post', endpoint, body);
            return yield __classPrivateFieldGet(this, _JsonRequest_instances, 'm', _JsonRequest_sendRequest).call(this, req);
        });
    }
    del(endpoint, body) {
        return __awaiter(this, void 0, void 0, function* () {
            var req = __classPrivateFieldGet(this, _JsonRequest_instances, 'm', _JsonRequest_createRequest).call(this, 'del', endpoint, body);
            return yield __classPrivateFieldGet(this, _JsonRequest_instances, 'm', _JsonRequest_sendRequest).call(this, req);
        });
    }
}
exports.JsonRequest = JsonRequest;
_JsonRequest_server = new WeakMap(), _JsonRequest_messages = new WeakMap(), _JsonRequest_ready = new WeakMap(), _JsonRequest_timeout = new WeakMap(), _JsonRequest_instances = new WeakSet(), _JsonRequest_parseMessages = function _JsonRequest_parseMessages(m) {
    var message = JSON.parse(m);
    if (message.endpoint == 'endpoints' && message.body) {
        this.endpoints = JSON.parse(message.body);
        __classPrivateFieldSet(this, _JsonRequest_ready, true, 'f');
        return;
    }
    __classPrivateFieldGet(this, _JsonRequest_messages, 'f').set(message.id, message);
}, _JsonRequest_createRequest = function _JsonRequest_createRequest(method, endpoint, body) {
    return {
        id: (0, make_id_1.makeId)(10),
        body: body ? body : '',
        endpoint: endpoint,
        method: method
    };
}, _JsonRequest_sendRequest = function _JsonRequest_sendRequest(m) {
    return __awaiter(this, void 0, void 0, function* () {
        while (!__classPrivateFieldGet(this, _JsonRequest_ready, 'f')) {
            yield (0, delay_1.default)(100);
        }
        if (!this.endpoints[m.method].includes(m.endpoint)) {
            throw new Error(`Ipc doesnt contain endpoint ${ m.endpoint } on method ${ m.method }`);
        }
        __classPrivateFieldGet(this, _JsonRequest_server, 'f').send(JSON.stringify(m));
        var now = 0;
        while (__classPrivateFieldGet(this, _JsonRequest_messages, 'f').get(m.id) == undefined && now < __classPrivateFieldGet(this, _JsonRequest_timeout, 'f')) {
            yield (0, delay_1.default)(1);
            now++;
        }
        if (now >= __classPrivateFieldGet(this, _JsonRequest_timeout, 'f')) {
            throw new Error(`Request ${ m.id } Timeout ${ now } `);
        }
        var response = __classPrivateFieldGet(this, _JsonRequest_messages, 'f').get(m.id);
        if (response == undefined) {
            throw new Error(`Request ${ m.id } returned null `);
        }
        return response;
    });
};