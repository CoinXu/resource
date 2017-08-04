/**
 * Created by asd on 17-8-4.
 */

import { Resource } from '../dist'
import Server from './Server'
import { ok } from 'assert'
import fetch from 'node-fetch'

Resource.setServer(function (input, init) {
  const { method, ...other } = init
  return fetch(input, {
    ...other,
    method: method.toUpperCase()
  })
})

function isJson (val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

describe('Response Tests', function () {

  const server = new Server()
  const host = server.getHost()

  const $resources = {
    get: Resource.create(host),
    post: Resource.create(host),
    put: Resource.create(host),
    del: Resource.create(host)
  }

  it('Server start at => ' + host, function (done) {
    server.start(done)
  })

  it('Send a get request and return json', function (done) {
    $resources.get.get({}, {}).json().then(function (json) {
      console.log('get.res => %s', JSON.stringify(json))
      ok(isJson(json))
      done()
    })
  })

  it('Send a post request and return json', function (done) {
    $resources.post.post({}, {}).json().then(function (json) {
      console.log('post.res => %s', JSON.stringify(json))
      ok(isJson(json))
      done()
    })
  })

  it('Send a put request and return json', function (done) {
    $resources.put.put({}, {}).json().then(function (json) {
      console.log('put.res => %s', JSON.stringify(json))
      ok(isJson(json))
      done()
    })
  })

  it('Send a del request and return json', function (done) {
    $resources.del.del({}, {}).json().then(function (json) {
      console.log('del.res => %s', JSON.stringify(json))
      ok(isJson(json))
      done()
    })
  })

  it('stop server', function (done) {
    server.stop(done)
  })

})



