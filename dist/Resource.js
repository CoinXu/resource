"use strict";
/**
 * @file Class Resource
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
/**
 * 给 Resource 提供发送请求的服务函数。
 * 必须接受一个配置参数。
 * 必须返回一个`Promise`，其中包含了请求的结果。
 * 并且返回的值为`string`类型，不要处理为json。
 * 也不能返回二进制数据。
 *
 * @param {RequestInfo} input
 * @param {RequestInit} init
 * @return {Promise<Response>}
 */
var resource_server = function (input, init) {
    return window.fetch(input, init);
};
/**
 * @param {Response} res
 * @return {Boolean}
 */
function isOk(res) {
    if (!res)
        return false;
    var ok = res.ok, status = res.status;
    return ok || status === 200 || status === 204 || status === 304;
}
/**
 * @class Resource
 * @description 定义一个接口所有操作，并统一返回规范
 * @example
 * ```TypeScript
 *  const resource = Resource.create<{key:string}>('/path/to/:param')
 *  const result = await resource.get({param:'body'}).json()
 *  console.log(result.key)
 * ```
 */
var Resource = (function () {
    function Resource(uri) {
        this.uri = uri;
        this.server = resource_server;
    }
    /**
     * 发送get请求
     * @param param
     * @param data
     * @param option
     * @return {Resource}
     */
    Resource.prototype.get = function (param, data, option) {
        if (option === void 0) { option = {}; }
        return this.send(param, 'get', data, option);
    };
    /**
     * 发送post请求
     * @param param
     * @param data
     * @param option
     * @return {Resource}
     */
    Resource.prototype.post = function (param, data, option) {
        if (option === void 0) { option = {}; }
        return this.send(param, 'post', data, option);
    };
    /**
     * 发送put请求
     * @param param
     * @param data
     * @param option
     * @return {Resource}
     */
    Resource.prototype.put = function (param, data, option) {
        if (option === void 0) { option = {}; }
        return this.send(param, 'put', data, option);
    };
    /**
     * 发送del请求
     * @param param
     * @param data
     * @param option
     * @return {Resource}
     */
    Resource.prototype.del = function (param, data, option) {
        if (option === void 0) { option = {}; }
        return this.send(param, 'delete', data, option);
    };
    /**
     * 发送请求
     * @param params
     * @param method
     * @param data
     * @param other
     * @return {Resource}
     */
    Resource.prototype.send = function (params, method, data, other) {
        if (other === void 0) { other = {}; }
        this.promise = this.server(tools_1.replace(this.uri, params || {}), __assign({ body: data, method: method }, other));
        return this;
    };
    /**
     * 返回ArrayBuffer结果
     * @return {Promise<ArrayBuffer>}
     */
    Resource.prototype.arrayBuffer = function () {
        if (!this.promise)
            throw new Error('Need send a request before invoke Response.arrayBuffer()');
        return this.promise.then(function (resp) {
            return isOk(resp) ? resp.arrayBuffer() : Promise.resolve(new ArrayBuffer(0));
        });
    };
    /**
     * 返回Blob结果
     * @return {Promise<Blob>}
     */
    Resource.prototype.blob = function () {
        if (!this.promise)
            throw new Error('Need send a request before invoke Response.blob()');
        return this.promise.then(function (resp) {
            return isOk(resp) ? resp.blob() : Promise.resolve(new Blob());
        });
    };
    /**
     * 返回JSON结果
     * @return {Promise<*>}
     */
    Resource.prototype.json = function () {
        if (!this.promise)
            throw new Error('Need send a request before invoke Response.json()');
        return this.promise.then(function (resp) {
            return isOk(resp) ? resp.json() : Promise.resolve({});
        });
    };
    /**
     * 返回String结果
     * @return {Promise<String>}
     */
    Resource.prototype.text = function () {
        if (!this.promise)
            throw new Error('Need send a request before invoke Response.text()');
        return this.promise.then(function (resp) {
            return isOk(resp) ? resp.text() : Promise.resolve('');
        });
    };
    /**
     * 返回FromData
     * @return {Promise<FormData>}
     */
    Resource.prototype.formData = function () {
        if (!this.promise)
            throw new Error('Need send a request before invoke Response.formData()');
        return this.promise.then(function (resp) {
            return isOk(resp) ? resp.formData() : Promise.resolve(new FormData());
        });
    };
    /**
     * 创建Resource快捷方式
     * @param uri
     * @return {Resource}
     */
    Resource.create = function (uri) {
        return new Resource(uri);
    };
    /**
     * 发送get请求快捷方式
     * @param uri
     * @param params
     * @param data
     * @param options
     * @return {Resource}
     */
    Resource.get = function (uri, params, data, options) {
        return new Resource(uri).get(params, data, options);
    };
    /**
     * 发送post请求快捷方式
     * @param uri
     * @param params
     * @param data
     * @param options
     * @return {Resource}
     */
    Resource.post = function (uri, params, data, options) {
        return new Resource(uri).post(params, data, options);
    };
    /**
     * 发送put请求快捷方式
     * @param uri
     * @param params
     * @param data
     * @param options
     * @return {Resource}
     */
    Resource.put = function (uri, params, data, options) {
        return new Resource(uri).put(params, data, options);
    };
    /**
     * 发送del请求快捷方式
     * @param uri
     * @param params
     * @param data
     * @param options
     * @return {Resource}
     */
    Resource.del = function (uri, params, data, options) {
        return new Resource(uri).del(params, data, options);
    };
    /**
     * 重新注册发送请求函数
     * @param server
     */
    Resource.setServer = function (server) {
        if (!tools_1.isFunction(server)) {
            throw new TypeError('resource server must be a function');
        }
        resource_server = server;
        return server;
    };
    return Resource;
}());
exports.Resource = Resource;
//# sourceMappingURL=Resource.js.map