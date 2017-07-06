"use strict";
/**
 * 替换掉url中的参数。
 * @example
 * replace('/a/:b', {b:'c'}) // '/a/c'
 *
 * @param {string} uri
 * @param {object} params
 * @return {string}
 */
Object.defineProperty(exports, "__esModule", { value: true });
var URL_REG = /\/(:(\w+))/;
var ObjectProp = Object.prototype;
function replace(uri, params) {
    var p;
    var o;
    var k;
    var r = uri;
    while ((p = URL_REG.exec(r)) !== null) {
        o = p[1];
        k = p[2];
        r = r.replace(o, params[k]);
    }
    return r;
}
exports.replace = replace;
function isFunction(v) {
    return ObjectProp.toString.call(v) === '[object Function]';
}
exports.isFunction = isFunction;
function toString(v) {
    return '' + v;
}
exports.toString = toString;
//# sourceMappingURL=tools.js.map