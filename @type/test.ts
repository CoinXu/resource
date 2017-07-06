import {Resource, ResourceServer} from './index'

interface Type {
  a: string
  b: number
  c: any
}

async function main () {
  const uri: string = '/path/to/:params'
  const resource = new Resource<Type>(uri)

  const data: any = {}
  const params = {params: 'params'}
  const option = {}

  // ==================
  // method
  // ==================


  let result: Type
  result = await resource.get(params, data, option).json()
  result = await resource.post(params, data, option).json()
  result = await resource.put(params, data, option).json()
  result = await resource.del(params, data, option).json()
  result = await resource.send(params, 'option', data, option).json()

  console.log(result.a)
  console.log(result.b)
  console.log(result.c)
  // console.log(res.d) // error

  // ==================
  // response types
  // ==================
  const res: Resource<Type> = resource.get(params, data, option)
  const buf: ArrayBuffer = await res.arrayBuffer()
  const blob: Blob = await res.blob()
  const json: Type = await res.json()
  const text: string = await res.text()
  const formData: FormData = await res.formData()

  // ==================
  // static
  // ==================
  const resource_1: Resource<Type> = Resource.create<Type>(uri)
  const get: Resource<Type> = Resource.get(uri, data, option)
  const post: Resource<Type> = Resource.post(uri, data, option)
  const put: Resource<Type> = Resource.put(uri, data, option)
  const del: Resource<Type> = Resource.del(uri, data, option)
  const server: ResourceServer = Resource.setServer((input: string, init?: any) => window.fetch(input, init))
}
