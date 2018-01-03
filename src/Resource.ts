/**
 * @file Class Resource
 */

import { replace, isFunction } from './tools'

interface ResourceServer {
  (input: RequestInfo, init?: RequestInit): Promise<Response>
}

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
let resource_server: ResourceServer = function (input: RequestInfo, init?: RequestInit): Promise<Response> {
  return window.fetch(input, init)
}

/**
 * @param {Response} res
 * @return {Boolean}
 */
function isOk(res: Response | null) {
  if (!res) return false
  return res.status < 500
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
class Resource<T> {
  private promise: Promise<Response>
  private uri: string
  private server: ResourceServer

  constructor(uri: string) {
    this.uri = uri
    this.server = resource_server
  }

  /**
   * 发送get请求
   * @param param
   * @param data
   * @param option
   * @return {Resource}
   */
  get(param: any, data: any, option = {}): Resource<T> {
    return this.send(param, 'get', data, option)
  }

  /**
   * 发送post请求
   * @param param
   * @param data
   * @param option
   * @return {Resource}
   */
  post(param: any, data: any, option = {}): Resource<T> {
    return this.send(param, 'post', data, option)
  }

  /**
   * 发送put请求
   * @param param
   * @param data
   * @param option
   * @return {Resource}
   */
  put(param: any, data: any, option = {}): Resource<T> {
    return this.send(param, 'put', data, option)
  }

  /**
   * 发送del请求
   * @param param
   * @param data
   * @param option
   * @return {Resource}
   */
  del(param: any, data: any, option = {}): Resource<T> {
    return this.send(param, 'delete', data, option)
  }

  /**
   * 发送请求
   * @param params
   * @param method
   * @param data
   * @param other
   * @return {Resource}
   */
  send(params: any, method: string, data: any, other = {}): Resource<T> {
    this.promise = this.server(replace(this.uri, params || {}), {
      body: data,
      method,
      ...other
    })
    return this
  }

  /**
   * 返回ArrayBuffer结果
   * @return {Promise<ArrayBuffer>}
   */
  arrayBuffer(): Promise<ArrayBuffer> {
    if (!this.promise)
      throw new Error('Need send a request before invoke Response.arrayBuffer()')
    return this.promise.then(resp => {
      return isOk(resp) ? resp.arrayBuffer() : Promise.resolve<ArrayBuffer>(new ArrayBuffer(0))
    })
  }

  /**
   * 返回Blob结果
   * @return {Promise<Blob>}
   */
  blob(): Promise<Blob> {
    if (!this.promise)
      throw new Error('Need send a request before invoke Response.blob()')
    return this.promise.then(resp => {
      return isOk(resp) ? resp.blob() : Promise.resolve(new Blob())
    })
  }

  /**
   * 返回JSON结果
   * @return {Promise<*>}
   */
  json(): Promise<T> {
    if (!this.promise)
      throw new Error('Need send a request before invoke Response.json()')
    return this.promise.then((resp: Response) => {
      return isOk(resp) ? resp.json() : Promise.resolve({})
    })
  }

  /**
   * 返回String结果
   * @return {Promise<String>}
   */
  text(): Promise<string> {
    if (!this.promise)
      throw new Error('Need send a request before invoke Response.text()')
    return this.promise.then(resp => {
      return isOk(resp) ? resp.text() : Promise.resolve('')
    })
  }

  /**
   * 返回FromData
   * @return {Promise<FormData>}
   */
  formData(): Promise<FormData> {
    if (!this.promise)
      throw new Error('Need send a request before invoke Response.formData()')
    return this.promise.then(resp => {
      return isOk(resp) ? resp.formData() : Promise.resolve(new FormData())
    })
  }

  /**
   * 创建Resource快捷方式
   * @param uri
   * @return {Resource}
   */
  static create<T>(uri: string): Resource<T> {
    return new Resource<T>(uri)
  }

  /**
   * 发送get请求快捷方式
   * @param uri
   * @param params
   * @param data
   * @param options
   * @return {Resource}
   */
  static get<T>(uri: string, params: any, data?: any, options?: any): Resource<T> {
    return new Resource<T>(uri).get(params, data, options)
  }

  /**
   * 发送post请求快捷方式
   * @param uri
   * @param params
   * @param data
   * @param options
   * @return {Resource}
   */
  static post<T>(uri: string, params: any, data: any, options?: any): Resource<T> {
    return new Resource<T>(uri).post(params, data, options)
  }

  /**
   * 发送put请求快捷方式
   * @param uri
   * @param params
   * @param data
   * @param options
   * @return {Resource}
   */
  static put<T>(uri: string, params: any, data: any, options?: any): Resource<T> {
    return new Resource<T>(uri).put(params, data, options)
  }

  /**
   * 发送del请求快捷方式
   * @param uri
   * @param params
   * @param data
   * @param options
   * @return {Resource}
   */
  static del<T>(uri: string, params: any, data: any, options?: any): Resource<T> {
    return new Resource<T>(uri).del(params, data, options)
  }

  /**
   * 重新注册发送请求函数
   * @param server
   */
  static setServer(server: ResourceServer): ResourceServer {
    if (!isFunction(server)) {
      throw new TypeError('resource server must be a function')
    }
    resource_server = server
    return server
  }
}

export {
  Resource
}
