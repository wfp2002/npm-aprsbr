/// <reference types="node" />
import { Socket } from 'net';
export declare class ISSocket extends Socket {
    host: string;
    port: number;
    callsign: string;
    passcode: number;
    filter: any;
    appId: string;
    id: string | number;
    private _isSocketConnected;
    private _bufferedData;
    constructor(host: string, port: number, callsign?: string, passcode?: number, filter?: any, appId?: string, id?: string | number);
    connect(callback?: any): any;
    disconnect(callback?: any): any;
    sendLine(line: string): void;
    isConnected(): boolean;
    get userLogin(): string;
    private emitPackets;
}
