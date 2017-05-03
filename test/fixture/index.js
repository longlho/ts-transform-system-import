"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBar() {
    return Promise.resolve(require('./foo')).then(m => m.default());
}
exports.default = getBar;
