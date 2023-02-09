'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createResponse = exports.parseMessage = void 0;
const make_id_1 = require('../utils/make_id');
function parseMessage(m) {
    try {
        var message = JSON.parse(m);
        if (!message.id) {
            message.id = (0, make_id_1.makeId)(10);
        }
        return message;
    } catch (error) {
        return false;
    }
}
exports.parseMessage = parseMessage;
function createResponse(m, status, body, ms) {
    return {
        id: m.id,
        res: m,
        method: m.method,
        body: body ? body : '',
        status: status ? status : 200,
        endpoint: m.endpoint,
        ms: ms
    };
}
exports.createResponse = createResponse;