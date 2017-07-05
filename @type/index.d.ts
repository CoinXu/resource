// Definitions by: Coinxu <https://github.com/CoinXu>
// TypeScript Version: 2.4

export = Resource
export as namespace Resource

declare namespace Resource {

  interface ResourceServer {
    (input: RequestInfo, init?: RequestInit): Promise<Response>
  }

  interface Resource<T> {
    readonly promise: Promise<Response>
    readonly uri: string
    readonly server: ResourceServer

    get(param: any, data: any, option?: any): Resource<T>
    post(param: any, data: any, option?: any): Resource<T>
    put(param: any, data: any, option?: any): Resource<T>
    del(param: any, data: any, option?: any): Resource<T>
    send(param: any, method: string, data: any, other?: any): Resource<T>

    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    json(): Promise<T>;
    text(): Promise<string>;
    formData(): Promise<FormData>;
  }

  export interface ResourceConstructor {
    new<T>(uri: string): Resource<T>
    create<T>(uri: string): Resource<T>
    get<T>(uri: string, params: any, data: any, options?: any): Resource<T>
    post<T>(uri: string, params: any, data: any, options?: any): Resource<T>
    put<T>(uri: string, params: any, data: any, options?: any): Resource<T>
    del<T>(uri: string, params: any, data: any, options?: any): Resource<T>
    setServer(server: ResourceServer): ResourceServer
  }

  export const Resource: ResourceConstructor
}


