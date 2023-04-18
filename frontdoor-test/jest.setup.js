// Install jsdom:
// npm install --save-dev jsdom

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const { window } = new JSDOM('<!doctype html><html><body></body></html>');

global.chrome = {
    storage: {
        local: {
            get: jest.fn(),
            set: jest.fn(),
            remove: jest.fn(),
            clear: jest.fn(),
        },
        sync: {
            get: jest.fn(),
            set: jest.fn(),
            remove: jest.fn(),
            clear: jest.fn(),
        },
    },
};

// Use `window` as your global object:
global.window = window;
