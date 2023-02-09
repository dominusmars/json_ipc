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
const {JsonIpc} = require('../modules/jsonipc');
const {fork} = require('child_process');
if (process.argv[2] == 'child') {
    const application = new JsonIpc();
    application.set('get', 'test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res('hello word');
    }));
    application.debugging();
    console.log(application.endpoints());
} else {
    var child = fork(__filename, ['child'], {
        stdio: [
            'inherit',
            'inherit',
            'inherit',
            'ipc'
        ]
    });
    child.on('spawn', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('spawned');
        setTimeout(() => {
            child.send(JSON.stringify({
                id: 'hello',
                method: 'get',
                endpoint: 'test'
            }));
            child.send(JSON.stringify({
                id: 'hello',
                method: 'get',
                endpoint: 'endpoints'
            }));
        }, 1000);
    }));
    child.on('message', m => {
        console.log('got ' + m);
    });
    child.on('error', e => {
        console.log(e);
    });
}