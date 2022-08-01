const fetch = require('node-fetch')

class BaseApi {
  constructor(apiPrefix) {
    this.apiPrefix = apiPrefix
  }

  request(method, url, params = {}) {
    const { body, headers } = params
    const reqBody = typeof body === 'string' ? body : JSON.stringify(body)
    return fetch(this.apiPrefix + url, {
      method: method,
      body: reqBody,
      headers,
    })
  }
}

const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
}

module.exports = {
  BaseApi,
  HttpMethod,
}
