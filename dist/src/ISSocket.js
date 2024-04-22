"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISSocket = void 0;
const net_1 = require("net");
const uuid_1 = require("uuid");
const MESSAGE_DELIMITER = '\r\n';
const DISCONNECT_EVENTS = ['destroy', 'end', 'close', 'error', 'timeout'];
const CONNECT_EVENTS = ['connect', 'ready'];
class ISSocket extends net_1.Socket {
    host;
    port;
    callsign;
    passcode;
    filter;
    appId;
    id;
    _isSocketConnected;
    _bufferedData;
    constructor(host, port, callsign = "N0CALL", passcode = -1, filter, appId = `IS.js v1`, id = (0, uuid_1.v4)()) {
        super();
        this.host = host;
        this.port = port;
        this.callsign = callsign;
        this.passcode = passcode;
        this.filter = filter;
        this.appId = appId;
        this.id = id;
        this._bufferedData = '';
        this._isSocketConnected = false;
        this.setNoDelay(false);
        this.on('data', (data) => {
            this._bufferedData += data.toString();
            let msgs = this._bufferedData.split('\r\n');
            if (this._bufferedData.endsWith('\r\n')) {
                this._bufferedData = '';
                msgs = msgs.filter(msg => msg.trim() != '');
            }
            else {
                this._bufferedData = msgs[msgs.length - 1];
                msgs = msgs.slice(0, -1);
            }
            this.emitPackets(msgs);
        });
        for (const e of DISCONNECT_EVENTS) {
            this.on(e, () => {
                this._isSocketConnected = false;
            });
        }
        for (const e of CONNECT_EVENTS) {
            this.on(e, () => {
                this._isSocketConnected = true;
            });
        }
    }
    connect(callback) {
        super.connect(this.port, this.host, () => {
            if (callback) {
                callback();
            }
        });
    }
    disconnect(callback) {
        return super.end("", () => {
            if (callback) {
                callback();
            }
        });
    }
    sendLine(line) {
        if (this._isSocketConnected === false) {
            throw new Error('Socket not connected.');
        }
        const data = `${line}${MESSAGE_DELIMITER}`;
        this.emit('sending', data);
        this.emit('data', data);
        this.write(data, 'utf8');
    }
    isConnected() {
        return this._isSocketConnected === true;
    }
    get userLogin() {
        return `user ${this.callsign} pass ${this.passcode} vers ${this.appId}`
            + ((this.filter == undefined || !this.filter) ? '' : ` filter ${this.filter}`);
    }
    emitPackets(msgs) {
        msgs.forEach(msg => {
            this.emit("packet", msg);
        });
    }
}
exports.ISSocket = ISSocket;
;
//# sourceMappingURL=ISSocket.js.map