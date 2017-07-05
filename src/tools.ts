/**
 * 替换掉url中的参数。
 * @example
 * replace('/a/:b', {b:'c'}) // '/a/c'
 *
 * @param {string} uri
 * @param {object} params
 * @return {string}
 */

const URL_REG = /\/(:(\w+))/
const ObjectProp = Object.prototype

function replace (uri: string, params: any): string {
  let p: string[]
  let o: string
  let k: string
  let r: string = uri

  while ((p = URL_REG.exec(r)) !== null) {
    o = p[1]
    k = p[2]
    r = r.replace(o, params[k])
  }

  return r
}

function isFunction (v: any): boolean {
  return ObjectProp.toString.call(v) === '[object Function]'
}

function toString (v: any): string {
  return '' + v
}

export {
  replace,
  isFunction,
  toString
}
