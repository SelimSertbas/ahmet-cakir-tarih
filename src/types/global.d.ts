import { EventEmitter } from 'events';
import * as http2 from 'http2-wrapper';
import * as util from 'util-inspect';

declare global {
  interface Window {
    EventEmitter: typeof EventEmitter;
    http2: typeof http2;
    util: typeof util & {
      debuglog: (namespace: string) => (...args: any[]) => void;
      inspect: (obj: any) => string;
    };
  }
} 