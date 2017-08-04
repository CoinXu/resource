/**
 * Created by asd on 17-8-4.
 */

import { createServer } from 'http'

process.on('uncaughtException', function () {
  console.log(arguments)
})

class Server {
  constructor (port = 9111, host = '0.0.0.0') {
    this.port = port
    this.host = host
    this.server = createServer((req, res) => this.router(req, res))
  }

  start (callback) {
    this.server.listen(this.port, this.host, callback)
  }

  stop (callback) {
    this.server.close(callback)
  }

  getHost () {
    return `http://${this.host}:${this.port}`
  }

  router (req, res) {
    const { method } = req
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      message: `${method} request success`,
      success: true
    }));
  }
}

export default Server