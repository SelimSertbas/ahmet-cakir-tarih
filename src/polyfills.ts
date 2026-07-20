import { Buffer } from 'buffer';
import process from 'process';
import { EventEmitter } from 'events';

type UtilType = {
  debuglog: (namespace: string) => (...args: any[]) => void;
  inspect: (obj: any) => string;
};

// Create a custom util object with our implementations
const customUtil: UtilType = {
  debuglog: (_namespace: string) => (..._args: any[]) => {},
  inspect: (obj: any) => JSON.stringify(obj, null, 2)
};

// Make these available globally
declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: typeof process;
    EventEmitter: typeof EventEmitter;
    util: UtilType;
    TextEncoder: typeof TextEncoder;
    TextDecoder: typeof TextDecoder;
  }
}

window.Buffer = Buffer;
window.process = process;
window.EventEmitter = EventEmitter;
window.util = customUtil;

// Polyfills for older browsers
if (typeof window !== 'undefined') {
  // Add any browser polyfills here
  if (!window.TextEncoder) {
    window.TextEncoder = require('text-encoding').TextEncoder;
  }
  if (!window.TextDecoder) {
    window.TextDecoder = require('text-encoding').TextDecoder;
  }
}

export {}; 