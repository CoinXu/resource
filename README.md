[![Build Status](https://travis-ci.org/CoinXu/resource.svg?branch=master)](https://travis-ci.org/CoinXu/resource)
[![npm version](https://badge.fury.io/js/sugo-resource.svg)](https://badge.fury.io/js/sugo-resource)


# 目的
1. 为接口提供统一管理能力
2. 统一接口相关api

# 特性
1. url参数解析
2. 返回值容错
3. 返回结果为Promise

# 示例
```js
import { Resource } from 'resource'
// create instance
const $resources = {
    create: Resource.create('/user/create'),
    findOne: Resource.create('/user/find/:email')
}
// use
// post
const create_res = await $resources.create({}, {email: 'xxx@xx.xx', password:'xxx'}).json()
console.log(create_res) // {...}
// get
const find_res = await $resources.findOne({email: 'xxx@xx.xx'}, {}).json()
console.log(find_res) // {...}
// static
// send post request
const sign_res = await Resouce.post('/user/sign', {}, {email: 'xxx@xx.xx', password:'xxx'}).json()
console.log(sign_res) // {...}
```

# 实例方法
1. resource.get(param:any, data:any, option = {}): Resource
2. resource.post(param:any, data:any, option = {}): Resource
3. resource.put(param:any, data:any, option = {}): Resource
4. resource.del(param:any, data:any, option = {}): Resource
5. resource.send(param:any, method:string, data:any, option = {}): Resource
6. resource.arrayBuffer(): Promise<ArrayBuffer>
7. resource.blob(): Promise<Blob>
8. resource.json(): Promise<any>
9. resource.text(): Promise<string>
9. resource.formData(): Promise<FormData>

# 静态方法
1. Resource.create(uri:string): Resource
2. Resource.get(uri:string, params:any, data:any, options:any): Resource
3. Resource.post(uri:string, params:any, data:any, options:any): Resource
4. Resource.put(uri:string, params:any, data:any, options:any): Resource
5. Resource.del(uri:string, params:any, data:any, options:any): Resource

# 配置请求服务函数
Resource 默认使用`window.fetch`提供发送请求能力，如果用户需要其他发送请求工具，
可以通过`Resource.setServer`来变发送请求功能，`server`函数必需满足如下定义。
```TypeScript
function server(input: RequestInfo, init?: RequestInit): Promise<Response>
```
1. 接收两个参数
  + input可以是一个`uri:string`，也可能是一个新的[Request](https://developer.mozilla.org/zh-CN/docs/Web/API/Request/Request)对象
  + init为请求配置，详细见 [https://developer.mozilla.org/zh-CN/docs/Web/API/Request/Request](https://developer.mozilla.org/zh-CN/docs/Web/API/Request/Request)
2. 返回值为一个Promise，Promise结果必须为[Response](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)

```js
import {Resource} from 'resource'
Resource.setServer(function(input, opt){
    const {method, body} = opt
    if (method === 'get') {
        return window.fetch(input)
    }
    if (method === 'post') {
        return window.fetch(input, {
            headers: {
                'Content-type':'application/json'
            },
            credentials: 'include',
            body: typeof body === 'object' ? JSON.stringfy(body) : body
        })
    }
    return window.fetch(input, opt)
})
```

在服务端可以使用`node-fetch`来代替
```js
import fetch from 'node-fetch'
import {Resource} from 'resource'
Resource.setServer(function(input, init){
    return fetch(input, init)
})
```

